import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { ReactComponent as BackImg } from '../../../images/back-square-svgrepo-com.svg';

import { getDatabase, ref, onValue } from 'firebase/database';

import me from './MessageItem.module.scss'

import { change } from 'vomgallStore/gallerySlice';

const MessageItem = ({ data }) => {

  const selectorGallerySlice = useSelector(state => state.gallery);
  const selectorSingInSlice = useSelector(state => state.singIn);
  const selectorItemsUrl = useSelector(state => state.readStorage);

  const dispatch = useDispatch();

  const answer = data.answerStatus;

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
       
     });

   };  
  },[selectorSingInSlice.isSingIn, selectorItemsUrl.itemsURL]);

  const answerButtonHandle = () => {

    dispatch(change({ operation: 'updateAnswerId', data: data.id }));

  };

  return (
     
      <div className={me.container}>
        {!answer ? 
        <>
          <div className={me.title}>
            {selectorSingInSlice.isSingIn && selectorGallerySlice.users.find(element => element.uid === selectorSingInSlice.singInId).userName === data.name ? <img src={`${selectorGallerySlice.account.url}`} alt='user foto' style={{width: '45px', height: '45px', borderRadius: '50px'}}></img> : ''}
            <div className={me.stamp}>
              <p>{data.name}</p>
              <p style={{ color: 'blue', fontSize: '14px',}}>{data.date}</p>
              <p style={{ color: 'blue',fontSize: '14px', }}>{`${data.time}:${data.second}`}</p>
            </div>
            <BackImg className={me.svg} style={{width: '25px', height: '25px',}} onClick={answerButtonHandle}/>
          </div>
          <p>{data.message}</p>
        </> : 
        <>
          <div className={me.title}>
          {selectorSingInSlice.isSingIn && selectorGallerySlice.users.find(element => element.uid === selectorSingInSlice.singInId).userName === data.name ? <img src={`${selectorGallerySlice.account.url}`} alt='user foto' style={{width: '45px', height: '45px', borderRadius: '50px'}}></img> : ''}
            <div className={me.stamp}>
              <p>{data.name}</p>
              <p style={{ color: 'blue', fontSize: '14px',}}>{data.date}</p>
              <p style={{ color: 'blue',fontSize: '14px', }}>{`${data.time}:${data.second}`}</p>
            </div>
            <BackImg className={me.svg} style={{width: '25px', height: '25px',}} onClick={answerButtonHandle}/>
          </div>
         
          <div className={me.answerStamp}>
            <p className={me.answerStyle}>{data.nameAnswer}</p>
            <p className={me.answerStyle}>{data.dateAnswer}</p>
            <div className={me.time}>
              <p className={me.answerStyle}>{data.timeAnswer}</p>
              <p className={me.answerStyle}>:{data.secondsAnswer}</p>
            </div>
          </div>
          <p className={me.answer}>...{data.messageAnswer}</p>
          <p className={me.newMessage}>{data.message}</p>
        </>}
      </div>
    
  );
};

export default MessageItem