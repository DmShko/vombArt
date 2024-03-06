import { useEffect, useState, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux';

import { useLocation } from 'react-router-dom'; 

import { useTransition, animated } from '@react-spring/web';

import { change } from 'vomgallStore/gallerySlice';

import ti from './DateTime.module.scss'

// import ArtAnimaLeft from './ArtAnimaLeft/ArtAnimaLeft';
// import ArtAnimaRight from './ArtAnimaRight/ArtAnimaRight';
import { ReactComponent as FeatherImg } from '../../images/date-time/fathers/feather-svgrepo-com.svg';

const DateTime = () => {

    const [parameters, setParameters] = useState([]);
    const [bottleStartY, setBottleStartY] = useState(0);

    const location = useLocation();
    const timeRef = useRef();

    const dispatch = useDispatch();
    const selectorGallSlice = useSelector(state => state.gallery);
    
    const [ timeValue, setTimeValue ]= useState({time: new Date()});
    const [ newDateObj, setNewDateObj ]= useState({});

    useEffect(() => {

        let timerID = setTimeout(
            () => tick(),
            1000
          );

        return () => {
            setTimeout(timerID);
        };
        // eslint-disable-next-line
    },[newDateObj]);

    useEffect(() => {

        function handleWindowResize() {
          setParameters([]);
        }
    
        window.addEventListener('resize', handleWindowResize);
    
        // generate random parameter of elements
        const random = () => {
    
          let bottleCenterX = 0;
    
          if (timeRef.current !== null) {
    
            // start coordinate of bottle for bubble 
            bottleCenterX = timeRef.current.offsetWidth / 2;
            setBottleStartY(timeRef.current.offsetHeight);
          }
    
          return {
            size: timeRef.current  
            ? randomGenerator(30, 5) : '',
            x: randomGenerator(bottleCenterX + timeRef.current.offsetWidth / 2, bottleCenterX - timeRef.current.offsetWidth / 2),
          };
        };
        
        // random generation interval
        const timer1 = setInterval(() => {
          parameters.length >= 20 
            ? setParameters(parameters.filter(element => element.size !== randomGenerator(20, 5)))
            : setParameters([...parameters, random()]);
        }, randomGenerator(250, 50) * 10);
    
        return () => {
          clearInterval(timer1);
          window.removeEventListener('resize', handleWindowResize);
        };
        
      }, [parameters]);
    
      const randomGenerator = (max, min) => {
        return Math.round(Math.random() * (max - min) + min);
      };

    const transitions = useTransition(parameters, {
        from: { transform: `translateY(${bottleStartY}px) rotateY(-90deg)`, opacity: '1' },
        enter: { transform: `translateY(${timeRef.current ? timeRef.current.offsetHeight - timeRef.current.offsetHeight : 0}) rotateY(90deg)`,},
        config: {
          duration: randomGenerator(4000, 2000),
          friction: randomGenerator(300, 5) * 10,
        },
    });

    const tick = () => {
        setTimeValue({
          time: new Date()
        });
        
        const dateHours =  timeValue.time.getHours().toString().length === 1 ? "0" +  timeValue.time.getHours().toString() :  timeValue.time.getHours().toString();
        const dateMinutes =  timeValue.time.getMinutes().toString().length === 1 ? "0" +  timeValue.time.getMinutes().toString() : timeValue.time.getMinutes().toString();
        const dateSeconds =  timeValue.time.getSeconds();
  
        // get date
        const dateDay =  timeValue.time.getDate().toString().length === 1 ? "0" +  timeValue.time.getDate().toString() :  timeValue.time.getDate().toString();
        const dateMonth =  timeValue.time.getMonth().toString().length === 1 ? "0" + (timeValue.time.getMonth() + 1).toString() : (timeValue.time.getMonth() + 1).toString();
        
        const timedata = dateHours + ":" + dateMinutes;
        const datedata = dateDay + "/" + dateMonth;
        const yeardata =  timeValue.time.getFullYear();
  
        setNewDateObj({ timedata, datedata, yeardata, dateSeconds });
        
        // save day if he different
        if(datedata !== selectorGallSlice.date) dispatch(change({ operation: 'changeDate', data: datedata }));

    };

    return (
        /*-- Date lightbox --*/
        <section className={`${ti.animaSection} ${ti.animaContainer}`} >
            <div className={ti.dateContainer} ref={timeRef}>
            {location.pathname === '/' ? 
                    transitions((style, item) => (
                        <animated.div style={style}>
                        
                            <FeatherImg style={{
                            position: 'absolute',
                            width: `${item.size}px`,
                            height: `${item.size}px`,
                            left: `${item.x}px`,
                            }}/> 

                        </animated.div>
                )) : ''}
                <h1 className={ti.animaTitle}>TODAY</h1>

                <div className={ti.animaElement}>
                    <div className={ti.animaDate}>
                        <p className={ti.animaDateText}>{newDateObj.length !== 0 && newDateObj.datedata}</p>
                    </div>

                

                    <div className={ti.animaTime} style={{backgroundImage: `conic-gradient(var(--main-text-color) ${(360/60) * (newDateObj.dateSeconds || 60)}deg, white 0deg)`}}>
                        <p className={ti.animaTimeText} >{newDateObj.length !== 0 && newDateObj.timedata}</p>
                    </div>

                    
                    <div className={ti.animaYear}>
                        <p className={ti.animaYearText}>{newDateObj.length !== 0 && newDateObj.yeardata}</p>
                    </div>
                </div> 

                <div className={ti.introduction}>
                    <p>
                    {selectorGallSlice.settings.languageSelector === 'English' ? <span>This is your creative world. Come on, show it to others!</span> : 
                        selectorGallSlice.settings.languageSelector === 'Українська' ? <span>Це твій творчий світ. Ну ж бо, покажи його іншим!</span> : 
                        selectorGallSlice.settings.languageSelector === 'Polska' ? <span>To jest Twój kreatywny świat. Cóż, Pokaż to innym!</span> : <span>This is your creative world. Come on,  show it to others!</span>}
                    </p>
                </div>

            </div>

        </section>
  )
}

export default DateTime