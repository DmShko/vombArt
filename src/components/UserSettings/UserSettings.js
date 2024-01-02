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

    dispatch(change({operation: 'updateSettings', data:{item: 'checkDesign', value: design}}));

  },[design])

  useEffect(() => {

    dispatch(change({operation: 'updateSettings', data:{item: 'checkEmail', value: email}}));

  },[email])

  useEffect(() => {

    dispatch(change({operation: 'updateSettings', data:{item: 'checkSound', value: sound}}));

  },[sound])

  useEffect(() => {

    dispatch(change({operation: 'updateSettings', data:{item: 'checkPhone', value: phone}}));

  },[phone])

  useEffect(() => {

    dispatch(change({operation: 'updateSettings', data:{item: 'checkColorSchem', value: colorSchem}}));
    
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

    <p style={{color: 'gray', fontWeight: 600}}>RESOURSE SETTINGS</p>

      <div className={se.check}>
        <p style={{color: 'white'}}>Sounds</p>
          <div className={se.status}>
            <p style={{color: 'white'}}>{selectorGallerySlice.settings.checkSound ? 'on' : 'off'}</p>
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
          <p style={{color: 'gray'}}>Input messages </p>
          <select className={se.sounddatalist} value={selectorGallerySlice.settings.inputMessageSoundSelector} onChange={inputMessageSoundSelectChange}>
              <option value={'Sound_1'}>Sound_1</option>
              <option value={'Sound_2'}>Sound_2</option>
              <option value={'Sound_3'}>Sound_3</option>
            </select>

            <p style={{color: 'gray'}}>Output messages </p>
            <select className={se.sounddatalist} value={selectorGallerySlice.settings.outputMessageSoundSelector} onChange={outputMessageSoundSelectChange}>
              <option value={'Sound_1'}>Sound_1</option>
              <option value={'Sound_2'}>Sound_2</option>
              <option value={'Sound_3'}>Sound_3</option>
            </select>
        </div>
            : ''}

      <div className={se.check}>
        <p style={{color: 'white'}}>Email</p>
          <div className={se.status}>
            <p style={{color: 'white'}}>{selectorGallerySlice.settings.checkEmail ? 'show' : 'not show'}</p>
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


      <div className={se.check}>
        
        <p style={{color: 'white'}}>Design</p>
          <div className={se.status}>
            <p style={{color: 'white'}}>{selectorGallerySlice.settings.checkDesign ? 'black' : 'bright'}</p>
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
      <div className={se.check}>
        <p style={{color: 'white'}}>Lenguage</p>
        <label>
          <select className={se.datalist} value={selectorGallerySlice.settings.languageSelector} onChange={langSelectChange}>
            <option value={'Українська'}>Українська</option>
            <option value={'English'}>English</option>
            <option value={'Polska'}>Polska</option>
          </select>
        </label>
      </div>
      <div className={se.check}>
        <p style={{color: 'white'}}>Show/Hidden phone number</p>
        <div className={se.status}>
            <p style={{color: 'white'}}>{selectorGallerySlice.settings.checkPhone ? 'show' : 'not show'}</p>
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

      <div className={se.check}>
        <p style={{color: 'white'}}>Color schem</p>
        <div className={se.status}>
            <p style={{color: 'white'}}>{selectorGallerySlice.settings.checkColorSchem ? 'user' : 'default'}</p>
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
        <div style={{color: 'white', backgroundColor: 'lightgray'}}>
              <p>Select schem</p>
        </div> :
      ''}

    </div>
  )
}

export default UserSettings