import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';

import { ReactComponent as WarningImg } from '../../../../images/warning-1-svgrepo-com.svg';

import writeUserData from 'API/writerDB';
import StorageWork from 'components/StorageWork/StorageWork';
import pathCreator from '../../../MageChat/pathCreator/pathCreator';
import { change } from 'vomgallStore/gallerySlice';

import ed from './Edit.module.scss';
// import { linkWithCredential } from 'firebase/auth';

const EditItem = () => {

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

  
  const [checkTitle, setCheckTitle] = useState(true);

  const [checkDescription, setCheckDescription] = useState(false);

  const [checkFile, setCheckFile] = useState(false);

  const [checkAll, setCheckAll] = useState(false);

  const [errorDrive, setErrorDrive] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({ mode: 'onBlur' });

  // off errors message, when inputs changenavigate('/home');
  useEffect(() => {

    setErrorDrive(false);

    const errorMessageOn = setTimeout(() => {
        setErrorDrive(true);
        clearTimeout(errorMessageOn);
    }, 2000);

  },[title, description, file,]);

  useEffect(() => {
    if(storagePath) dispatch(change({ operation: 'changeLoadFiles', data: null }));
    // eslint-disable-next-line
  }, [storagePath]);

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

    // change 'name' and 'number' without use previous value
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
    // change 'name','email', 'password'
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
        write: false,
        users: selectorGallerySlice.users,
        userIsSingInId: selectorSingInSlice.singInId
      });

      if(selectorGallerySlice.selectedItems.length !== 0) {
        if(checkTitle === true) {

          // rewrite only title property of item (upload)
          writeUserData(
            `${path}${selectorGallerySlice.selectedItems[0]}`,
            {...selectorGallerySlice.itemsBuffer.find(element => element.id === selectorGallerySlice.selectedItems[0]), title: title},
            tick(), false
          );

          setStoragePath('');
        }

        if(checkDescription === true) {
          // rewrite only description property of item (upload)
          writeUserData(
            `${path}${selectorGallerySlice.selectedItems[0]}`,
            {...selectorGallerySlice.itemsBuffer.find(element => element.id === selectorGallerySlice.selectedItems[0]), description: description, },
            tick(), false
          );
        }

        if(checkFile === true) {
          // rewrite only file property of item (upload)
          // path for upload file
          setStoragePath(`${path}${selectorGallerySlice.selectedItems[0]}`);
        }

        if(checkAll === true) {
          // rewrite all properties of item (upload)
          writeUserData(
            `${path}${selectorGallerySlice.selectedItems[0]}`,
            {...selectorGallerySlice.itemsBuffer.find(element => element.id === selectorGallerySlice.selectedItems[0]), title: title, description: description},
            tick(), false
          );
          
          // path for upload file
          setStoragePath(`${path}${selectorGallerySlice.selectedItems[0]}`);
        }

      };
  
    };

    reset({ description: '', title: '' });
  };

  const handleFileChange = evt => {
    if (evt.target.files) {
      setFile(evt.target.files[0]);

      dispatch(
        change({
          operation: 'changeLoadFiles',
          data: evt.target.files[0].name,
        })
      );
    }
  };

  const checked = ({ target }) => {
    if (target.name === 'title') {
      setCheckTitle(true);
      setCheckDescription(false);
      setCheckFile(false);
      setCheckAll(false);
    } 
    if (target.name === 'description'){
      setCheckTitle(false);
      setCheckDescription(true);
      setCheckFile(false);
      setCheckAll(false);
    }

    if (target.name === 'file'){
      setCheckTitle(false);
      setCheckDescription(false);
      setCheckFile(true);
      setCheckAll(false);
    }

    if (target.name === 'all'){
      setCheckTitle(false);
      setCheckDescription(false);
      setCheckFile(false);
      setCheckAll(true);
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
    <div className={ed.container}>
      <form className={ed.fise} onSubmit={handleSubmit(addItem)}>
        <fieldset className={ed.fset}>
          <legend style={selectorGallerySlice.dayNight ? {color: 'rgb(122, 152, 206)'} : {color: ''}}>
          {selectorGallerySlice.settings.languageSelector === 'English' ? <p>Edit item</p> : 
                selectorGallerySlice.settings.languageSelector === 'Українська' ? <p>Ред. елемент</p> : 
                selectorGallerySlice.settings.languageSelector === 'Polska' ? <p>Edytuj rzecz</p> : <p>Edit item</p>}
          </legend>

          <div className={ed.radios}>
              <label className={ed.radioLab}>
                {' '}
                <p style={selectorGallerySlice.dayNight ? {color: 'rgb(122, 152, 206)'} : {color: ''}}>
                {selectorGallerySlice.settings.languageSelector === 'English' ? <p>Title</p> : 
                  selectorGallerySlice.settings.languageSelector === 'Українська' ? <p>Заголовок</p> : 
                  selectorGallerySlice.settings.languageSelector === 'Polska' ? <p>Tytuł</p> : <p>Title</p>}
                </p>{' '}
                <input
                  type="radio"
                  name="title"
                  checked={checkTitle}
                  onChange={checked}
                ></input>
              </label>
              <label className={ed.radioLab}>
                {' '}
                <p style={selectorGallerySlice.dayNight ? {color: 'rgb(122, 152, 206)'} : {color: ''}}>
                {selectorGallerySlice.settings.languageSelector === 'English' ? <p>Description</p> : 
                  selectorGallerySlice.settings.languageSelector === 'Українська' ? <p>Опис</p> : 
                  selectorGallerySlice.settings.languageSelector === 'Polska' ? <p>Opis</p> : <p>Description</p>}
                </p>{' '}
                <input
                  type="radio"
                  name="description"
                  checked={checkDescription}
                  onChange={checked}
                ></input>
              </label>

              <label className={ed.radioLab}>
                {' '}
                <p style={selectorGallerySlice.dayNight ? {color: 'rgb(122, 152, 206)'} : {color: ''}}>
                {selectorGallerySlice.settings.languageSelector === 'English' ? <p>File</p> : 
                  selectorGallerySlice.settings.languageSelector === 'Українська' ? <p>Файл</p> : 
                  selectorGallerySlice.settings.languageSelector === 'Polska' ? <p>Plik</p> : <p>File</p>}
                </p>{' '}
                <input
                  type="radio"
                  name="file"
                  checked={checkFile}
                  onChange={checked}
                ></input>
              </label>

              <label className={ed.radioLab}>
                {' '}
                <p style={selectorGallerySlice.dayNight ? {color: 'rgb(122, 152, 206)'} : {color: ''}}>
                {selectorGallerySlice.settings.languageSelector === 'English' ? <p>All</p> : 
                  selectorGallerySlice.settings.languageSelector === 'Українська' ? <p>Все</p> : 
                  selectorGallerySlice.settings.languageSelector === 'Polska' ? <p>Wszystko</p> : <p>All</p>}
                </p>{' '}
                <input
                  style = {selectorGallerySlice.dayNight ? {borderRadius: '6px', backgroundColor: 'rgb(122, 152, 206)'} : {borderRadius: '', backgroundColor: ''}}
                  type="radio"
                  name="all"
                  checked={checkAll}
                  onChange={checked}
                ></input>
              </label>
            </div>
          <div className={ed.field}>
            {checkTitle || checkAll ? <label className={ed.lab}>
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
                className={ed.in}
                style = {selectorGallerySlice.dayNight ? {borderRadius: '6px', backgroundColor: 'rgb(122, 152, 206)'} : {borderRadius: '', backgroundColor: ''}}
                type="text"
                autoComplete="false"
                onChange={inputChange}
                title="Title"
                placeholder={selectorGallerySlice.settings.languageSelector === 'English' ? "Enter title...": 
                selectorGallerySlice.settings.languageSelector === 'Українська' ? "Введіть заголовок...": 
                selectorGallerySlice.settings.languageSelector === 'Polska' ? "Wprowadź tytuł..." : "Enter style..."}
              ></input>
            </label> : ''}
            {checkDescription || checkAll ? <label className={ed.lab}>
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
                  selectorGallerySlice.settings.languageSelector === 'Українська' ? 'Будь ласка, заповніть поле Опис! ': 
                  selectorGallerySlice.settings.languageSelector === 'Polska' ? 'Proszę, wypełnić pole Opis!' : 'Please fill the Description field!',

                  maxLength: { value: 100, message: 
                    selectorGallerySlice.settings.languageSelector === 'English' ? 'Description is too long!': 
                    selectorGallerySlice.settings.languageSelector === 'Українська' ? 'Опис занадто товгий!' : 
                    selectorGallerySlice.settings.languageSelector === 'Polska' ? 'Opis jest za długi!' : 'Description is too long!' 
                  },
                  value: description,
                })}
                className={ed.in}
                style = {selectorGallerySlice.dayNight ? {borderRadius: '6px', backgroundColor: 'rgb(122, 152, 206)'} : {borderRadius: '', backgroundColor: ''}}
                type="text"
                onChange={inputChange}
                autoComplete="false"
                title="Description"
                placeholder={selectorGallerySlice.settings.languageSelector === 'English' ? "Enter short description...": 
                selectorGallerySlice.settings.languageSelector === 'Українська' ? "Введіть короткий опис...": 
                selectorGallerySlice.settings.languageSelector === 'Polska' ? "Wprowadź krótki opisl..." : "Enter short description..."}
              ></textarea>
            </label> : ''}
            {checkFile || checkAll ? <label className={ed.lab} style={selectorGallerySlice.dayNight ? {color: 'rgb(122, 152, 206)'} : {color: ''}}>
              {' '}
              <p className={ed.p} style={selectorGallerySlice.dayNight ? {color: 'rgb(122, 152, 206)', cursor: 'pointer'} : {color: '', cursor: 'pointer'}}>
              {selectorGallerySlice.settings.languageSelector === 'English' ? <p>Seach file</p> : 
                selectorGallerySlice.settings.languageSelector === 'Українська' ? <p>Вибрати файл</p> : 
                selectorGallerySlice.settings.languageSelector === 'Polska' ? <p>Wybierz plik</p> : <p>Seach file</p>}
              </p>
              <span style={{ border: 'none', fontSize: '12px' }}>
                {selectorGallerySlice.loadFiles || 
                selectorGallerySlice.settings.languageSelector === 'English' ? 'No search file...' : 
                selectorGallerySlice.settings.languageSelector === 'Українська' ? 'Файл не вибрано...' : 
                selectorGallerySlice.settings.languageSelector === 'Polska' ? 'Nie wybrano pliku...' : 'No search file...'}
              </span>
              <input
                {...register('Load', {
                  required: 
                  selectorGallerySlice.settings.languageSelector === 'English' ? 'Please selected file!' : 
                  selectorGallerySlice.settings.languageSelector === 'Українська' ? 'Будь ласка виберіть Файл! ': 
                  selectorGallerySlice.settings.languageSelector === 'Polska' ? 'Proszę, wybierz plik!' : 'Please selected file!',
                  value: file,
                })}
                className={ed.load}
                style = {selectorGallerySlice.dayNight ? {borderRadius: '6px', backgroundColor: 'rgb(122, 152, 206)'} : {borderRadius: '', backgroundColor: ''}}
                type="file"
                onChange={handleFileChange}
                autoComplete="false"
                title="Load file..."
                multiple="multiple"
                placeholder={selectorGallerySlice.settings.languageSelector === 'English' ? "Selected file...": 
                selectorGallerySlice.settings.languageSelector === 'Українська' ? "Виберіть файл...": 
                selectorGallerySlice.settings.languageSelector === 'Polska' ? "Wybierz plik..." : "Selected file..."}
              ></input>
            </label> : ''}

            <p style={{color: 'orange', fontSize: '14px', fontWeight: '600', textAlign: 'center'}}>
              {errorDrive ? errors?.Title ? <div className={ed.error}><WarningImg style={{width: '15px', height: '15px'}}/>{errors.Title.message}</div> :
               errors?.Description ? <div className={ed.error}><WarningImg style={{width: '20px', height: '20px'}}/>{errors.Description.message} </div>
              : errors?.Load ? <div className={ed.error}><WarningImg style={{width: '20px', height: '20px'}}/>{errors.Load.message}</div> : '' : ''} </p>

            {storagePath !== '' ? (
              <StorageWork
                data={{ storagePath, file, setStoragePath }}
              />
            ) : (
              ''
            )}
            <button className={ed.button} onMouseOver={changeBorderOver} onMouseOut={changeBorderOut} style = {selectorGallerySlice.dayNight ? {backgroundColor: 'rgb(122, 152, 206)'} : {backgroundColor: ''}}>
            {selectorGallerySlice.settings.languageSelector === 'English' ? <p>Change Item</p> : 
                selectorGallerySlice.settings.languageSelector === 'Українська' ? <p>Змінити елемент</p> : 
                selectorGallerySlice.settings.languageSelector === 'Polska' ? <p>Zmień element</p> : <p>Seach file</p>}
            </button>
          </div>
        </fieldset>
      </form>
    </div>
  );
};

export default EditItem;
