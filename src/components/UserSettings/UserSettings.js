import { React, useState, useEffect } from 'react';
import { useSelector } from 'react-redux/es/hooks/useSelector';
import { useDispatch } from 'react-redux';
import { change } from 'vomgallStore/gallerySlice';

import writeUserData from 'API/writerDB';
import useSound from 'use-sound';

import sound1 from '../../sounds/message-incoming-132126.mp3';
import sound2 from '../../sounds/new-notification-138807.mp3';
import sound3 from '../../sounds/interface-124464.mp3';

import { ReactComponent as TrumpetImg } from '../../images/trumpet-svgrepo-com.svg'

import se from './UserSettings.module.scss';

const UserSettings = () => {

  const selectorGallerySlice = useSelector(state => state.gallery);
  const selectorSingInSlice = useSelector(state => state.singIn);
  const dispatch = useDispatch();

  const [ design, setDesign ] = useState(selectorGallerySlice.settings.checkDesign);
  const [ email, setEmail ] = useState(selectorGallerySlice.settings.checkEmail);
  const [ sound, setSound ] = useState(selectorGallerySlice.settings.checkSound);
  const [ phone, setPhone ] = useState(selectorGallerySlice.settings.checkPhone);
  const [ colorSchem, setColorSchem ] = useState(selectorGallerySlice.settings.checkColorSchem);

  const [play1] = useSound(sound1);
  const [play2] = useSound(sound2);
  const [play3] = useSound(sound3);

  useEffect(() => {

    // scroll to top on page load
    window.scrollTo({top: 0, left: 0, behavior: 'smooth'});

  },[])

  useEffect(() => {

    dispatch(change({ operation: 'changeDayNight', data: selectorGallerySlice.settings.checkDesign }));
  // eslint-disable-next-line  
  },[selectorGallerySlice.settings.checkDesign])

  useEffect(() => {

    dispatch(change({operation: 'updateSettings', data:{item: 'checkDesign', value: design}}));
  // eslint-disable-next-line  
  },[design])

  useEffect(() => {

    dispatch(change({operation: 'updateSettings', data:{item: 'checkEmail', value: email}}));
  // eslint-disable-next-line  
  },[email])

  useEffect(() => {

    dispatch(change({operation: 'updateSettings', data:{item: 'checkSound', value: sound}}));
  // eslint-disable-next-line  
  },[sound])

  useEffect(() => {

    dispatch(change({operation: 'updateSettings', data:{item: 'checkPhone', value: phone}}));
  // eslint-disable-next-line  
  },[phone])

  useEffect(() => {

    dispatch(change({operation: 'updateSettings', data:{item: 'checkColorSchem', value: colorSchem}}));
  // eslint-disable-next-line  
  },[colorSchem])

  useEffect(() => {
      
    if(selectorSingInSlice.isSingIn === true) {
      
      const path = `${selectorGallerySlice.users.find(element => element.uid === selectorSingInSlice.singInId).userName}/Account/Settings`;

      writeUserData(
        path,
        selectorGallerySlice.settings,
        null, true
      );

      
    }
  // eslint-disable-next-line
  },[selectorGallerySlice.settings]);

  const langSelectChange = (evt) => {
    dispatch(change({operation: 'updateSettings', data:{item: 'languageSelector', value: evt.target.value}}));
  };

  const inputMessageSoundSelectChange = (evt) => {
    dispatch(change({operation: 'updateSettings', data:{item: 'inputSoundSelector', value: evt.target.value}}));
  };

  const outputMessageSoundSelectChange = (evt) => {
    dispatch(change({operation: 'updateSettings', data:{item: 'outputSoundSelector', value: evt.target.value}}));
  };

  const soundChange = () => {

    setSound(! sound);

  };

  const emailChange = () => {

    setEmail(! email);

  };

  const designChange = () => {

    setDesign(!design);
    
  };
  
  const phoneChange = () => {
    setPhone(! phone);
  };

  const checkSchemChange = () => {
    setColorSchem(! colorSchem);
  };

  const colorSchemHandler = (evt) => {
   
    if(evt.target.id === '1') dispatch(change({operation: 'changeColorSchem', data: 'rgba(151, 30, 207, 0.801)'}));
    if(evt.target.id === '2') dispatch(change({operation: 'changeColorSchem', data: 'rgba(207, 136, 30, 0.801)'}));
  };
  
  const soundReviewIn = () => {
    if(selectorGallerySlice.settings.inputSoundSelector === 'Sound_1') play1();
    if(selectorGallerySlice.settings.inputSoundSelector === 'Sound_2') play2();
    if(selectorGallerySlice.settings.inputSoundSelector === 'Sound_3') play3();
  };

  const soundReviewPersonal = () => {
    if(selectorGallerySlice.settings.outputSoundSelector === 'Sound_1') play1();
    if(selectorGallerySlice.settings.outputSoundSelector === 'Sound_2') play2();
    if(selectorGallerySlice.settings.outputSoundSelector === 'Sound_3') play3();
  };

  return (
    <div className={se.container}>

    <p style={selectorGallerySlice.dayNight ? {color: 'rgb(122, 152, 206)', fontWeight: 600} : {color: 'gray', fontWeight: 600}}>
    {selectorGallerySlice.settings.languageSelector === 'English' ? <span>RESOURSE SETTINGS</span> : 
      selectorGallerySlice.settings.languageSelector === 'Українська' ? <span>НАЛАШТУВАННЯ РЕСУРСУ</span> : 
      selectorGallerySlice.settings.languageSelector === 'Polska' ? <span>USTAWIENIE ZASOBÓW</span> : <span>RESOURSE SETTINGS</span>}
    </p>

      <div className={se.check} style={selectorGallerySlice.dayNight ? {backgroundColor: 'rgb(122, 152, 206)'} : {backgroundColor: ''}}>
        <p style={selectorGallerySlice.dayNight ? {color: '#384a83'} : {color: 'white'}}>
        {selectorGallerySlice.settings.languageSelector === 'English' ? <span>Sounds</span> : 
          selectorGallerySlice.settings.languageSelector === 'Українська' ? <span>Звук</span> : 
          selectorGallerySlice.settings.languageSelector === 'Polska' ? <span>Dźwięk</span> : <span>Sounds</span>}
        </p>
          <div className={se.status}>
            <p style={selectorGallerySlice.dayNight ? {color: '#384a83'} : {color: 'white'}}>{selectorGallerySlice.settings.checkSound ? 'on' : 'off'}</p>
            <label>
              <input className={se.box}
                type="checkbox"
                name="design"
                checked={selectorGallerySlice.settings.checkSound}
                onChange={soundChange}
              ></input>
            </label>
          </div>
      </div> 

      {selectorGallerySlice.settings.checkSound ?
        <div className={se.soundcheck}>
          <p style={selectorGallerySlice.dayNight ? {color: 'rgb(122, 152, 206)'} : {color: 'gray'}}>
          {selectorGallerySlice.settings.languageSelector === 'English' ? <span>Input messages</span> : 
            selectorGallerySlice.settings.languageSelector === 'Українська' ? <span>Вхідні повідомлення</span> : 
            selectorGallerySlice.settings.languageSelector === 'Polska' ? <span>Przychodzące wiadomości</span> : <span>Input messages</span>} 
          </p>

          <div className={se.soundContainer}>
            <select className={se.sounddatalist} style={selectorGallerySlice.dayNight ? {backgroundColor: 'rgb(122, 152, 206)'} : {backgroundColor: 'gray'}} value={selectorGallerySlice.settings.inputSoundSelector} onChange={inputMessageSoundSelectChange}>
              <option value={'Sound_1'}>Sound_1</option>
              <option value={'Sound_2'}>Sound_2</option>
              <option value={'Sound_3'}>Sound_3</option>
            </select>

            <button onClick={soundReviewIn}><TrumpetImg/></button>

          </div>

          <p style={selectorGallerySlice.dayNight ? {color: 'rgb(122, 152, 206)'} : {color: 'gray'}}>
            {selectorGallerySlice.settings.languageSelector === 'English' ? <span>Personal messages</span> : 
            selectorGallerySlice.settings.languageSelector === 'Українська' ? <span>Особисті повідомлення</span> : 
            selectorGallerySlice.settings.languageSelector === 'Polska' ? <span>Osobisty wychodzące</span> : <span>Output messages</span>}  
          </p>

          <div className={se.soundContainer}>
            <select className={se.sounddatalist} style={selectorGallerySlice.dayNight ? {backgroundColor: 'rgb(122, 152, 206)'} : {backgroundColor: 'gray'}} value={selectorGallerySlice.settings.outputSoundSelector} onChange={outputMessageSoundSelectChange}>
              <option value={'Sound_1'}>Sound_1</option>
              <option value={'Sound_2'}>Sound_2</option>
              <option value={'Sound_3'}>Sound_3</option>
            </select>

            <button onClick={soundReviewPersonal}><TrumpetImg/></button>
          </div>

        </div>
            : ''}

      <div className={se.check} style={selectorGallerySlice.dayNight ? {backgroundColor: 'rgb(122, 152, 206)'} : {backgroundColor: ''}}>
        <p style={selectorGallerySlice.dayNight ? {color: '#384a83'} : {color: 'white'}}>
        {selectorGallerySlice.settings.languageSelector === 'English' ? <span>Email</span> : 
            selectorGallerySlice.settings.languageSelector === 'Українська' ? <span>Пошта</span> : 
            selectorGallerySlice.settings.languageSelector === 'Polska' ? <span>Email</span> : <span>Email</span>} 
        </p>
          <div className={se.status}>
            <p style={selectorGallerySlice.dayNight ? {color: '#384a83'} : {color: 'white'}}>{selectorGallerySlice.settings.checkEmail ? 'show' : 'not show'}</p>
            <label>
              <input className={se.box}
                type="checkbox"
                name="design"
                checked={selectorGallerySlice.settings.checkEmail}
                onChange={emailChange}
              ></input>
            </label>
          </div>
      </div> 


      <div className={se.check} style={selectorGallerySlice.dayNight ? {backgroundColor: 'rgb(122, 152, 206)'} : {backgroundColor: ''}}>
        
        <p style={selectorGallerySlice.dayNight ? {color: '#384a83'} : {color: 'white'}}>
        {selectorGallerySlice.settings.languageSelector === 'English' ? <span>Design</span> : 
            selectorGallerySlice.settings.languageSelector === 'Українська' ? <span>Дизайн</span> : 
            selectorGallerySlice.settings.languageSelector === 'Polska' ? <span>Projekt</span> : <span>Design</span>}
        </p>
          <div className={se.status}>
            <p style={selectorGallerySlice.dayNight ? {color: '#384a83'} : {color: 'white'}}>{selectorGallerySlice.settings.checkDesign ? 'darck' : 'bright'}</p>
            <label>
              <input className={se.box}
                type="checkbox"
                name="design"
                checked={selectorGallerySlice.settings.checkDesign}
                onChange={designChange}
              ></input>
            </label>
          </div>
      </div> 
      <div className={se.check} style={selectorGallerySlice.dayNight ? {backgroundColor: 'rgb(122, 152, 206)'} : {backgroundColor: ''}}>
        <p style={selectorGallerySlice.dayNight ? {color: '#384a83'} : {color: 'white'}}>
        {selectorGallerySlice.settings.languageSelector === 'English' ? <span>Lenguage</span> : 
            selectorGallerySlice.settings.languageSelector === 'Українська' ? <span>Мова</span> : 
            selectorGallerySlice.settings.languageSelector === 'Polska' ? <span>Język</span> : <span>Lenguage</span>}
        </p>
        <label>
          <select className={se.datalist} style={selectorGallerySlice.dayNight ? {backgroundColor: '#384a83', color: 'rgb(122, 152, 206)'} : {backgroundColor: 'white', color: ''}} value={selectorGallerySlice.settings.languageSelector} onChange={langSelectChange}>
            <option style={selectorGallerySlice.dayNight ? {color: 'rgb(122, 152, 206)'} : {color: ''}} value={'Українська'}>Українська</option>
            <option style={selectorGallerySlice.dayNight ? {color: 'rgb(122, 152, 206)'} : {color: ''}} value={'English'}>English</option>
            <option style={selectorGallerySlice.dayNight ? {color: 'rgb(122, 152, 206)'} : {color: ''}} value={'Polska'}>Polska</option>
          </select>
        </label>
      </div>
      <div className={se.check} style={selectorGallerySlice.dayNight ? {backgroundColor: 'rgb(122, 152, 206)'} : {backgroundColor: ''}}>
        <p style={selectorGallerySlice.dayNight ? {color: '#384a83'} : {color: 'white'}}>
        {selectorGallerySlice.settings.languageSelector === 'English' ? <span>Show/Hidden phone number</span> : 
            selectorGallerySlice.settings.languageSelector === 'Українська' ? <span>Показувати/Приховати номер телефону</span> : 
            selectorGallerySlice.settings.languageSelector === 'Polska' ? <span>Pokaż/Ukryj numer telefonu</span> : <span>Show/Hidden phone number</span>}
        </p>
        <div className={se.status}>
            <p style={selectorGallerySlice.dayNight ? {color: '#384a83'} : {color: 'white'}}>{selectorGallerySlice.settings.checkPhone ? 'show' : 'not show'}</p>
            <label>
              <input className={se.box}
                type="checkbox"
                name="phone"
                checked={selectorGallerySlice.settings.checkPhone}
                onChange={phoneChange}
              ></input>
            </label>
          </div>
      </div>

      <div className={se.check} style={selectorGallerySlice.dayNight ? {backgroundColor: 'rgb(122, 152, 206)'} : {backgroundColor: ''}}>
        <p style={selectorGallerySlice.dayNight ? {color: '#384a83'} : {color: 'white'}}>
        {selectorGallerySlice.settings.languageSelector === 'English' ? <span>Color schem</span> : 
            selectorGallerySlice.settings.languageSelector === 'Українська' ? <span>Кольорова схема</span> : 
            selectorGallerySlice.settings.languageSelector === 'Polska' ? <span>Schemat kolorów</span> : <span>Color schem</span>}
        </p>
        <div className={se.status}>
            <p style={selectorGallerySlice.dayNight ? {color: '#384a83'} : {color: 'white'}}>{selectorGallerySlice.settings.checkColorSchem ? 'user' : 'default'}</p>
            <label>
              <input className={se.box}
                type="checkbox"
                name="Color schem"
                checked={selectorGallerySlice.settings.checkColorSchem}
                onChange={checkSchemChange}
              ></input>
            </label>
          </div>
      </div>

      {selectorGallerySlice.settings.checkColorSchem ? 
        <div className={se.schemContainer} style={selectorGallerySlice.dayNight ? {backgroundColor: 'rgb(122, 152, 206)', color: 'rgb(122, 152, 206)'} : {backgroundColor: 'lightgray', color: ''}}>
              <p style={selectorGallerySlice.dayNight ? {color: '#384a83'} : {color: 'white'}}>
              {selectorGallerySlice.settings.languageSelector === 'English' ? <span>Select schem</span> : 
                selectorGallerySlice.settings.languageSelector === 'Українська' ? <span>Вибрати схему</span> : 
                selectorGallerySlice.settings.languageSelector === 'Polska' ? <span>Wybierz schemat</span> : <span>Select schem</span>}
              </p>

              <div className={se.schemBlock} onClick={colorSchemHandler}>
                <div className={se.schemOne} style={selectorGallerySlice.colorSchem === 'rgba(151, 30, 207, 0.801)' ? {borderColor:' rgba(194, 212, 31, 0.801)'} : {color: ''}} id='1' ><p className={se.schemTitle}>1</p></div>
                <div className={se.schemTwo} style={selectorGallerySlice.colorSchem === 'rgba(207, 136, 30, 0.801)' ? {borderColor:' rgba(194, 212, 31, 0.801)'} : {color: ''}} id='2' ><p className={se.schemTitle}>2</p></div>
              </div>
              
        </div> :
      ''}

    </div>
  )
}

export default UserSettings