import { React, useState, useEffect } from 'react';
import { useSelector } from 'react-redux/es/hooks/useSelector';
import { useDispatch } from 'react-redux';
import { change } from 'vomgallStore/gallerySlice';
import { useForm } from 'react-hook-form';

import writeUserData from 'API/writerDB';
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

    useEffect(() => {
      
      const path = `${selectorGallerySlice.users.find(element => element.uid === selectorSingInSlice.singInId).userName}/Accound/Foto`;
      // add foto element to DB
      writeUserData(
          path,
          {url: selectorGallerySlice.account.url, type: selectorGallerySlice.typeOfFile},
          null, true
        );
  
    },[selectorGallerySlice.account]);

    // see sharedLayuot.js file, row 68 
    // get actual account array and write user foto url
    useEffect(() => {

      if(selectorSingInSlice.isSingIn === true) {

        // foto URL writing to selectorItemsUrl.itemsURL with souch id
        const userFotoId = selectorGallerySlice.users.find(element => element.uid === selectorSingInSlice.singInId).uid;
        
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

    }, []);
    
    // clear storagePath
    useEffect(() => {
      if(storagePath) dispatch(change({ operation: 'changeLoadFiles', data: null }));
    }, [storagePath]);

    const {
      register,
      handleSubmit,
      formState: { errors },
    } = useForm({ mode: 'onBlur' });

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

    };

    return (

      <div className={ac.container}>

        <p>Your foto</p>

        <div className={ac.userfoto}>
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

            <img src={`${selectorGallerySlice.account.url}`} alt='user foto' style={{width: '150px', borderRadius: '8px'}}></img>

            <button className={ac.button}>Add/Change foto</button>
          </form>
        </div>
        {storagePath !== '' ? <StorageWork data={{storagePath, file, setStoragePath}}/> : ''}
      </div>

    )
  }
  
  export default Account