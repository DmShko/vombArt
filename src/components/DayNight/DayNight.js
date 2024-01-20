import { useState, useEffect} from 'react';

import { useDispatch, useSelector } from 'react-redux';

import dn from './DayNight.module.scss';

import {ReactComponent as SunImg} from '../../images/sun-2-svgrepo-com.svg';
import {ReactComponent as MoonImg} from '../../images/moon-svgrepo-com.svg';
import { change } from 'vomgallStore/gallerySlice';

const DayNight = () => {

  const dispatch = useDispatch();
  const selectorSingInSlice = useSelector(state => state.singIn);
  const selectorGallSlice = useSelector(state => state.gallery);

  const [dayNight, setDayNight] = useState(false);

  useEffect(() => {

    dispatch(change({ operation: 'changeDayNight', data: dayNight }));
    dispatch(change({operation: 'updateSettings', data:{item: 'checkDesign', value: dayNight}}));

  }, [dayNight])
  
  const dayNightHandler = (evt) => {
    if(evt.currentTarget.id === 'toggle') setDayNight(value => !value);
  };

  return (
   selectorSingInSlice.isSingIn &&
    <div className={dn.container} style={selectorGallSlice.dayNight ? {justifyContent: 'flex-end', backgroundColor: '#485a94',  boxShadow: 'inset 2px 2px 2px 1px #384a83',} : {justifyContent: 'flex-start',}}>

      <div onClick={dayNightHandler} style={selectorGallSlice.dayNight ? {boxShadow: '1px 1px 1px 1px #384a83', width: '24px', height: '24px', borderRadius: '50%',} : {boxShadow: '1px 1px 1px 1px gray', width: '24px', height: '24px', borderRadius: '50%',}} id='toggle' className={dn.imagesCont}>
        {selectorSingInSlice.isSingIn ? selectorGallSlice.dayNight ? <MoonImg className={dn.images} style={{width: '18px', height: '18px', padding: '3px', backgroundColor: 'rgb(122, 152, 206)', borderRadius: '50%',}}/> 
          : <SunImg className={dn.images} style={{width: '18px', height: '18px', padding: '3px', backgroundColor: 'lightgray', borderRadius: '50%',}}/> : ''}
      </div>
       
    </div> 
  )
}

export default DayNight