import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';

import writeUserData from 'API/writerDB';
import getMetaAPI from 'API/getMetaDataAPI'
import StorageWork from 'components/StorageWork/StorageWork';
import pathCreator from '../../../MageChat/pathCreator/pathCreator';

import { change } from 'vomgallStore/gallerySlice';

import { ReactComponent as SuccessImg } from '../../../../images/success-svgrepo-com.svg';
import { ReactComponent as WarningImg } from '../../../../images/warning-1-svgrepo-com.svg';

import nf from './NewItem.module.scss';

const NewItem = () => {

  const dispatch = useDispatch();

  const selectorGallerySlice = useSelector(state => state.gallery);
  const selectorSingInSlice = useSelector(state => state.singIn);
  const pathSelector = useSelector(state => state.path.logicPath);

  const [timeValue, setTimeValue] = useState({ time: new Date() });
  // const [newDateObj, setNewDateObj] = useState({});
  // const [message, setMessage] = useState('');

  const [file, setFile] = useState();
  const [storagePath, setStoragePath] = useState('');
  const [description, setDescription] = useState('');
  const [title, setTitle] = useState('');
  const [fileLoaded, setFileLoaded] = useState(false);
  const [successIcon, setSuccessIcon] = useState(false);
  const [errorDrive, setErrorDrive] = useState(false);

  // off errors message, when inputs changenavigate('/home');
  useEffect(() => {

    setErrorDrive(false);

    const errorMessageOn = setTimeout(() => {
        setErrorDrive(true);
        clearTimeout(errorMessageOn);
    }, 2000);

  },[title, description,]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({ mode: 'onBlur' });

  useEffect(() => {

    if(fileLoaded) {

      setSuccessIcon(true);
      
      dispatch(change({ operation: 'changeLoadFiles', data: null }));
      // write full path to array for delete all data from storeg when account wil be deleted
      dispatch(getMetaAPI(storagePath));
    };
    setStoragePath('');
    setFileLoaded(false);

    setTimeout(() => {
      setSuccessIcon(false);
      clearTimeout();
    }  
    , 3000)
  // eslint-disable-next-line
  }, [fileLoaded]);

  function tick() {
    setTimeValue({
      time: new Date(),
    });

    const dateHours =
      timeValue.time.getHours().toString().length === 1
        ? '0' + timeValue.time.getHours().toString()
        : timeValue.time.getHours().toString();
    const dateMinutes =
      timeValue.time.getMinutes().toString().length === 1
        ? '0' + timeValue.time.getMinutes().toString()
        : timeValue.time.getMinutes().toString();
    const dateSeconds = timeValue.time.getSeconds();

    // get date
    const dateDay =
      timeValue.time.getDate().toString().length === 1
        ? '0' + timeValue.time.getDate().toString()
        : timeValue.time.getDate().toString();
    const dateMonth =
      timeValue.time.getMonth().toString().length === 1
        ? '0' + (timeValue.time.getMonth() + 1).toString()
        : (timeValue.time.getMonth() + 1).toString();

    const timedata = dateHours + ':' + dateMinutes;
    const datedata = dateDay + '/' + dateMonth;
    const yeardata = timeValue.time.getFullYear();

    
    return { timedata, datedata, yeardata, dateSeconds };
    
  }

  const stateChange = data => {
    const { name, value } = data;

    // change 'Title','Description' 
    switch (name) {
      case 'Title':
        setTitle(value);
        break;
      case 'Description':
        setDescription(value);
        break;

      default:
        break;
    }
  };

  const inputChange = evt => {
    // change 'Title','Description' 
    stateChange(evt.target);
  };

  // retun true if element contain true
  const findProperty = data => {
    for (const key in data) {
      if (data[key] === true) {
        return true;
      }
    }
  };

  const addItem = (_, evt) => {
    evt.preventDefault();
 
    // check selected arts and style
    if (findProperty(pathSelector.arts) && findProperty(pathSelector.style)) {
      // create items tree
      const path = pathCreator({
        pathSelector,
        section: 'items',
        contents: 'elements',
        write: true,
        users: selectorGallerySlice.users,
        userIsSingInId: selectorSingInSlice.singInId
      });
      // to database
      writeUserData(
        path,
        { title: title, description: description, url: '', type: selectorGallerySlice.typeOfFile},
        tick(), false
      );
      setStoragePath(path);
      // storage(path, file);
    }

    reset({ Description: '', Title: '' });
  };

  const handleFileChange = evt => {
    if (evt.target.files) {
      setFile(evt.target.files[0]);
      console.log(evt.target.files[0]) 

      // write type of file
      dispatch(
        change({
          operation: 'changeTypeOfFile',
          data: evt.target.files[0].type,
        })
      );

      dispatch(
        change({
          operation: 'changeLoadFiles',
          data: evt.target.files[0].name,
        })
      );
    }
  };

  const changeBorderOver = (evt) => {
    
    evt.currentTarget.style.backgroundColor =  'rgba(194, 212, 31, 0.801)';

  };

  const changeBorderOut = (evt) => {

    if(selectorGallerySlice.dayNight) evt.currentTarget.style.backgroundColor =  'rgb(122, 152, 206)';
    if(!selectorGallerySlice.dayNight) evt.currentTarget.style.backgroundColor =  '';
    
  };

  return (
    <div className={nf.container}>
      <form className={nf.fise} onSubmit={handleSubmit(addItem)}>
        <fieldset className={nf.fset}>
          <legend style={selectorGallerySlice.dayNight ? {color: 'rgb(122, 152, 206)'} : {color: ''}}>
          {selectorGallerySlice.settings.languageSelector === 'English' ? <p>New item</p> : 
              selectorGallerySlice.settings.languageSelector === 'Українська' ? <p>Новий елемент</p> : 
              selectorGallerySlice.settings.languageSelector === 'Polska' ? <p>Nowy przedmiot</p> : <p>New item</p>}
          </legend>
          <div className={nf.field}>
            <label className={nf.lab}>
              {' '}
              <p style={selectorGallerySlice.dayNight ? {color: 'rgb(122, 152, 206)'} : {color: ''}}>
              {selectorGallerySlice.settings.languageSelector === 'English' ? <p>Title</p> : 
                selectorGallerySlice.settings.languageSelector === 'Українська' ? <p>Заголовок</p> : 
                selectorGallerySlice.settings.languageSelector === 'Polska' ? <p>Tytuł</p> : <p>Title</p>}
              </p>
              <input
                {...register('Title', {
                  required: 
                  selectorGallerySlice.settings.languageSelector === 'English' ? 'Please fill the Title field!' : 
                  selectorGallerySlice.settings.languageSelector === 'Українська' ? 'Будь ласка, заповніть заголовок! ': 
                  selectorGallerySlice.settings.languageSelector === 'Polska' ? 'Proszę, wypełnić pole tytuł!' : 'Please fill the Title field!',

                  maxLength: { value: 16, message: 
                    selectorGallerySlice.settings.languageSelector === 'English' ? 'Title is too long!': 
                    selectorGallerySlice.settings.languageSelector === 'Українська' ? 'Заголовок занадто товгий!' : 
                    selectorGallerySlice.settings.languageSelector === 'Polska' ? 'Tytuł jest za długi!' : 'Title is too long!'
                  },
                  value: title,
                })}
                className={nf.in}
                style = {selectorGallerySlice.dayNight ? {borderRadius: '6px', backgroundColor: 'rgb(122, 152, 206)'} : {borderRadius: '', backgroundColor: ''}}
                type="text"
                autoComplete="false"
                onChange={inputChange}
                title="Title"
                placeholder={selectorGallerySlice.settings.languageSelector === 'English' ? "Enter style...": 
                selectorGallerySlice.settings.languageSelector === 'Українська' ? "Введіть стиль...": 
                selectorGallerySlice.settings.languageSelector === 'Polska' ? "Wprowadź styl..." : "Enter style..."}
              ></input>
            </label>
            <label className={nf.lab}>
              {' '}
              <p style={selectorGallerySlice.dayNight ? {color: 'rgb(122, 152, 206)'} : {color: ''}}>
              {selectorGallerySlice.settings.languageSelector === 'English' ? <p>Description</p> : 
                selectorGallerySlice.settings.languageSelector === 'Українська' ? <p>Опис</p> : 
                selectorGallerySlice.settings.languageSelector === 'Polska' ? <p>Opis</p> : <p>Description</p>}
              </p>
              <textarea
                {...register('Description', {
                  required: 
                  selectorGallerySlice.settings.languageSelector === 'English' ? 'Please fill the Description field!' : 
                  selectorGallerySlice.settings.languageSelector === 'Українська' ? 'Будь ласка, заповніть поле Description! ': 
                  selectorGallerySlice.settings.languageSelector === 'Polska' ? 'Proszę, wypełnić pole Description!' : 'Please fill the Description field!',

                  maxLength: { value: 30, message: 
                    selectorGallerySlice.settings.languageSelector === 'English' ? 'Description is too long!': 
                    selectorGallerySlice.settings.languageSelector === 'Українська' ? 'Опис занадто товгий!' : 
                    selectorGallerySlice.settings.languageSelector === 'Polska' ? 'Opis jest za długi!' : 'Description is too long!' 
                  },
                  value: description,
                })}
                className={nf.in}
                style = {selectorGallerySlice.dayNight ? {borderRadius: '6px', backgroundColor: 'rgb(122, 152, 206)'} : {borderRadius: '', backgroundColor: ''}}
                type="text"
                onChange={inputChange}
                autoComplete="false"
                title="Description"
                placeholder={selectorGallerySlice.settings.languageSelector === 'English' ? "Enter short description...": 
                selectorGallerySlice.settings.languageSelector === 'Українська' ? "Введіть короткий опис...": 
                selectorGallerySlice.settings.languageSelector === 'Polska' ? "Wprowadź krótki opisl..." : "Enter short description..."}
              ></textarea>
            </label>

            <p style={{color: 'orange', fontSize: '14px', fontWeight: '600', textAlign: 'center'}}>
              {errorDrive ? errors?.Title ? <div className={nf.error}><WarningImg style={{width: '15px', height: '15px'}}/>{errors.Title.message}</div> 
              : errors?.Description ? <div className={nf.error}><WarningImg style={{width: '20px', height: '20px'}}/>{errors.Description.message}</div> : '' : ''}</p>  

            <label className={nf.lab}>
              {' '}
              <p className={nf.p} style={selectorGallerySlice.dayNight ? {color: 'rgb(122, 152, 206)', cursor:'pointer'} : {color: '', cursor:'pointer'}}>
              {selectorGallerySlice.settings.languageSelector === 'English' ? <p>Seach file</p> : 
                selectorGallerySlice.settings.languageSelector === 'Українська' ? <p>Вибрати файл</p> : 
                selectorGallerySlice.settings.languageSelector === 'Polska' ? <p>Wybierz plik</p> : <p>Seach file</p>}
              </p>
              <span style={{ border: 'none', fontSize: '12px' }}>
                {<p style={selectorGallerySlice.dayNight ? {color: 'rgb(122, 152, 206)'} : {color: ''}}>{selectorGallerySlice.loadFiles}</p> || <p style={selectorGallerySlice.dayNight ? {color: 'rgb(122, 152, 206)'} : {color: ''}}>No search file...</p>}
              </span>
              <input
                {...register('Load', {
                  required: 
                  selectorGallerySlice.settings.languageSelector === 'English' ? 'Please fill the File field!' : 
                  selectorGallerySlice.settings.languageSelector === 'Українська' ? 'Будь ласка, заповніть поле File! ': 
                  selectorGallerySlice.settings.languageSelector === 'Polska' ? 'Proszę, wypełnić pole File!' : 'Please fill the File field!',
                  value: file,
                })}
                className={nf.load}
                style = {selectorGallerySlice.dayNight ? {borderRadius: '6px', backgroundColor: 'rgb(122, 152, 206)'} : {borderRadius: '', backgroundColor: ''}}
                type="file"
                onChange={handleFileChange}
                autoComplete="false"
                title="Load file..."
                multiple="multiple"
                placeholder="Enter short description..."
              ></input>
            </label>
            {storagePath !== '' ? (
              <StorageWork
                data={{ storagePath, file, setStoragePath, setFileLoaded }}
              />
            ) : (
              ''
            )}
            {successIcon ? <SuccessImg style={{width: '20px', height: '20px',}}/> : ''}
            <button className={nf.button} onMouseOver={changeBorderOver} onMouseOut={changeBorderOut} style = {selectorGallerySlice.dayNight ? {backgroundColor: 'rgb(122, 152, 206)'} : {backgroundColor: ''}}>
            {selectorGallerySlice.settings.languageSelector === 'English' ? <p>Add Item</p> : 
                selectorGallerySlice.settings.languageSelector === 'Українська' ? <p>Додати елемент</p> : 
                selectorGallerySlice.settings.languageSelector === 'Polska' ? <p>Dodaj Przedmiot</p> : <p>Add Item</p>}
            </button>
          </div>
        </fieldset>
      </form>
    </div>
  );
};

export default NewItem;
