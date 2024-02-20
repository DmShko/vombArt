import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { ReactComponent as BackImg } from '../../../images/back-square-svgrepo-com.svg';
import { ReactComponent as BasketImg } from '../../../images/delete-2-svgrepo-com.svg';
import { ReactComponent as BackImgDarck } from '../../../images/back-square-svgrepo-com2.svg';

// import { getDatabase, ref, onValue } from 'firebase/database';
import writeUserData from 'API/writerDB';
// import pathCreator from '../../MageChat/pathCreator/pathCreator';

import me from './PersonMessageItem.module.scss'

import { change } from 'vomgallStore/gallerySlice';

const PersonMessageItem = ({ data }) => {

  const selectorGallerySlice = useSelector(state => state.gallery);
  const selectorSingInSlice = useSelector(state => state.singIn);
  // const selectorItemsUrl = useSelector(state => state.readStorage);
  // const pathSelector = useSelector(state => state.path.logicPath);

  // const [deleteToggle, setDeleteToggle] = useState(false);

  const dispatch = useDispatch();

  const answer = data.answerStatus;

  const answerButtonHandle = () => {

    dispatch(change({ operation: 'updateAnswerId', data: data.id }));

  };

  const delMessage = () => {

    dispatch(change({ operation: 'deletePersonalMessagesBuffer', data: data.id, userArray: selectorGallerySlice.selectedPerson,}));
    
    const myPath = `${selectorGallerySlice.users.find(element => element.uid === selectorSingInSlice.singInId).userName}/personalChat/${selectorGallerySlice.selectedPerson}/`;
    const personPath = `${selectorGallerySlice.users.find(element => element.uid === selectorGallerySlice.selectedPerson).userName}/personalChat/${selectorSingInSlice.singInId}/`;
    
    // delete message from DB current user (write 'null')
    writeUserData(
      `${myPath}${data.id}`,
      null,
      selectorGallerySlice.date, true
    );

    // delete message from DB companion (write 'null')
    writeUserData(
        `${personPath}${data.id}`,
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

              {selectorSingInSlice.singInId ? selectorGallerySlice.personalMessagesBuffer[selectorGallerySlice.selectedPerson].find(element => element.id === data.id).name 
              === selectorGallerySlice.users.find(element => element.uid === selectorSingInSlice.singInId).userName
              ? <BasketImg className={me.svg} style={selectorGallerySlice.dayNight ? {width: '22px', height: '22px', backgroundColor: 'rgb(122, 152, 206)', borderRadius: '6px',} : 
              {width: '22px', height: '22px', backgroundColor: 'white', borderRadius: '6px',}} onClick={delMessage}/> : '' : ''}
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

              {selectorSingInSlice.singInId ? selectorGallerySlice.personalMessagesBuffer[selectorGallerySlice.selectedPerson].find(element => element.id === data.id).name 
              === selectorGallerySlice.users.find(element => element.uid === selectorSingInSlice.singInId).userName
              ? <BasketImg className={me.svg} style={selectorGallerySlice.dayNight ? {width: '22px', height: '22px', backgroundColor: 'rgb(122, 152, 206)', borderRadius: '6px',} :
              {width: '22px', height: '22px', backgroundColor: 'white', borderRadius: '6px',}}  onClick={delMessage}/> : '' : ''
              }
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

export default PersonMessageItem