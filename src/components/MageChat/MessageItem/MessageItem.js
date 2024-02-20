import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { ReactComponent as BackImg } from '../../../images/back-square-svgrepo-com.svg';
import { ReactComponent as BasketImg } from '../../../images/delete-2-svgrepo-com.svg';
import { ReactComponent as BackImgDarck } from '../../../images/back-square-svgrepo-com2.svg';

import { getDatabase, ref, onValue } from 'firebase/database';
import writeUserData from 'API/writerDB';
import pathCreator from '../../MageChat/pathCreator/pathCreator';

import me from './MessageItem.module.scss'

import { change } from 'vomgallStore/gallerySlice';

const MessageItem = ({ data }) => {

  const selectorGallerySlice = useSelector(state => state.gallery);
  const selectorSingInSlice = useSelector(state => state.singIn);
  const selectorItemsUrl = useSelector(state => state.readStorage);
  const pathSelector = useSelector(state => state.path.logicPath);

  // const [deleteToggle, setDeleteToggle] = useState(false);

  const dispatch = useDispatch();

  const answer = data.answerStatus;

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
       
     });

   };  
   // eslint-disable-next-line
  },[selectorSingInSlice.isSingIn, selectorItemsUrl.itemsURL]);

  const answerButtonHandle = () => {

    dispatch(change({ operation: 'updateAnswerId', data: data.id }));

  };

  const delMessage = () => {
    
    dispatch(change({ operation: 'deleteMessage', data: data.id }));
    
    const path = pathCreator({pathSelector, section: 'chats', contents: 'messages', write: false, users: selectorGallerySlice.users, userIsSingInId: selectorSingInSlice.singInId});
   
    // delete message from DB (write 'null')
    writeUserData(
      `${path}${data.id}`,
      null,
      selectorGallerySlice.date, true
    );

  };

  const delItemMessage = () => {
    dispatch(change({ operation: 'deleteItemsMessage', data: data.id }));

    const path = pathCreator({pathSelector, section: 'chats', contents: `elements/messages/${selectorGallerySlice.currentItemId}`, write: false, users: selectorGallerySlice.users, userIsSingInId: selectorSingInSlice.singInId});

    // delete message from DB (write 'null')
    writeUserData(
      `${path}${data.id}`,
      null,
      selectorGallerySlice.date, true
    );

  };

  return (
     
      <div className={me.container} id={data.id}>
        {!answer ? 
        <>
          <div className={me.title}>
            {selectorSingInSlice.isSingIn ? <img src={`${selectorGallerySlice.users
              .find(element => element.userName === data.name).urlFoto}`} alt='user foto' style={{width: '45px', height: '45px', borderRadius: '50px'}}></img> : ''}
            <div className={me.stamp}>
              <p>{data.name}</p>
              <p style={{ color: 'blue', fontSize: '12px',}}>{data.date}</p>
              <p style={{ color: 'blue',fontSize: '12px', }}>{`${data.time}:${data.second}`}</p>
            </div>
            
            <div className={me.operation}>
             {selectorGallerySlice.dayNight ? <BackImgDarck className={me.svg} style={{width: '25px', height: '25px',}} onClick={answerButtonHandle}/> : 
             <BackImg className={me.svg} style={{width: '25px', height: '25px',}} onClick={answerButtonHandle}/>}

              {selectorSingInSlice.singInId ? selectorGallerySlice.currentItemId === '' ? selectorGallerySlice.messagesBuffer.find(element => element.id === data.id).name 
              === selectorGallerySlice.users.find(element => element.uid === selectorSingInSlice.singInId).userName
              ? <BasketImg className={me.svg} style={selectorGallerySlice.dayNight ? {width: '22px', height: '22px', backgroundColor: 'rgb(122, 152, 206)', borderRadius: '6px',} : 
              {width: '22px', height: '22px', backgroundColor: 'white', borderRadius: '6px',}} onClick={delMessage}/> : '' :
              selectorGallerySlice.itemsMessagesBuffer.find(element => element.id === data.id).name 
              === selectorGallerySlice.users.find(element => element.uid === selectorSingInSlice.singInId).userName
              ? <BasketImg className={me.svg} style={selectorGallerySlice.dayNight ? {width: '22px', height: '22px', backgroundColor: 'rgb(122, 152, 206)', borderRadius: '6px',} :
              {width: '22px', height: '22px', backgroundColor: 'white', borderRadius: '6px',}}  onClick={delItemMessage}/> : '' : ''}
            </div>
            
          </div>
          <p className={me.message}>{data.message}</p>
        </> : 
        <>
          <div className={me.title}>
          {selectorSingInSlice.isSingIn ? 
            <img src={`${selectorGallerySlice.users.find(element => element.userName === data.name).urlFoto}`} 
            alt='user foto' style={{width: '45px', height: '45px', borderRadius: '50px'}}></img> : ''}
            <div className={me.stamp}>
              <p>{data.name}</p>
              <p style={{ color: 'blue', fontSize: '12px',}}>{data.date}</p>
              <p style={{ color: 'blue',fontSize: '12px', }}>{`${data.time}:${data.second}`}</p>
            </div>

            <div className={me.operation}>
              {selectorGallerySlice.dayNight ? <BackImgDarck className={me.svg} style={{width: '25px', height: '25px',}} onClick={answerButtonHandle}/> : 
              <BackImg className={me.svg} style={{width: '25px', height: '25px',}} onClick={answerButtonHandle}/>}

              {selectorSingInSlice.singInId ? selectorGallerySlice.currentItemId === '' ? selectorGallerySlice.messagesBuffer.find(element => element.id === data.id).name 
              === selectorGallerySlice.users.find(element => element.uid === selectorSingInSlice.singInId).userName
              ? <BasketImg className={me.svg} style={selectorGallerySlice.dayNight ? {width: '22px', height: '22px', backgroundColor: 'rgb(122, 152, 206)', borderRadius: '6px',} :
              {width: '22px', height: '22px', backgroundColor: 'white', borderRadius: '6px',}}  onClick={delMessage}/> : '' :
              selectorGallerySlice.itemsMessagesBuffer.find(element => element.id === data.id).name 
              === selectorGallerySlice.users.find(element => element.uid === selectorSingInSlice.singInId).userName
              ? <BasketImg className={me.svg} style={selectorGallerySlice.dayNight ? {width: '22px', height: '22px', backgroundColor: 'rgb(122, 152, 206)', borderRadius: '6px',} :
              {width: '22px', height: '22px', backgroundColor: 'white', borderRadius: '6px',}}  onClick={delItemMessage}/> : '' : ''}
            </div>
            
          </div>
         
          <div className={me.answerStamp}>
            <p className={me.answerStyle}  style={{fontSize: '14px',}}>{data.nameAnswer}</p>
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