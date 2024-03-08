import { React, useState, useEffect } from 'react';
import { useSelector } from 'react-redux/es/hooks/useSelector';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { change } from 'vomgallStore/gallerySlice';
import { useForm } from 'react-hook-form';

import writeUserData from 'API/writerDB';
import getMetaAPI from 'API/getMetaDataAPI'
import { changeReadStorage } from 'vomgallStore/readSlice'
import StorageWork from 'components/StorageWork/StorageWork';
import deleteStorAPI from 'API/deleteStorageAPI';
import { getDatabase, ref, onValue } from 'firebase/database';
import { changeSingIn } from 'vomgallStore/singInSlice';
import { changeSingUp } from 'vomgallStore/singUpSlice';
import { changePathName } from 'vomgallStore/pathSlice';
import { changeDelAccount } from 'vomgallStore/deleteAccountSlice';
import { changeItemsMetaData } from 'vomgallStore/getMetaSlice';
import { auth } from "../../firebase";

import changeEmAPI from 'API/changeEmailAPI';
import changePassAPI from 'API/changePasswordAPI';
import changeVeriAPI from 'API/emailVerifiAPI';
import deleteAccAPI from 'API/deleteAccountAPI';

// import reauthUserAPI from 'API/reauthAPI';
import singOutAPI from '../../API/singOutAPI';
// import changeProAPI from 'API/changeProfileAPI';

import Notiflix from 'notiflix';

import ac from './Account.module.scss';

const Account = () => {

    const selectorGallerySlice = useSelector(state => state.gallery);
    const selectorSingInSlice = useSelector(state => state.singIn);
    const selectorItemsUrl = useSelector(state => state.readStorage);
    const selectorItemsMetaFullPath = useSelector(state => state.getMeta);
    // const selectorDelAccount = useSelector(state => state.deleteAccount);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [file, setFile] = useState(); 
    const [storagePath, setStoragePath] = useState('');
    const [fileLoaded, setFileLoaded] = useState(false);
    // const [name, setName] = useState('');
    const [sex, setSex] = useState('');
    const [age, setAge] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordRepeate, setPasswordRepeate] = useState('');

    useEffect(() => {

      // scroll to top on page load
      window.scrollTo({top: 0, left: 0, behavior: 'smooth'});
      
      if(selectorSingInSlice.isSingIn === true) {

        // path to DB account array
        const pathDB = `${selectorGallerySlice.users.find(element => element.uid === selectorSingInSlice.singInId).userName}/Account/Personal`;
 
         // listenAccount(path);
        const db = getDatabase();
        const starCountRef = ref(db, pathDB);
   
        //firebase listener function
        onValue(starCountRef, snapshot => {
 
         // load account array from DB
         const actualPersonal = snapshot.val();

         if(actualPersonal !== null) {
            // update account array from DB
            dispatch(change({operation: 'updatePersonal', data: actualPersonal}));
         };
          
        });
   
      };  
      // eslint-disable-next-line
    },[]);

    useEffect(() => {

      if(fileLoaded) {
  
        dispatch(change({ operation: 'changeLoadFiles', data: null }));
        // write full path to array for delete all data from storeg when account wil be deleted
        dispatch(getMetaAPI(storagePath));
      };
      setStoragePath('');
      setFileLoaded(false);
    // eslint-disable-next-line
    }, [fileLoaded]);

    useEffect(() => {
      
      if(selectorSingInSlice.isSingIn === true) {
        if(selectorGallerySlice.personal.sex !== '' && selectorGallerySlice.personal.age !== ''
        && selectorGallerySlice.personal.phone !== '') {

          const path = `${selectorGallerySlice.users.find(element => element.uid === selectorSingInSlice.singInId).userName}/Account/Personal`;

          writeUserData(
            path,
            {sex: selectorGallerySlice.personal.sex, age: selectorGallerySlice.personal.age, phone: selectorGallerySlice.personal.phone,},
            null, true
          );

        }
      }
    // eslint-disable-next-line
    },[selectorGallerySlice.personal]);

    const {
      register,
      handleSubmit,
    } = useForm({ mode: 'onBlur' });
    //formState: { errors },
    // clear user foro url from itemsURL if load is completed
    useEffect(() => {
      
      // when storagePath false - indicator load hidden delete selectorSingInSlice.singInId's element in
      //selectorItemsUrl.itemsURL. When new user foto url will be load
      if(storagePath === '') {
      
        dispatch(changeReadStorage({operation: `clearUserFotoElement`, data: {id: selectorSingInSlice.singInId}}));

      }
      // eslint-disable-next-line
    },[storagePath]);

    // update account array in DB
    useEffect(() => {
      
      const path = `${selectorGallerySlice.users.find(element => element.uid === selectorSingInSlice.singInId).userName}/Account/Foto`;
      
      // account array not empty
      if(Object.keys(selectorGallerySlice.account).length !== 0) {
        writeUserData(
          path,
          {url: selectorGallerySlice.account.url, type: selectorGallerySlice.typeOfFile},
          null, true
        );
      }
    // eslint-disable-next-line
    },[selectorGallerySlice.account]);

    // see sharedLayuot.js file, row 68 
    // get actual account array and write user foto url
    useEffect(() => {
      
      // foto URL writing to selectorItemsUrl.itemsURL with souch id
      const userFotoId =  selectorSingInSlice.singInId;

      if(selectorSingInSlice.isSingIn === true && selectorItemsUrl.itemsURL.find(element => element.id === userFotoId)) {

       // path to DB account array
       const pathDB = `${selectorGallerySlice.users.find(element => element.uid === selectorSingInSlice.singInId).userName}/Account/Foto`;

        // listenAccount(path);
       const db = getDatabase();
       const starCountRef = ref(db, pathDB);
  
       //firebase listener function
       onValue(starCountRef, snapshot => {

        // load account array from DB
        const actualAccount = snapshot.val();

        // update account array from DB
        dispatch(change({operation: 'changeAccountArray', data: actualAccount}));

        // don't rewrite such every time
        // if(selectorGallerySlice.account.url === '')
        // update URL in account array
        dispatch(change({operation: 'updateAccountData', data: {url: selectorItemsUrl.itemsURL.find(element => element.id === userFotoId).url}}));
         
       });
  
     };  
       // selectorItemsUrl.itemsURL ^ for update user foto
       // eslint-disable-next-line
    }, [selectorSingInSlice.isSingIn, selectorItemsUrl.itemsURL]);
    

    useEffect(() => {
      if(storagePath) dispatch(change({ operation: 'changeLoadFiles', data: null }));
      // eslint-disable-next-line
    }, [storagePath]);

    const handleFileChange = (evt) => {
      if (evt.target.files) {
       
        setFile(evt.target.files[0]);
       
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

    const addUserFoto = (_, evt) => {

      evt.preventDefault();
      const path = `${selectorGallerySlice.users.find(element => element.uid === selectorSingInSlice.singInId).userName}/Account/Foto`;

      setStoragePath(path);
      // add foto element to DB
      writeUserData(
        path,
        {url: '', type: selectorGallerySlice.typeOfFile},
        null, true
      );

      dispatch(changeReadStorage({operation: `clearErrorElementId`}));
    
    };

    // const handleName = (evt) => {
    //   setName(evt.target.value);
    // };

    const handleSex = (evt) => {
      setSex(evt.target.value);
    };

    const sexClick = (evt) => {
      
      evt.preventDefault();

      dispatch(change({operation: 'changePersonal', data:{element: 'sex', value: sex}}));
      setSex('');
    };
    
    const handleAge = (evt) => {
      setAge(evt.target.value);
    };

    const ageClick = (evt) => {

      evt.preventDefault();

      dispatch(change({operation: 'changePersonal', data:{element: 'age', value: age}}));
      setAge('');
    };
    
    const handlePhone = (evt) => {
      setPhone(evt.target.value);
    };

    const phoneClick = (evt) => {

      evt.preventDefault();

      dispatch(change({operation: 'changePersonal', data:{element: 'phone', value: phone}}));
      setPhone('');
    };

    const handleEmail = (evt) => {
      setEmail(evt.target.value);
    };

    const emailClick = () => {
      // dispatch(changeProAPI('vombart@i.ua')); 
      // dispatch(changeVeriAPI(email));
      dispatch(changeEmAPI(email));
    };

    const handlePassword = (evt) => {
      setPassword(evt.target.value);
    };

    const handlePasswordRepeate = (evt) => {
      setPasswordRepeate(evt.target.value);
    };

    const confirmEmail = () => {
      dispatch(changeVeriAPI(email)); 
    };

    const passwordClick = () => {
    
      if(password === passwordRepeate  && password !== '' && passwordRepeate !== '') {
        dispatch(changePassAPI(passwordRepeate));
      } else {
        Notiflix.Notify.warning('Passwords are not equal or empty', {width: '450px', position: 'center-top', fontSize: '24px',});
      }

    } 

    // get array of users wrote to deleted user
    const deleteMyMessagesFrom = () => {

      if(selectorGallerySlice.personalMessagesBuffer !== null && selectorGallerySlice.personalMessagesBuffer.length !== 0) {

        console.log(Object.keys(selectorGallerySlice.personalMessagesBuffer).filter(element => element.uid !== selectorSingInSlice.singInId));
        // get list of not my keys
        return Object.keys(selectorGallerySlice.personalMessagesBuffer).filter(element => element.uid !== selectorSingInSlice.singInId);


      }
    };

    // delete only account
    const delAccount = () => {

      Notiflix.Confirm.show(
        'Confirm',
        'Current account will be deleted! Are you sure?',
        'Yes',
        'No',
        () => {
          
          navigate('/');

          dispatch(changeSingIn({data: false, operation: 'changeisSingIn'}));
          dispatch(changeDelAccount({operation: 'changeAccountIsDeleted', data: true}));
          // delete user from users array
          dispatch(change({operation: 'deleteUsers', data: {id: selectorSingInSlice.singInId}}));

          dispatch(changeSingIn({data: '', operation: 'changeToken'}));
          dispatch(changeSingIn({data: false, operation: 'changeSingInId'}));

          dispatch(changePathName({data: ''}));
          dispatch(changeSingUp({operation: 'changeusersId', data: ''}));
          dispatch(changeSingUp({operation: 'changeUserExist', data: false}));
          dispatch(singOutAPI());
          dispatch(deleteAccAPI());
          // go to 55 row
          
        },
        () => {
        
        },
        {
        },
        );
    };

    // delete account and data
    const delAccountWithData = () => {

      Notiflix.Confirm.show(
        'Confirm',
        'Current account will be deleted! Are you sure?',
        'Yes',
        'No',
        () => {

          const path = `${selectorGallerySlice.users.find(element => element.uid === selectorSingInSlice.singInId).userName}`;

          navigate('/');

          dispatch(changeSingIn({data: false, operation: 'changeisSingIn'}));
          dispatch(changeDelAccount({operation: 'changeAccountIsDeleted', data: true}));

          for(let m = 0; m < deleteMyMessagesFrom().length; m += 1) {

            // delete messages wrote from deleted user to athers (write 'null')
            writeUserData(
              `${selectorGallerySlice.users.find(element => element.uid === deleteMyMessagesFrom()[m]).userName}/personalChat/${selectorSingInSlice.singInId}`,
              null,
              null, true
            );
           
          };
          
          // delete user from users array
          dispatch(change({operation: 'deleteUsers', data: {id: selectorSingInSlice.singInId}}));
          
          // delete user from DB (write 'null')
          writeUserData(
            'users',
            selectorGallerySlice.users.filter(element => element.uid !== selectorSingInSlice.singInId),
            null, true
          );


          dispatch(changeSingIn({data: '', operation: 'changeToken'}));
          dispatch(changeSingIn({data: false, operation: 'changeSingInId'}));

          dispatch(changePathName({data: ''}));
          dispatch(changeSingUp({operation: 'changeusersId', data: ''}));
          dispatch(changeSingUp({operation: 'changeUserExist', data: false}));

          // delete all files from storege
          // Add to 'itemsMetaData' id and fullpath item content in storage, when new item create (see newItem.js 43 row).
          // It's necessary for delete all data from storage, when delete user operation search. FireBase service doesn't have
          // method for delete find or all data. He has only delet file method. 
          selectorItemsMetaFullPath.itemsMetaData.forEach(element => dispatch(deleteStorAPI(element.path)));
          
          // delete 'userName' directory from DB (write 'null')
          writeUserData(
            path,
            null,
            selectorGallerySlice.date, true
          );

          // clear 'itemsMetaData'
          dispatch(changeItemsMetaData({operation: 'updateMetaData', data: []}));

          dispatch(singOutAPI());
          dispatch(deleteAccAPI());
          // go to 55 row
        },
        () => {
        
        },
        {
        },
        );
    };

    const totalView = () => {

      let total = 0;

      if(selectorGallerySlice.itemsBuffer !== null && Object.keys(selectorGallerySlice.viewsStatistic).length !== 0) {
        for(let v = 0; v < selectorGallerySlice.itemsBuffer.length; v += 1) {
          
          total += Number(selectorGallerySlice.viewsStatistic[selectorGallerySlice.itemsBuffer[v].id]);
        }
      }
      return total;
    };

    const totalLevel = () => {

      let total = 0;

      if(selectorGallerySlice.itemsBuffer !== null && Object.keys(selectorGallerySlice.levelStatistic).length !== 0) {
        for(let v = 0; v < selectorGallerySlice.itemsBuffer.length; v += 1) {
        total += Number(selectorGallerySlice.levelStatistic[selectorGallerySlice.itemsBuffer[v].id]);
        return total / selectorGallerySlice.itemsBuffer.length;
      }
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

      <div className={ac.container}>

        <div className={ac.userfoto} style={selectorGallerySlice.dayNight ? {backgroundColor: '#384a83', color: 'rgb(122, 152, 206)'} : {backgroundColor: 'lightgray', color: ''}}>

          <div className={ac.file}>

          <img src={`${selectorGallerySlice.account.url}`} alt='user foto' style={{width: '150px', borderRadius: '8px'}}></img>

          <form className={ac.fise} onSubmit={handleSubmit(addUserFoto)}>

            <label className={ac.lab}>
        
              <p className={ac.p} style={selectorGallerySlice.dayNight ? {backgroundColor: 'rgb(122, 152, 206)', color: '#384a83',} : {backgroundColor: '', color: ''}}>
              {selectorGallerySlice.settings.languageSelector === 'English' ? <span>Seach file</span> : 
                selectorGallerySlice.settings.languageSelector === 'Українська' ? <span>Вибрати файл</span> : 
                selectorGallerySlice.settings.languageSelector === 'Polska' ? <span>Wybierz plik</span> : <span>Seach file</span>}
              </p>
              
              <span style={{ border: 'none', fontSize: '12px' }}>
                  {selectorGallerySlice.loadFiles !== '' ?  selectorGallerySlice.loadFiles :
                  selectorGallerySlice.settings.languageSelector === 'English' ? 'No search file...' : 
                  selectorGallerySlice.settings.languageSelector === 'Українська' ? 'Файл не вибрано...' : 
                  selectorGallerySlice.settings.languageSelector === 'Polska' ? 'Nie wybrano pliku...' : 'No search file...'}
                  
              </span>
              
              <input
                {...register('Load', {
                  required: 'Please fill the Description field!',
                  value: file,
                })}
                className={ac.load}
                type="file"
                onChange={handleFileChange}
                autoComplete="false"
                title="Load file..."
                multiple="multiple"
                placeholder="Enter short description..."
              ></input>
              
            </label>
            
            <button className={ac.button} onMouseOver={changeBorderOver} onMouseOut={changeBorderOut} style={selectorGallerySlice.dayNight ? {backgroundColor: 'rgb(122, 152, 206)'} : {backgroundColor: ''}}>
            {selectorGallerySlice.settings.languageSelector === 'English' ? <p>Add/Change foto</p> : 
                selectorGallerySlice.settings.languageSelector === 'Українська' ? <p>Додати/Змінити фото</p> : 
                selectorGallerySlice.settings.languageSelector === 'Polska' ? <p>Dodaj/Zmień zdjęcie</p> : <p>Add/Change foto</p>}
            </button>

          </form>

          </div>

          <div className={ac.statistic} style={selectorGallerySlice.dayNight ? {backgroundColor: 'rgb(122, 152, 206)', color: '#384a83'} : {backgroundColor: 'white', color: ''}}>
            <div className={ac.itemContainer} style={selectorGallerySlice.dayNight ? {color: '#384a83'} : {color: ''}}><p>
            {selectorGallerySlice.settings.languageSelector === 'English' ? <span>All hearts:</span> : 
                selectorGallerySlice.settings.languageSelector === 'Українська' ? <span>Всі вподабайки:</span> : 
                selectorGallerySlice.settings.languageSelector === 'Polska' ? <span>Wszystkie ulubione:</span> : <span>All hearts:</span>}
            </p> <p className={ac.item} style={selectorGallerySlice.dayNight ? {color: '#384a83'} : {color: ''}}>{selectorSingInSlice.singInId && selectorGallerySlice.heartsStatistic[selectorSingInSlice.singInId] !== undefined ? Object.keys(selectorGallerySlice.heartsStatistic[selectorSingInSlice.singInId]).length : ''}</p></div>
            <div className={ac.itemContainer} style={selectorGallerySlice.dayNight ? {color: '#384a83'} : {color: ''}}><p>
            {selectorGallerySlice.settings.languageSelector === 'English' ? <span>All view:</span> : 
                selectorGallerySlice.settings.languageSelector === 'Українська' ? <span>Всі перегляди:</span> : 
                selectorGallerySlice.settings.languageSelector === 'Polska' ? <span>Wszystkie widoki:</span> : <span>All view:</span>}
            </p> <p className={ac.item} style={selectorGallerySlice.dayNight ? {color: '#384a83'} : {color: ''}}>{totalView()}</p></div>
            <div className={ac.totalItemContainer} style={selectorGallerySlice.dayNight ? {color: '#384a83'} : {color: ''}}><p>
            {selectorGallerySlice.settings.languageSelector === 'English' ? <span>Total level:</span> : 
                selectorGallerySlice.settings.languageSelector === 'Українська' ? <span>Загальний рівень:</span> : 
                selectorGallerySlice.settings.languageSelector === 'Polska' ? <span>Poziom ogólny:</span> : <span>Total level:</span>}
            </p> <p className={ac.totalItem} style={selectorGallerySlice.dayNight ? {color: '#384a83'} : {color: ''}}>{totalLevel()}</p></div>
          </div>
          
        </div>
        
        {storagePath !== '' ? <StorageWork data={{storagePath, file, setStoragePath, setFileLoaded}}/> : ''}

        <p style={selectorGallerySlice.dayNight ? {color: 'rgb(122, 152, 206)', fontSize: '18px', fontWeight: '600' } : {color: 'gray', fontSize: '18px', fontWeight: '600' }}>
        {selectorGallerySlice.settings.languageSelector === 'English' ? <span>Name</span> : 
                selectorGallerySlice.settings.languageSelector === 'Українська' ? <span>Ім'я</span> : 
                selectorGallerySlice.settings.languageSelector === 'Polska' ? <span>Imię</span> : <span>Name</span>}
        </p>
        <div className={ac.userInfo} style={selectorGallerySlice.dayNight ? {backgroundColor: '#384a83', color: '#384a83',} : {backgroundColor: '', color: ''}}>
          <p style={selectorGallerySlice.dayNight ? {color: 'rgb(122, 152, 206)', fontSize: '24px', fontWeight: '600' } : {color: 'gray', fontSize: '24px', fontWeight: '600' }}>{selectorSingInSlice.singInId ? selectorGallerySlice.users.find(element => element.uid === selectorSingInSlice.singInId).userName : ''}</p>
    
          {/* <form className={ac.fise} >
            <label className={ac.lab}>

                <input
                  value = {name}
                  className={ac.infoInput}
                  type="text"
                  onChange={handleName}
                  autoComplete="false"
                  title="Name"
                  placeholder="Enter other name..."
                ></input>
            <button>Change</button>
            </label>
          </form> */}
        </div>

        <p style={selectorGallerySlice.dayNight ? {color: 'rgb(122, 152, 206)', fontSize: '18px', fontWeight: '600' } : {color: 'gray', fontSize: '18px', fontWeight: '600' }}>
        {selectorGallerySlice.settings.languageSelector === 'English' ? <span>Sex</span> : 
                selectorGallerySlice.settings.languageSelector === 'Українська' ? <span>Стать</span> : 
                selectorGallerySlice.settings.languageSelector === 'Polska' ? <span>Seks</span> : <span>Sex</span>}
        </p>
        <div className={ac.userInfo} style={selectorGallerySlice.dayNight ? {backgroundColor: '#384a83', color: '#384a83',} : {backgroundColor: '', color: ''}}>
          <p style={selectorGallerySlice.dayNight ? {color: 'rgb(122, 152, 206)', fontSize: '24px', fontWeight: '600' } : {color: 'gray', fontSize: '24px', fontWeight: '600' }}>{selectorSingInSlice.singInId ? selectorGallerySlice.personal.sex : ''}</p>
          <form className={ac.fise} >
          <label className={ac.lab}>

              <input
                value = {sex}
                className={ac.infoInput}
                style={selectorGallerySlice.dayNight ? {backgroundColor: 'rgb(122, 152, 206)', color: '#384a83'} : {backgroundColor: '', color: ''}}
                type="text"
                onChange={handleSex}
                autoComplete="false"
                title="Sex"
                placeholder={selectorGallerySlice.settings.languageSelector === 'English' ? "Enter other sex...": 
                selectorGallerySlice.settings.languageSelector === 'Українська' ? "Введіть іншу стать...": 
                selectorGallerySlice.settings.languageSelector === 'Polska' ? "Podaj inną płeć..." : "Enter other sex..."}
              ></input>
          <button onMouseOver={changeBorderOver} onMouseOut={changeBorderOut} style={selectorGallerySlice.dayNight ? {backgroundColor: 'rgb(122, 152, 206)', color: '#384a83', width: 'fit-content'} : {backgroundColor: '', color: '', width: 'fit-content'}} onClick={sexClick}>
          {selectorGallerySlice.settings.languageSelector === 'English' ? <p>Save</p> : 
                selectorGallerySlice.settings.languageSelector === 'Українська' ? <p>Зберегти</p> : 
                selectorGallerySlice.settings.languageSelector === 'Polska' ? <p>Zapisz</p> : <p>Save</p>}
          </button>
          </label>
        </form>
        </div>

        <p style={selectorGallerySlice.dayNight ? {color: 'rgb(122, 152, 206)', fontSize: '18px', fontWeight: '600' } : {color: 'gray', fontSize: '18px', fontWeight: '600' }}>
        {selectorGallerySlice.settings.languageSelector === 'English' ? <span>Age</span> : 
                selectorGallerySlice.settings.languageSelector === 'Українська' ? <span>Вік</span> : 
                selectorGallerySlice.settings.languageSelector === 'Polska' ? <span>Wiek</span> : <span>Age</span>}
        </p>       
        <div className={ac.userInfo} style={selectorGallerySlice.dayNight ? {backgroundColor: '#384a83', color: '#384a83',} : {backgroundColor: '', color: ''}}>
        <p style={selectorGallerySlice.dayNight ? {color: 'rgb(122, 152, 206)', fontSize: '24px', fontWeight: '600' } : {color: 'gray', fontSize: '24px', fontWeight: '600' }}>{selectorSingInSlice.singInId ? selectorGallerySlice.personal.age : ''}</p>
        <form className={ac.fise} >    
          <label className={ac.lab}>

              <input
                value = {age}
                className={ac.infoInput}
                style={selectorGallerySlice.dayNight ? {backgroundColor: 'rgb(122, 152, 206)', color: '#384a83'} : {backgroundColor: '', color: ''}}
                type="text"
                onChange={handleAge}
                autoComplete="false"
                title="Age"
                placeholder={selectorGallerySlice.settings.languageSelector === 'English' ? "Enter other age...": 
                selectorGallerySlice.settings.languageSelector === 'Українська' ? "Введіть інший вік...": 
                selectorGallerySlice.settings.languageSelector === 'Polska' ? "Podaj inny wiek..." : "Enter other age..."}
              ></input>
          <button onMouseOver={changeBorderOver} onMouseOut={changeBorderOut} style={selectorGallerySlice.dayNight ? {backgroundColor: 'rgb(122, 152, 206)', color: '#384a83', width: 'fit-content'} : {backgroundColor: '', color: '', width: 'fit-content'}} onClick={ageClick}>
          {selectorGallerySlice.settings.languageSelector === 'English' ? <p>Save</p> : 
                selectorGallerySlice.settings.languageSelector === 'Українська' ? <p>Зберегти</p> : 
                selectorGallerySlice.settings.languageSelector === 'Polska' ? <p>Zapisz</p> : <p>Save</p>}
          </button>
          </label>
          </form>
        </div>

        <p style={selectorGallerySlice.dayNight ? {color: 'rgb(122, 152, 206)', fontSize: '18px', fontWeight: '600' } : {color: 'gray', fontSize: '18px', fontWeight: '600' }}>
        {selectorGallerySlice.settings.languageSelector === 'English' ? <span>Phone</span> : 
                selectorGallerySlice.settings.languageSelector === 'Українська' ? <span>Телефон</span> : 
                selectorGallerySlice.settings.languageSelector === 'Polska' ? <span>Telefon</span> : <span>Phone</span>}
        </p>
        <div className={ac.userInfo} style={selectorGallerySlice.dayNight ? {backgroundColor: '#384a83', color: '#384a83',} : {backgroundColor: '', color: ''}}>
        <p style={selectorGallerySlice.dayNight ? {color: 'rgb(122, 152, 206)', fontSize: '24px', fontWeight: '600' } : {color: 'gray', fontSize: '24px', fontWeight: '600' }}>{selectorSingInSlice.singInId ? selectorGallerySlice.personal.phone : ''}</p>
          <label className={ac.lab}>
              <input
                value = {phone}
                className={ac.infoInput}
                style={selectorGallerySlice.dayNight ? {backgroundColor: 'rgb(122, 152, 206)', color: '#384a83'} : {backgroundColor: '', color: ''}}
                type="text"
                onChange={handlePhone}
                autoComplete="false"
                title="Phone"
                placeholder={selectorGallerySlice.settings.languageSelector === 'English' ? "Enter other phone...": 
                selectorGallerySlice.settings.languageSelector === 'Українська' ? "Введіть інший телефон...": 
                selectorGallerySlice.settings.languageSelector === 'Polska' ? "Wprowadź inny telefon..." : "Enter other phone..."}
              ></input>
          <button onMouseOver={changeBorderOver} onMouseOut={changeBorderOut} style={selectorGallerySlice.dayNight ? {backgroundColor: 'rgb(122, 152, 206)', color: '#384a83', width: 'fit-content'} : {backgroundColor: '', color: '', width: 'fit-content'}} onClick={phoneClick}>
          {selectorGallerySlice.settings.languageSelector === 'English' ? <p>Save</p> : 
                selectorGallerySlice.settings.languageSelector === 'Українська' ? <p>Зберегти</p> : 
                selectorGallerySlice.settings.languageSelector === 'Polska' ? <p>Zapisz</p> : <p>Save</p>}
          </button>
          </label>
         
        </div>

        <p style={selectorGallerySlice.dayNight ? {color: 'rgb(122, 152, 206)', fontSize: '18px', fontWeight: '600' } : {color: 'gray', fontSize: '18px', fontWeight: '600' }}>
        {selectorGallerySlice.settings.languageSelector === 'English' ? <span>Email</span> : 
                selectorGallerySlice.settings.languageSelector === 'Українська' ? <span>Пошта</span> : 
                selectorGallerySlice.settings.languageSelector === 'Polska' ? <span>Poczta</span> : <span>Email</span>}
        </p>
        <div className={ac.userInfo} style={selectorGallerySlice.dayNight ? {backgroundColor: '#384a83', color: '#384a83', height: 'fit-content'} : {backgroundColor: '', color: '', height: 'fit-content',}}>

        <p style={selectorGallerySlice.dayNight ? {color: 'rgb(122, 152, 206)', fontSize: '24px', fontWeight: '600'} : {color: 'gray', fontSize: '24px', fontWeight: '600', width: '100%', overflowWrap: 'break-word', textAlign: 'center'}}>{selectorSingInSlice.singInId ? selectorGallerySlice.users.find(element => element.uid === selectorSingInSlice.singInId).email : ''}</p>
        <p style={selectorGallerySlice.dayNight ? {color: 'rgb(122, 152, 206)', fontSize: '24px', fontWeight: '600' } : {color: 'gray', fontSize: '24px', fontWeight: '600' }}>{selectorSingInSlice.singInId && auth.currentUser !== null && auth.currentUser.emailVerified ? <span style={{color: 'green'}}>{'confirmed'}</span> : <span style={{color: 'orange'}}>{'not confirmed'}</span>}</p>
        {auth.currentUser !== null && !auth.currentUser.emailVerified ? <button onMouseOver={changeBorderOver} onMouseOut={changeBorderOut} style={selectorGallerySlice.dayNight ? {backgroundColor: 'rgb(122, 152, 206)', color: '#384a83', width: 'fit-content'} : {backgroundColor: '', color: '', width: 'fit-content'}} onClick={confirmEmail}>
        {selectorGallerySlice.settings.languageSelector === 'English' ? <p>Confirm</p> : 
                selectorGallerySlice.settings.languageSelector === 'Українська' ? <p>Підтвердити</p> : 
                selectorGallerySlice.settings.languageSelector === 'Polska' ? <p>Potwierdzać</p> : <p>Confirm</p>}
        </button> : ''}       

          <label className={ac.lab}>
              <input
                value = {email}
                className={ac.infoInput}
                style={selectorGallerySlice.dayNight ? {backgroundColor: 'rgb(122, 152, 206)', color: '#384a83'} : {backgroundColor: '', color: ''}}
                type="text"
                onChange={handleEmail}
                autoComplete="false"
                title="Email"
                placeholder={selectorGallerySlice.settings.languageSelector === 'English' ? "Enter other email...": 
                selectorGallerySlice.settings.languageSelector === 'Українська' ? "Введіть іншу пошту...": 
                selectorGallerySlice.settings.languageSelector === 'Polska' ? "Wpisz inny adres e-mail..." : "Enter other email..."}
              ></input>
          <button onMouseOver={changeBorderOver} onMouseOut={changeBorderOut} style={selectorGallerySlice.dayNight ? {backgroundColor: 'rgb(122, 152, 206)', color: '#384a83', width: 'fit-content'} : {backgroundColor: '', color: '', width: 'fit-content'}} onClick={emailClick}>
          {selectorGallerySlice.settings.languageSelector === 'English' ? <p>Change</p> : 
                selectorGallerySlice.settings.languageSelector === 'Українська' ? <p>Змінити</p> : 
                selectorGallerySlice.settings.languageSelector === 'Polska' ? <p>Zmiana</p> : <p>Change</p>}
          </button>
          </label>
         
        </div>

        <p style={selectorGallerySlice.dayNight ? {color: 'rgb(122, 152, 206)', fontSize: '18px', fontWeight: '600' } : {color: 'gray', fontSize: '18px', fontWeight: '600' }}>
        {selectorGallerySlice.settings.languageSelector === 'English' ? <span>Password</span> : 
                selectorGallerySlice.settings.languageSelector === 'Українська' ? <span>Пароль</span> : 
                selectorGallerySlice.settings.languageSelector === 'Polska' ? <span>Hasło</span> : <span>Password</span>}
        </p>
        <div className={ac.userInfo} style={selectorGallerySlice.dayNight ? {backgroundColor: '#384a83', color: '#384a83',} : {backgroundColor: '', color: ''}}>

          <label className={ac.lab}>
              <input
                value = {password}
                className={`${ac.infoInput} ${ac.pass}`}
                style={selectorGallerySlice.dayNight ? {backgroundColor: 'rgb(122, 152, 206)', color: '#384a83'} : {backgroundColor: '', color: ''}}
                type="password"
                onChange={handlePassword}
                autoComplete="false"
                title="Password"
                placeholder={selectorGallerySlice.settings.languageSelector === 'English' ? "Enter new password...": 
                selectorGallerySlice.settings.languageSelector === 'Українська' ? "Введіть новий пароль...": 
                selectorGallerySlice.settings.languageSelector === 'Polska' ? "Wpisz nowe hasło..." : "Enter new password..."}
              ></input>
          
          </label>

          <label className={ac.lab}>
              <input
                value = {passwordRepeate}
                className={`${ac.infoInput} ${ac.pass}`}
                style={selectorGallerySlice.dayNight ? {backgroundColor: 'rgb(122, 152, 206)', color: '#384a83'} : {backgroundColor: '', color: ''}}
                type="password"
                onChange={handlePasswordRepeate}
                autoComplete="false"
                title="Password Repeate"
                placeholder={selectorGallerySlice.settings.languageSelector === 'English' ? "Repeate new password...": 
                selectorGallerySlice.settings.languageSelector === 'Українська' ? "Повторіть новий пароль...": 
                selectorGallerySlice.settings.languageSelector === 'Polska' ? "Powtórz nowe hasło..." : "Repeate new password..."}
              ></input>
          
          </label>

          <button onMouseOver={changeBorderOver} onMouseOut={changeBorderOut} style={selectorGallerySlice.dayNight ? {backgroundColor: 'rgb(122, 152, 206)', color: '#384a83', width: 'fit-content'} : {backgroundColor: '', color: '', width: 'fit-content'}} onClick={passwordClick}>
          {selectorGallerySlice.settings.languageSelector === 'English' ? <p>Change</p> : 
                selectorGallerySlice.settings.languageSelector === 'Українська' ? <p>Змінити</p> : 
                selectorGallerySlice.settings.languageSelector === 'Polska' ? <p>Zmiana</p> : <p>Change</p>}
          </button>
         
        </div>

        <p style={selectorGallerySlice.dayNight ? {color: 'rgb(122, 152, 206)', fontSize: '18px', fontWeight: '600' } : {color: 'gray', fontSize: '18px', fontWeight: '600' }}>
        {selectorGallerySlice.settings.languageSelector === 'English' ? <span>Delete account</span> : 
                selectorGallerySlice.settings.languageSelector === 'Українська' ? <span>Видалити профіль</span> : 
                selectorGallerySlice.settings.languageSelector === 'Polska' ? <span>Usuń profil</span> : <span>Delete account</span>}
        </p>
        <div className={ac.userInfo} style={selectorGallerySlice.dayNight ? {backgroundColor: '#384a83', color: '#384a83',} : {backgroundColor: '', color: ''}}>
          <button onMouseOver={changeBorderOver} onMouseOut={changeBorderOut} style={selectorGallerySlice.dayNight ? {backgroundColor: 'rgb(122, 152, 206)', color: '#384a83', width: 'fit-content'} : {backgroundColor: '', color: '', width: 'fit-content'}} onClick={delAccount}>
          {selectorGallerySlice.settings.languageSelector === 'English' ? <p>Delete only account</p> : 
                selectorGallerySlice.settings.languageSelector === 'Українська' ? <p>Видалити тільки профіль</p> : 
                selectorGallerySlice.settings.languageSelector === 'Polska' ? <p>Usuń tylko profil</p> : <p>Delete only account</p>}
          </button>
          <button onMouseOver={changeBorderOver} onMouseOut={changeBorderOut} style={selectorGallerySlice.dayNight ? {backgroundColor: 'rgb(122, 152, 206)', color: '#384a83', width: 'fit-content'} : {backgroundColor: '', color: '', width: 'fit-content'}} onClick={delAccountWithData}>
          {selectorGallerySlice.settings.languageSelector === 'English' ? <p>Delete account whith all data</p> : 
                selectorGallerySlice.settings.languageSelector === 'Українська' ? <p>Видалити з даними</p> : 
                selectorGallerySlice.settings.languageSelector === 'Polska' ? <p>Usuń z danymi</p> : <p>Delete account whith all data</p>}
          </button>
        </div>

      </div>

    )
  }
  
  export default Account