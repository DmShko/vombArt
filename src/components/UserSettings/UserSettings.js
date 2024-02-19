import { React, useState, useEffect } from 'react';
import { useSelector } from 'react-redux/es/hooks/useSelector';
import { useDispatch } from 'react-redux';
import { change } from 'vomgallStore/gallerySlice';

import se from './UserSettings.module.scss';

const UserSettings = () => {

  const selectorGallerySlice = useSelector(state => state.gallery);
  const dispatch = useDispatch();

  const [ design, setDesign ] = useState(selectorGallerySlice.settings.checkDesign);
  const [ email, setEmail ] = useState(selectorGallerySlice.settings.checkEmail);
  const [ sound, setSound ] = useState(selectorGallerySlice.settings.checkSound);
  const [ phone, setPhone ] = useState(selectorGallerySlice.settings.checkPhone);
  const [ colorSchem, setColorSchem ] = useState(selectorGallerySlice.settings.checkColorSchem);

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

  return (
    <div className={se.container}>

    <p style={selectorGallerySlice.dayNight ? {color: 'rgb(122, 152, 206)', fontWeight: 600} : {color: 'gray', fontWeight: 600}}>
    {selectorGallerySlice.settings.languageSelector === 'English' ? <p>RESOURSE SETTINGS</p> : 
      selectorGallerySlice.settings.languageSelector === 'Українська' ? <p>НАЛАШТУВАННЯ РЕСУРСУ</p> : 
      selectorGallerySlice.settings.languageSelector === 'Polska' ? <p>USTAWIENIE ZASOBÓW</p> : <p>RESOURSE SETTINGS</p>}
    </p>

      <div className={se.check} style={selectorGallerySlice.dayNight ? {backgroundColor: 'rgb(122, 152, 206)'} : {backgroundColor: ''}}>
        <p style={selectorGallerySlice.dayNight ? {color: '#384a83'} : {color: 'white'}}>
        {selectorGallerySlice.settings.languageSelector === 'English' ? <p>Sounds</p> : 
          selectorGallerySlice.settings.languageSelector === 'Українська' ? <p>Звук</p> : 
          selectorGallerySlice.settings.languageSelector === 'Polska' ? <p>Dźwięk</p> : <p>Sounds</p>}
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
          {selectorGallerySlice.settings.languageSelector === 'English' ? <p>Input messages</p> : 
            selectorGallerySlice.settings.languageSelector === 'Українська' ? <p>Вхідні повідомлення</p> : 
            selectorGallerySlice.settings.languageSelector === 'Polska' ? <p>Przychodzące wiadomości</p> : <p>Input messages</p>} 
          </p>
          <select className={se.sounddatalist} style={selectorGallerySlice.dayNight ? {backgroundColor: 'rgb(122, 152, 206)'} : {backgroundColor: 'gray'}} value={selectorGallerySlice.settings.inputMessageSoundSelector} onChange={inputMessageSoundSelectChange}>
              <option value={'Sound_1'}>Sound_1</option>
              <option value={'Sound_2'}>Sound_2</option>
              <option value={'Sound_3'}>Sound_3</option>
            </select>

            <p style={selectorGallerySlice.dayNight ? {color: 'rgb(122, 152, 206)'} : {color: 'gray'}}>
            {selectorGallerySlice.settings.languageSelector === 'English' ? <p>Output messages</p> : 
            selectorGallerySlice.settings.languageSelector === 'Українська' ? <p>Вихідні повідомлення</p> : 
            selectorGallerySlice.settings.languageSelector === 'Polska' ? <p>Wiadomości wychodzące</p> : <p>Output messages</p>}  
            </p>
            <select className={se.sounddatalist} style={selectorGallerySlice.dayNight ? {backgroundColor: 'rgb(122, 152, 206)'} : {backgroundColor: 'gray'}} value={selectorGallerySlice.settings.outputMessageSoundSelector} onChange={outputMessageSoundSelectChange}>
              <option value={'Sound_1'}>Sound_1</option>
              <option value={'Sound_2'}>Sound_2</option>
              <option value={'Sound_3'}>Sound_3</option>
            </select>
        </div>
            : ''}

      <div className={se.check} style={selectorGallerySlice.dayNight ? {backgroundColor: 'rgb(122, 152, 206)'} : {backgroundColor: ''}}>
        <p style={selectorGallerySlice.dayNight ? {color: '#384a83'} : {color: 'white'}}>
        {selectorGallerySlice.settings.languageSelector === 'English' ? <p>Email</p> : 
            selectorGallerySlice.settings.languageSelector === 'Українська' ? <p>Пошта</p> : 
            selectorGallerySlice.settings.languageSelector === 'Polska' ? <p>Email</p> : <p>Email</p>} 
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
        {selectorGallerySlice.settings.languageSelector === 'English' ? <p>Design</p> : 
            selectorGallerySlice.settings.languageSelector === 'Українська' ? <p>Дизайн</p> : 
            selectorGallerySlice.settings.languageSelector === 'Polska' ? <p>Projekt</p> : <p>Design</p>}
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
        {selectorGallerySlice.settings.languageSelector === 'English' ? <p>Lenguage</p> : 
            selectorGallerySlice.settings.languageSelector === 'Українська' ? <p>Мова</p> : 
            selectorGallerySlice.settings.languageSelector === 'Polska' ? <p>Język</p> : <p>Lenguage</p>}
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
        {selectorGallerySlice.settings.languageSelector === 'English' ? <p>Show/Hidden phone number</p> : 
            selectorGallerySlice.settings.languageSelector === 'Українська' ? <p>Показувати/Приховати номер телефону</p> : 
            selectorGallerySlice.settings.languageSelector === 'Polska' ? <p>Pokaż/Ukryj numer telefonu</p> : <p>Show/Hidden phone number</p>}
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
        {selectorGallerySlice.settings.languageSelector === 'English' ? <p>Color schem</p> : 
            selectorGallerySlice.settings.languageSelector === 'Українська' ? <p>Кольорова схема</p> : 
            selectorGallerySlice.settings.languageSelector === 'Polska' ? <p>Schemat kolorów</p> : <p>Color schem</p>}
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
        <div style={selectorGallerySlice.dayNight ? {backgroundColor: '#384a83', color: 'rgb(122, 152, 206)'} : {backgroundColor: 'lightgray', color: ''}}>
              <p>
              {selectorGallerySlice.settings.languageSelector === 'English' ? <p>Select schem</p> : 
                selectorGallerySlice.settings.languageSelector === 'Українська' ? <p>Вибрати схему</p> : 
                selectorGallerySlice.settings.languageSelector === 'Polska' ? <p>Wybierz schemat</p> : <p>Select schem</p>}
              </p>
        </div> :
      ''}

    </div>
  )
}

export default UserSettings