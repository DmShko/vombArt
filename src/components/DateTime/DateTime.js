import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux';

import { change } from 'vomgallStore/gallerySlice';

import ti from './DateTime.module.scss'

import ArtAnimaLeft from './ArtAnimaLeft/ArtAnimaLeft';
import ArtAnimaRight from './ArtAnimaRight/ArtAnimaRight';

const DateTime = () => {

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
            <h1 className={ti.animaTitle}>TODAY</h1>
            <div className={ti.animaElement}>
                <div className={ti.animaDate}>
                    <p className={ti.animaDateText}>{newDateObj.length !== 0 && newDateObj.datedata}</p>
                </div>

                <ArtAnimaLeft />

                <div className={ti.animaTime} style={{backgroundImage: `conic-gradient(var(--main-text-color) ${(360/60) * (newDateObj.dateSeconds || 60)}deg, white 0deg)`}}>
                    <p className={ti.animaTimeText} >{newDateObj.length !== 0 && newDateObj.timedata}</p>
                </div>

                <ArtAnimaRight />
                
                <div className={ti.animaYear}>
                    <p className={ti.animaYearText}>{newDateObj.length !== 0 && newDateObj.yeardata}</p>
                </div>
            </div> 

        </section>
  )
}

export default DateTime