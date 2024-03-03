import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';

import di from './Style.module.scss';
import Notiflix from 'notiflix';
import { change } from 'vomgallStore/gallerySlice';
import { addStyleToPath } from 'vomgallStore/pathSlice';
import { deleteStyleToPath } from 'vomgallStore/pathSlice';
import { getDatabase, ref, onValue } from 'firebase/database';

import { ReactComponent as WarningImg } from '../../../../images/warning-1-svgrepo-com.svg';

const Direction = () => {

  const dispatch = useDispatch();

  const selectorGallSlice = useSelector(state => state.gallery);
  
  const pathSelector = useSelector(state => state.path.logicPath);

  const selectorSingInSlice = useSelector(state => state.singIn);

  const { register, handleSubmit, formState:{errors}, reset} = useForm({mode: 'onBlur'});

  const [style, setSelectDirection] = useState('');

  const [checkAdd, setCheckAdd] = useState(true);

  const [checkDel, setCheckDel] = useState(false);

  const [errorDrive, setErrorDrive] = useState(false);

  // off errors message, when inputs changenavigate('/home');
  useEffect(() => {

    setErrorDrive(false);

    const errorMessageOn = setTimeout(() => {
        setErrorDrive(true);
        clearTimeout(errorMessageOn);
    }, 2000);

  },[style]);

  // retun key of element, that have value true
  const getPropertyKey = (data) => {
    for (const key in data) {
      if (data[key] === true) {
        return key;
      } 
    } 
  };

  const stateChange = data => {

    const { name, value } = data;

    // change 'name' and 'number' without use previous value
    switch(name) {
        case 'Style':
         
            setSelectDirection(value);
            break;
        
        default: break;
    }

  };

  const inputChange = evt => {
    
    // change 'name','email', 'password'
    stateChange(evt.target);
  };

  const addStyle = (_, evt) => {
    
    evt.preventDefault();
    if(style !== '' && !errors.Style) {
  
      if (
        getPropertyKey(pathSelector.arts) !== undefined && Object.keys(pathSelector.style).includes(style.toLowerCase()) === false
        && Object.keys(selectorGallSlice.users.find(element => element.uid === selectorSingInSlice.singInId).arts[getPropertyKey(pathSelector.arts)].style).length < 20) {
        dispatch(
          change({
            operation: 'addUserStyle',
            currentUserName: pathSelector.name,
            artsName: getPropertyKey(pathSelector.arts),
            data: style,
          })
        );

        // add style to 'logicPath'
        dispatch(
          addStyleToPath({
            data: style.toLowerCase(),
          })
        );
        
      } else Notiflix.Notify.info('Please, select art section! Max style length - 20!', {width: '450px', position: 'center-top', fontSize: '24px',});
      reset({Style: ''});
     
    }
  };

  const deleteStyle = (_, evt) => {

    evt.preventDefault();

      const checkStyle = ['oil', 'watercolor', 'digital', 'mix', 'poem', 'liric', 'classic', 'pop'];

      const path = `${selectorGallSlice.users.find(element => 
        element.uid === selectorSingInSlice.singInId).userName}/items/${getPropertyKey(pathSelector.arts)}`;
      
       // listenAccount(path);
       const db = getDatabase();
       const starCountRef = ref(db, `${path}/${style.toLowerCase()}`);

       //firebase listener function
       onValue(starCountRef, snapshot => {

        // load account array from DB
        const styleData = snapshot.val();

        if(getPropertyKey(pathSelector.arts) !== undefined && pathSelector.arts[getPropertyKey(pathSelector.arts)] !== undefined
        && checkStyle.includes(style.toLowerCase()) === false) 
        { 
          if(styleData === null) {
            dispatch(
              change({
                operation: 'deleteUserStyle',
                currentUserName: pathSelector.name,
                artsName: getPropertyKey(pathSelector.arts),
                data: style,
              })
            );
  
            // delete style from 'logicPath'
            dispatch(
              deleteStyleToPath({
                data: style.toLowerCase(),
              })
            );

            setSelectDirection('');
            
          }else Notiflix.Notify.info(`This style is not empty. In first delete style content.`, {width: '450px', position: 'center-top', fontSize: '24px',});
          
        }else Notiflix.Notify.info('This style is absent locked or art section is not selected!', {width: '450px', position: 'center-top', fontSize: '24px',});

       });

    reset({ Style: '' });
  };


  const checked = ({ target }) => {
    if (target.name === 'add') {
      setCheckAdd(!checkAdd);
      setCheckDel(!checkDel);
    } else {
      setCheckAdd(!checkAdd);
      setCheckDel(!checkDel);
    }
  };

  const changeBorderOver = (evt) => {

    if(selectorGallSlice.settings.checkColorSchem){
      evt.currentTarget.style.backgroundColor = selectorGallSlice.colorSchem;
    } else {  
      evt.currentTarget.style.backgroundColor =  'rgba(194, 212, 31, 0.801)';
    }

  };

  const changeBorderOut = (evt) => {

    if(selectorGallSlice.dayNight) evt.currentTarget.style.backgroundColor =  'rgb(122, 152, 206)';
    if(!selectorGallSlice.dayNight) evt.currentTarget.style.backgroundColor =  '';
    
  };

  return (
    <div className={di.container}>
      <form
        className={di.fise}
        onSubmit={checkAdd ? handleSubmit(addStyle) : handleSubmit(deleteStyle)}
      >
        <fieldset className={di.fset}>
          <legend>{checkAdd ? <p style = {selectorGallSlice.dayNight ? {color: 'rgb(122, 152, 206)',} : {color: '',}}>
          {selectorGallSlice.settings.languageSelector === 'English' ? <span>Add Style</span> : 
                            selectorGallSlice.settings.languageSelector === 'Українська' ? <span>Додати стиль</span> : 
                            selectorGallSlice.settings.languageSelector === 'Polska' ? <span>Dodaj styl</span> : <span>Add Style</span>}
            </p> : <p style = {selectorGallSlice.dayNight ? {color: 'rgb(122, 152, 206)',} : {color: '',}}>
            {selectorGallSlice.settings.languageSelector === 'English' ? <span>Delete Style</span> : 
              selectorGallSlice.settings.languageSelector === 'Українська' ? <span>Видалити стиль</span> : 
              selectorGallSlice.settings.languageSelector === 'Polska' ? <span>Usuń styl</span> : <span>Delete Style</span>}
            </p>}</legend>
          <div className={di.field}>
            <div className={di.radioCont}>
              <label className={di.radioLab}>
                {' '}
                <p style = {selectorGallSlice.dayNight ? {color: 'rgb(122, 152, 206)',} : {color: '',}}>
                {selectorGallSlice.settings.languageSelector === 'English' ? <span>Add</span> : 
                  selectorGallSlice.settings.languageSelector === 'Українська' ? <span>Додати</span> : 
                  selectorGallSlice.settings.languageSelector === 'Polska' ? <span>Dodać</span> : <span>Add</span>}
                </p>{' '}
                <input
                  className={di.radio}
                  type="radio"
                  name="add"
                  checked={checkAdd}
                  onChange={checked}
                ></input>
              </label>
              <label className={di.radioLab}>
                {' '}
                <p style = {selectorGallSlice.dayNight ? {color: 'rgb(122, 152, 206)',} : {color: '',}}>
                {selectorGallSlice.settings.languageSelector === 'English' ? <span>Delete</span> : 
                  selectorGallSlice.settings.languageSelector === 'Українська' ? <span>Видалити</span> : 
                  selectorGallSlice.settings.languageSelector === 'Polska' ? <span>Usunąć</span> : <span>Delete</span>}
                </p>{' '}
                <input
                  className={di.radio}
                  type="radio"
                  name="delete"
                  checked={checkDel}
                  onChange={checked}
                ></input>
              </label>
            </div>

            <label className={di.lab}>
              {' '}
              <p style = {selectorGallSlice.dayNight ? {color: 'rgb(122, 152, 206)'} : {color: ''}}>
              {selectorGallSlice.settings.languageSelector === 'English' ? <span>Style name</span> : 
                  selectorGallSlice.settings.languageSelector === 'Українська' ? <span>Назва стилю</span> : 
                  selectorGallSlice.settings.languageSelector === 'Polska' ? <span>Nazwa stylu</span> : <span>Style name</span>}
              </p>
              <input
                {...register('Style', {
                  required: 
                    selectorGallSlice.settings.languageSelector === 'English' ? 'Please fill the Style field!' : 
                    selectorGallSlice.settings.languageSelector === 'Українська' ? 'Будь ласка, заповніть поле Стилю! ': 
                    selectorGallSlice.settings.languageSelector === 'Polska' ? 'Proszę, wypełnić pole Styl!' : 'Please fill the Style field!',

                  maxLength: { value: 16, message: 
                    selectorGallSlice.settings.languageSelector === 'English' ? 'Style is too long!': 
                    selectorGallSlice.settings.languageSelector === 'Українська' ? 'Стиль занадто товгий!' : 
                    selectorGallSlice.settings.languageSelector === 'Polska' ? 'Styl jest za długi!' : 'Style is too long!'
                  },
                  value: style,
                })}
                className={di.in}
                style = {selectorGallSlice.dayNight ? {borderRadius: '6px', backgroundColor: 'rgb(122, 152, 206)'} : {borderRadius: '', backgroundColor: ''}}
                type="text"
                autoComplete="false"
                onChange={inputChange}
                title="Style"
                placeholder={selectorGallSlice.settings.languageSelector === 'English' ? "Enter style name...": 
                selectorGallSlice.settings.languageSelector === 'Українська' ? "Введіть назву стилю...": 
                selectorGallSlice.settings.languageSelector === 'Polska' ? "Wprowadź nazwę stylu..." : "Enter style name..."}
              ></input>
            </label>
            {errorDrive ? errors?.Style ? <div className={di.error}><WarningImg style={{width: '15px', height: '15px'}}/> <p style={{color: 'orange', fontSize: '14px', fontWeight: '600',}}>{errors.Style.message}</p></div> : '' : ''}    
            <button className={di.button} onMouseOver={changeBorderOver} onMouseOut={changeBorderOut} style = {selectorGallSlice.dayNight ? {backgroundColor: 'rgb(122, 152, 206)'} : {backgroundColor: ''}}>
            {selectorGallSlice.settings.languageSelector === 'English' ? checkAdd ? <span>Add</span> : <span>Delete</span> : 
                  selectorGallSlice.settings.languageSelector === 'Українська' ? checkAdd ? <span>Додати</span> : <span>Видалити</span> : 
                  selectorGallSlice.settings.languageSelector === 'Polska' ? checkAdd ? <span>Dodać</span> : <span>Usunąć</span> : checkAdd ? <span>Add</span> : <span>Delete</span>}
            </button>
          </div>
        </fieldset>
      </form>
    </div>
  );
}

export default Direction