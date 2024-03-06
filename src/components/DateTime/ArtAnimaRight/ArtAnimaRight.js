import { useEffect, useState, useRef } from 'react'
import { useLocation } from 'react-router-dom'; 

import { ReactComponent as StarImg } from '../../../images/date-time/fathers/feather-quill-bird-write-svgrepo-com.svg';

import { useTransition, animated } from '@react-spring/web';

import ara from './ArtAnimaRight.module.scss';

const ArtAnima = () => {

    const [parameters, setParameters] = useState([]);
    const [bottleStartX, setBottleStartX] = useState(0);

    const location = useLocation();
    const timeRef = useRef();

    useEffect(() => {

        function handleWindowResize() {
          setParameters([]);
        }
    
        window.addEventListener('resize', handleWindowResize);
    
        // generate random parameter of elements
        const random = () => {
    
          let bottleCenterY = 0;
    
          if (timeRef.current !== null) {
    
            // start coordinate of bottle for bubble 
            bottleCenterY = timeRef.current.offsetHeight / 2;
            setBottleStartX(timeRef.current.offsetWidth - timeRef.current.offsetWidth);
          }
    
          return {
            size: timeRef.current  
            ? randomGenerator(20, 5) : '',
            y: randomGenerator(bottleCenterY + timeRef.current.offsetHeight / 4, bottleCenterY - timeRef.current.offsetHeight / 2),
          };
        };
        
        // random generation interval
        const timer1 = setInterval(() => {
          parameters.length >= 10 
            ? setParameters(parameters.filter(element => element.size !== randomGenerator(15, 5)))
            : setParameters([...parameters, random()]);
        }, randomGenerator(150, 50) * 10);
    
        return () => {
          clearInterval(timer1);
          window.removeEventListener('resize', handleWindowResize);
        };
        
      }, [parameters]);
    
      const randomGenerator = (max, min) => {
        return Math.round(Math.random() * (max - min) + min);
      };

    const transitions = useTransition(parameters, {
        from: { transform: `translateX(${bottleStartX}px) rotateX(-90deg)`, opacity: '1' },
        enter: { transform: `translateX(${timeRef.current ? randomGenerator(timeRef.current.offsetWidth, timeRef.current.offsetWidth / 5) : 0}) rotateX(90deg)`, opacity: '0.3'},
        config: {
          duration: randomGenerator(4000, 2000),
          friction: randomGenerator(300, 5) * 10,
        },
    });

    return (
        <div className={ara.container}  ref={timeRef} >
            {location.pathname === '/' ? 
                transitions((style, item) => (
                    <animated.div style={style}>
                       
                       <StarImg style={{
                        position: 'absolute',
                        width: `${item.size}px`,
                        height: `${item.size}px`,
                        top: `${item.y}px`,
                        }}/> 

                    </animated.div>
            )) : ''}

        </div>
    )
}

export default ArtAnima