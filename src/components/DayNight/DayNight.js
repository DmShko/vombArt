import { useState} from 'react';

import { useSelector } from 'react-redux';

import dn from './DayNight.module.scss';

import {ReactComponent as SunImg} from '../../images/sun-2-svgrepo-com.svg';
import {ReactComponent as MoonImg} from '../../images/moon-svgrepo-com.svg';

const DayNight = () => {

  const selectorSingInSlice = useSelector(state => state.singIn);

  const [dayChange, setDayChange] = useState(false);

  const over = () => {
    setDayChange(value => !value);
  };

  const out = () => {
    setDayChange(value => !value);
  };

  return (
    <div onMouseOver={over} onMouseOut={out}>
        {selectorSingInSlice.isSingIn ? dayChange ? <MoonImg className={dn.container} style={{width: '20px', height: '20px', padding: '3px', backgroundColor: 'lightgray', borderRadius: '50%',}}/> 
        : <SunImg className={dn.container} style={{width: '20px', height: '20px', padding: '3px', backgroundColor: 'lightgray', borderRadius: '50%',}}/> : ''}
    </div>
  )
}

export default DayNight