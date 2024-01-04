import { React, useState, useEffect } from 'react';
import { useSelector } from 'react-redux/es/hooks/useSelector';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { change } from 'vomgallStore/gallerySlice';
import { useForm } from 'react-hook-form';

import writeUserData from 'API/writerDB';
import { changeReadStorage } from 'vomgallStore/readSlice'
import StorageWork from 'components/StorageWork/StorageWork';
import { getDatabase, ref, onValue } from 'firebase/database';
import { changeSingIn } from 'vomgallStore/singInSlice';
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

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [file, setFile] = useState();
    const [storagePath, setStoragePath] = useState('');
    const [name, setName] = useState('');
    const [sex, setSex] = useState('');
    const [age, setAge] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordRepeate, setPasswordRepeate] = useState('');

    const {
      register,
      handleSubmit,
      formState: { errors },
    } = useForm({ mode: 'onBlur' });

    // clear user foro url from itemsURL if load is completed
    useEffect(() => {
      
      // when storagePath false - indicator load hidden delete selectorSingInSlice.singInId's element in
      //selectorItemsUrl.itemsURL. When new user foto url will be load
      if(storagePath === '') {
      
        dispatch(changeReadStorage({operation: `clearUserFotoElement`, data: {id: selectorSingInSlice.singInId}}));

      }
  
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
    }, [selectorSingInSlice.isSingIn, selectorItemsUrl.itemsURL]);
    
    // clear storagePath
    useEffect(() => {
      if(storagePath) dispatch(change({ operation: 'changeLoadFiles', data: null }));
    }, [storagePath]);

    const handleFileChange = (evt) => {
      if (evt.target.files) {

        setFile(evt.target.files[0]);

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

    const addUserFoto = (_, evt) => {

      evt.preventDefault();
      
      setStoragePath(`${selectorGallerySlice.users.find(element => element.uid === selectorSingInSlice.singInId).userName}/Account/Foto`);
      const path = `${selectorGallerySlice.users.find(element => element.uid === selectorSingInSlice.singInId).userName}/Account/Foto`;

      // add foto element to DB
      writeUserData(
        path,
        {url: '', type: selectorGallerySlice.typeOfFile},
        null, true
      );

      dispatch(changeReadStorage({operation: `clearErrorElementId`}));
    
    };

    const handleName = (evt) => {
      setName(evt.target.value);
    };

    const handleSex = (evt) => {
      setSex(evt.target.value);
    };

    const handleAge = (evt) => {
      setAge(evt.target.value);
    };
    
    const handlePhone = (evt) => {
      setPhone(evt.target.value);
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

    const delAccount = () => {

      Notiflix.Confirm.show(
        'Confirm',
        'Current account will be deleted! Are you sure?',
        'Yes',
        'No',
        () => {

          // dispatch(reauthUserAPI({email: email, password: password}));

          // delete user from users array
          dispatch(change({operation: 'deleteUsers', data: {id: selectorSingInSlice.singInId}}));
          // delete account
          dispatch(deleteAccAPI());
          dispatch(singOutAPI());


          dispatch(changeSingIn({data: false, operation: 'changeisSingIn'}));
          dispatch(changeSingIn({data: '', operation: 'changeToken'}));
          // dispatch(change({operation: 'changeUserStatus', data: {id: selectorSingInSlice.singInId, status: false}}));
          dispatch(changeSingIn({data: false, operation: 'changeSingInId'}));
          // dispatch(changePathName({data: ''}));
          
          // close modal settings
          // setModalSettingsToggle(false);
          navigate('/');
        },
        () => {
        
        },
        {
        },
        );
    };

    const delAccountWithData = () => {
      // dispatch(singOutAPI());
    };

    return (

      <div className={ac.container}>

        <div className={ac.userfoto}>

          <p style={{ color: 'white', fontSize: '18px', fontWeight: '600' }}>Foto</p>

          <div className={ac.file}>

          <img src={`${selectorGallerySlice.account.url}`} alt='user foto' style={{width: '150px', borderRadius: '8px'}}></img>

          <form className={ac.fise} onSubmit={handleSubmit(addUserFoto)}>

            <label className={ac.lab}>
        
              <p className={ac.p}>Seach file</p>
              
              <span style={{ border: 'none', fontSize: '12px' }}>
                  {selectorGallerySlice.loadFiles || 'No search file...'}
                  
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
            
            <button className={ac.button}>Add/Change foto</button>

          </form>

          </div>
          
        </div>
        {storagePath !== '' ? <StorageWork data={{storagePath, file, setStoragePath}}/> : ''}

        <p style={{ color: 'gray', fontSize: '18px', fontWeight: '600' }}>Name</p>
        <div className={ac.userInfo}>
          <p style={{ color: 'white', fontSize: '24px', fontWeight: '600' }}>{selectorSingInSlice.singInId ? selectorGallerySlice.users.find(element => element.uid === selectorSingInSlice.singInId).userName : ''}</p>
    
          <form className={ac.fise} >
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
          </form>
        </div>

        <p style={{ color: 'gray', fontSize: '18px', fontWeight: '600' }}>Sex</p>
        <div className={ac.userInfo}>

          <form className={ac.fise} >
          <label className={ac.lab}>

              <input
                value = {sex}
                className={ac.infoInput}
                type="text"
                onChange={handleSex}
                autoComplete="false"
                title="Sex"
                placeholder="Enter other sex..."
              ></input>
          <button>Change</button>
          </label>
        </form>
        </div>

        <p style={{ color: 'gray', fontSize: '18px', fontWeight: '600' }}>Age</p>       
        <div className={ac.userInfo}>
        <form className={ac.fise} >    
          <label className={ac.lab}>

              <input
                value = {age}
                className={ac.infoInput}
                type="text"
                onChange={handleAge}
                autoComplete="false"
                title="Age"
                placeholder="Enter other age..."
              ></input>
          <button>Change</button>
          </label>
          </form>
        </div>

        <p style={{ color: 'gray', fontSize: '18px', fontWeight: '600' }}>Phone</p>
        <div className={ac.userInfo}>
       
          <label className={ac.lab}>
              <input
                value = {phone}
                className={ac.infoInput}
                type="text"
                onChange={handlePhone}
                autoComplete="false"
                title="Phone"
                placeholder="Enter other phone..."
              ></input>
          <button>Change</button>
          </label>
         
        </div>

        <p style={{ color: 'gray', fontSize: '18px', fontWeight: '600' }}>Email</p>
        <div className={ac.userInfo}>

        <p style={{ color: 'white', fontSize: '24px', fontWeight: '600' }}>{selectorSingInSlice.singInId ? selectorGallerySlice.users.find(element => element.uid === selectorSingInSlice.singInId).email : ''}</p>
        <p style={{ color: 'white', fontSize: '24px', fontWeight: '600' }}>{selectorSingInSlice.singInId && auth.currentUser !== null && auth.currentUser.emailVerified ? <p style={{color: 'green'}}>{'confirmed'}</p> : <p style={{color: 'orange'}}>{'not confirmed'}</p>}</p>
        {auth.currentUser !== null && !auth.currentUser.emailVerified ? <button onClick={confirmEmail}>Confirm</button> : ''}       

          <label className={ac.lab}>
              <input
                value = {email}
                className={ac.infoInput}
                type="text"
                onChange={handleEmail}
                autoComplete="false"
                title="Email"
                placeholder="Enter other email..."
              ></input>
          <button onClick={emailClick}>Change</button>
          </label>
         
        </div>

        <p style={{ color: 'gray', fontSize: '18px', fontWeight: '600' }}>Password</p>
        <div className={ac.userInfo}>

          <label className={ac.lab}>
              <input
                value = {password}
                className={ac.infoInput}
                type="password"
                onChange={handlePassword}
                autoComplete="false"
                title="Password"
                placeholder="Enter new password..."
              ></input>
          
          </label>

          <label className={ac.lab}>
              <input
                value = {passwordRepeate}
                className={ac.infoInput}
                type="password"
                onChange={handlePasswordRepeate}
                autoComplete="false"
                title="Password Repeate"
                placeholder="Repeate new password..."
              ></input>
          
          </label>

          <button onClick={passwordClick}>Change</button>
         
        </div>

        <p style={{ color: 'gray', fontSize: '18px', fontWeight: '600' }}>Delete account</p>
        <div className={ac.userInfo}>
          <button style={{width: 'fit-content'}} onClick={delAccount}>Delete only account</button>
          <button style={{width: 'fit-content'}} onClick={delAccountWithData}>Delete account whith all data</button>
        </div>

      </div>

    )
  }
  
  export default Account