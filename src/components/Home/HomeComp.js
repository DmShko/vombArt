import { useEffect, useState } from 'react'; 

import DateTime from '../DateTime/DateTime'

import motion from '../../images/Write Messages.gif';

import { useTransition, animated } from '@react-spring/web'

import hm from './HomeComp.module.scss'

const HomeComp = () => {
  const messages = ['Share your creativity in the artistic community', 
  'Meet like-minded people', 'Create your own styles.', 'Share your impressions.']
 
  const [ messageItem, setMessageItem ] = useState(messages);
  const [ index, setIndex ] = useState(0);

  useEffect(() => {

    const timer = setInterval(() => {

      if(index === 3) {
        setIndex(0);
      } else {
        setIndex(value => value += 1);
      };
      
      setMessageItem(messages[index].split(' '));
      
    }, 2500);

    return () => {
      clearInterval(timer);
    };
    // eslint-disable-next-line
  }, [messageItem]);

  const transitions = useTransition(messageItem, {
  
    from: {transform: 'perspective(500px) rotateX(180deg)'},
    enter: {transform: 'perspective(500px) rotateX(0)'},
    config: {
      duration: 700,
      friction: 300,
    },
  });

  return (

  <>

    <div className={hm.container}>

      <div className={hm.time}>

      <DateTime />

      </div>

      <div className={hm.hero}>
        <div className={hm.leftblock}>
          
          <p> Welcome to WOMBART</p> 
          <p> Share your creativity in the artistic community </p> 
          
        </div>  
        <img src={motion} alt='write messages'/>
      </div>

      <div className={`${hm.hero} ${hm.heroCommunity}`}>

      <p> Community</p> 

      <div className={hm.messageBoard}>

        {transitions((style, item) => (
            <animated.div className={hm.boardItem} style={style}>
              {item}
            </animated.div>
          ))}

      </div>
       
      </div>
      
    </div>
   
  </>
    
  )
}

export default HomeComp