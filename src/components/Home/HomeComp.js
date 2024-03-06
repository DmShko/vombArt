import { useEffect, useState } from 'react'; 

import { useNavigate, useLocation } from 'react-router-dom';

import { useSelector } from 'react-redux'; 

import DateTime from '../DateTime/DateTime'

import motion from '../../images/Write Messages.gif';

import { ReactComponent as GearImg } from '../../images/pair-of-gears-svgrepo-com.svg';
import { ReactComponent as DialogImg } from '../../images/dialog-2-svgrepo-com.svg';
import { ReactComponent as FlexImg } from '../../images/flexible-access-svgrepo-com.svg';
import { ReactComponent as PlusImg } from '../../images/plus-circle-svgrepo-com.svg';

import { useTransition, animated } from '@react-spring/web';

import hm from './HomeComp.module.scss';

import Notiflix from 'notiflix';
Notiflix.Report.init({titleFontSize: '24px',});

const HomeComp = () => {
  const messages = ['Share your creativity in the artistic community', 
  'Meet like-minded people', 'Create your own styles.', 'Share your impressions.']

  const navigate = useNavigate();
  const location = useLocation();
 
  const selectorSingIn = useSelector(state => state.singIn);
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

  const clickHero = () => {

    if(!selectorSingIn.isSingIn) {
      Notiflix.Report.info('Please, SingIn or SingUp');
    } else {
      navigate('/workspace');
    };
   
  };

  const clickCommunity = () => {

    if(!selectorSingIn.isSingIn) {
      Notiflix.Report.info('Please, SingIn or SingUp');
    } else {
      navigate('/community');
    };
   
  };

  return (

  <>

    <div className={hm.container}>

      <div className={hm.time}>

        <DateTime />
     
      </div>

      <div className={hm.infoBlock}>
        <GearImg style={{width: '40px', height: '40px'}}/>
        <PlusImg style={{width: '20px', height: '20px'}}/>
        <DialogImg style={{width: '40px', height: '40px'}}/>
        <PlusImg style={{width: '20px', height: '20px'}}/>
        <FlexImg style={{width: '40px', height: '40px'}}/>
      </div>

      <div className={hm.hero}>

        <div className={hm.leftblock}>
          <img src={motion} alt='write messages'/>
        </div>

        <div className={hm.rightblock}>
          
          <p className={hm.heroTitle}> Workspace</p> 
          <p className={hm.heroDescryption}>Your best thoughts should be here. Create your own styles or use the basic ones in one of three directions. Fill them with creative ideas. It can be written works, painting or music. Start right now!</p> 
          <button className={hm.heroButton} onClick={clickHero}>Try</button>

        </div>  

      </div>

      <div className={`${hm.hero} ${hm.heroCommunity}`}>

        <div className={hm.communityBoard}>
          <p className={hm.communityTitle}>Community</p>
          <p className={hm.communityDescryption}>The Community section allows you to get to know other users of the site, review their work, share impressions, rate, and, of course, just chat. Bring a part of your soul into the world of art. Try it right now!</p>
          <button className={hm.communityButton} onClick={clickCommunity}>Try</button>
        </div>

        <div className={hm.messageBoard}>

          {location.pathname === '/' ? transitions((style, item) => (
              <animated.div className={hm.boardItem} style={style}>
                {item}
              </animated.div>
          )) : ''}

        </div>
       
      </div>
      
    </div>
   
  </>
    
  )
}

export default HomeComp