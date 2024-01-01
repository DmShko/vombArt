import { React, useState, useEffect } from 'react';
import { useSelector } from 'react-redux/es/hooks/useSelector';
import { useDispatch } from 'react-redux';
import { change } from 'vomgallStore/gallerySlice';
import { useForm } from 'react-hook-form';

import writeUserData from 'API/writerDB';
import { changeReadStorage } from 'vomgallStore/readSlice'
import StorageWork from 'components/StorageWork/StorageWork';
import { getDatabase, ref, onValue } from 'firebase/database';

import ac from './Account.module.scss';

const Account = () => {

    const selectorGallerySlice = useSelector(state => state.gallery);
    const selectorSingInSlice = useSelector(state => state.singIn);
    const selectorItemsUrl = useSelector(state => state.readStorage);

    const dispatch = useDispatch();

    const [file, setFile] = useState();
    const [storagePath, setStoragePath] = useState('');
    const [name, setName] = useState('');
    const [sex, setSex] = useState('');
    const [age, setAge] = useState('');
    const [phone, setPhone] = useState('');

    const {
      register,
      handleSubmit,
      formState: { errors },
    } = useForm({ mode: 'onBlur' });

    // clear user foro url from itemsURL if load is completed
    useEffect(() => {
      
      if(storagePath === '') {
      
        dispatch(changeReadStorage({operation: `clearUserFotoElement`, data: {id: selectorSingInSlice.singInId}}));

      }
  
    },[storagePath]);

    // update account array in DB
    useEffect(() => {
      
      const path = `${selectorGallerySlice.users.find(element => element.uid === selectorSingInSlice.singInId).userName}/Accound/Foto`;
      
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
       const pathDB = `${selectorGallerySlice.users.find(element => element.uid === selectorSingInSlice.singInId).userName}/Accound/Foto`;

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

    }, [selectorSingInSlice.isSingIn]);
    
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
      
      setStoragePath(`${selectorGallerySlice.users.find(element => element.uid === selectorSingInSlice.singInId).userName}/Accound/Foto`);
      const path = `${selectorGallerySlice.users.find(element => element.uid === selectorSingInSlice.singInId).userName}/Accound/Foto`;

      // add foto element to DB
      writeUserData(
        path,
        {url: '', type: selectorGallerySlice.typeOfFile},
        null, true
      );

      dispatch(changeReadStorage({operation: `clearErrorElementId`}));
    
    };

    const handleName = () => {

    };

    const handleSex = () => {

    };

    const handleAge = () => {

    };

    const handlePhone = () => {

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
                  multiple="multiple"
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
                multiple="multiple"
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
                multiple="multiple"
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
                multiple="multiple"
                placeholder="Enter other phone..."
              ></input>
          <button>Change</button>
          </label>
         
        </div>
        
      </div>

    )
  }
  
  export default Account