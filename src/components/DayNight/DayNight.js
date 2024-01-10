import { useState} from 'react';

import { useSelector } from 'react-redux';

import dn from './DayNight.module.scss';

import {ReactComponent as SunImg} from '../../images/sun-2-svgrepo-com.svg';
import {ReactComponent as MoonImg} from '../../images/moon-svgrepo-com.svg';

const DayNight = () => {

  const selectorSingInSlice = useSelector(state => state.singIn);

  const [dayNight, setDayNight] = useState(false);
  
  const dayNightHandler = (evt) => {
    if(evt.currentTarget.id === 'toggle') setDayNight(value => !value);
  };

  return (
   selectorSingInSlice.isSingIn &&
    <div className={dn.container} style={dayNight ? {justifyContent: 'flex-end',} : {justifyContent: 'flex-start',}}>

      <div onClick={dayNightHandler} id='toggle' className={dn.imagesCont}>
        {selectorSingInSlice.isSingIn ? dayNight ? <MoonImg className={dn.images} style={{width: '18px', height: '18px', padding: '3px', backgroundColor: 'lightgray', borderRadius: '50%',}}/> 
          : <SunImg className={dn.images} style={{width: '18px', height: '18px', padding: '3px', backgroundColor: 'lightgray', borderRadius: '50%',}}/> : ''}
      </div>
       
    </div> 
  )
}

export default DayNight