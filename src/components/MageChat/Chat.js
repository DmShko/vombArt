import { useState, useEffect, useRef} from 'react';
import { useSelector, useDispatch} from "react-redux"
import { useForm } from 'react-hook-form';
import useSound from 'use-sound';

import writeUserData from 'API/writerDB';
import pathCreator from './pathCreator/pathCreator';
import PersonMessageItem from './PersonMessageItem/PersonMessageItem';
import MessageItem from './MessageItem/MessageItem';
import ScrollDown from './ScrollDown/ScrollDown';
import MessageCleaner from 'components/MageChat/MessageCleaner/MessageCleaner';
import Notiflix from 'notiflix';

import { nanoid } from "nanoid";

import { ReactComponent as EmptyImg } from '../../images/empty-white-box-svgrepo-com.svg';
import { ReactComponent as SendImg } from '../../images/send-alt-2-svgrepo-com.svg';
import { ReactComponent as TriangleUpImg } from '../../images/triangle-up-svgrepo-com.svg';
import { ReactComponent as TriangleDownImg } from '../../images/triangle-down-svgrepo-com.svg';

import ma from './Chat.module.scss'
import { change } from 'vomgallStore/gallerySlice';
import boopSfx from '../../sounds/message-incoming-132126.mp3';

const MageChat = () => {

  const selectorGallerySlice = useSelector(state => state.gallery);
  const selectorSingInSlice = useSelector(state => state.singIn);
  const pathSelector = useSelector(state => state.path.logicPath);
  const dispatch = useDispatch();

  const messageBlock = useRef();

  const [timeValue, setTimeValue] = useState({ time: new Date() });
  const [newDateObj, setNewDateObj] = useState({});
  const [message, setMessage] = useState('');
  const [searchName, setSearchName] = useState('');
  const [searchDate, setSearchDate] = useState('');
  const [searchText, setSearchText] = useState(''); 
  const [searchMenuToggle, setSearchMenuToggle] = useState(false);
  const [play] = useSound(boopSfx);

  const { register, handleSubmit, formState:{errors}, reset} = useForm({mode: 'onBlur'});

  useEffect(() => {

    // first fill mesBuffLength and itemMesBuffLength
    if(selectorGallerySlice.messagesBuffer !== undefined && selectorGallerySlice.itemsMessagesBuffer !== undefined) {
      dispatch(change({ operation: 'updateMesBuffLength', data: selectorGallerySlice.messagesBuffer.length }));
      dispatch(change({ operation: 'updateItemMesBuffLength', data: selectorGallerySlice.itemsMessagesBuffer.length }));
    }

  },[]);

  useEffect(() => {
    // info is 'green' only if 'messagesBuffer' is different without 'mesBuffLength'
    if(selectorGallerySlice.messagesBuffer !== undefined && messageBlock.current !== null){

      if(selectorGallerySlice.mesBuffLength !== selectorGallerySlice.messagesBuffer.length && selectorGallerySlice.messagesBuffer.length != 0
        && selectorGallerySlice.messagesBuffer.length * messageBlock.current.offsetHeight >= 200) {

        dispatch(change({ operation: 'updateScrollIsEnd', data: false }));
       
        play();
      }
    }

  },[selectorGallerySlice.messagesBuffer]);

  useEffect(() => { 
    
    // info is 'green' only if 'messagesBuffer' is different without 'mesBuffLength'
    if(selectorGallerySlice.itemsMessagesBuffer !== undefined && messageBlock.current !== null){
    
      if(selectorGallerySlice.itemMesBuffLength !== selectorGallerySlice.itemsMessagesBuffer.length && selectorGallerySlice.itemsMessagesBuffer.length !== 0) {
         
        dispatch(change({ operation: 'updateScrollIsEnd', data: false }));

        play();

      } 
    }

  },[selectorGallerySlice.itemsMessagesBuffer]);

  useEffect(() => {

    // clear item answer status, when modal open
    dispatch(change({ operation: 'updateAnswerId', data: '' }));

  },[selectorGallerySlice.currentItemId]);


  // sort messages function
  const sortMessages = (data) => {

    if(data !== null && data !== undefined){

      // unsorted put of input data
      let unSortedMessages = data;
      // buffer for sorted message
      let sortedMessages = [];

      let freshMessage = data[0];

      for(let iteration = 0; iteration < data.length; iteration += 1) {
        
        for(let current = 0; current < unSortedMessages.length; current += 1) {

          if(Number(freshMessage.date.split('/')[2]) < Number(unSortedMessages[current].date.split('/')[2])) {
            freshMessage = unSortedMessages[current];
            continue;
          }

          if(Number(freshMessage.date.split('/')[2]) === Number(unSortedMessages[current].date.split('/')[2])) {

            if(Number(freshMessage.date.split('/')[1]) < Number(unSortedMessages[current].date.split('/')[1])) {
              freshMessage = unSortedMessages[current];
              continue;
            }

            if(Number(freshMessage.date.split('/')[1]) === Number(unSortedMessages[current].date.split('/')[1])) {

              // next element fresh fresh if his data > (compare with current) etc...
              if(Number(freshMessage.date.split('/')[0]) < Number(unSortedMessages[current].date.split('/')[0])) {
                freshMessage = unSortedMessages[current];
                continue;
              };

              if(Number(freshMessage.date.split('/')[0]) === Number(unSortedMessages[current].date.split('/')[0])) {
                
                if(Number(freshMessage.time.split(':')[0]) < Number(unSortedMessages[current].time.split(':')[0])) {
                  freshMessage = unSortedMessages[current];
                  continue;
                }

                if(Number(freshMessage.time.split(':')[0]) === Number(unSortedMessages[current].time.split(':')[0])) {
                  
                  if(Number(freshMessage.time.split(':')[1]) < Number(unSortedMessages[current].time.split(':')[1])) {
                    freshMessage = unSortedMessages[current];
                    continue;
                  }
                  if(Number(freshMessage.time.split(':')[1]) === Number(unSortedMessages[current].time.split(':')[1])) {
                
                    if(Number(freshMessage.second) < Number(unSortedMessages[current].second)) {
                      
                      freshMessage = unSortedMessages[current];
                      continue;
                    }
                  }
                  continue;
                };
              }


            }
          }
        }
      // write new fresh element to sort array
      sortedMessages = [...sortedMessages, freshMessage];

      // rest of data it's new unsort array
      unSortedMessages = unSortedMessages.filter(element => element.id !== freshMessage.id);

      // new fresh element it's first element of unsort array
      freshMessage = unSortedMessages[0];
      }
      
      // the latest message should be at the bottom
      return sortedMessages.reverse();
    }
  };

  function tick() {
    
        setTimeValue({
          time: new Date()
        });
        
        const dateHours =  timeValue.time.getHours().toString().length === 1 ? "0" +  timeValue.time.getHours().toString() :  timeValue.time.getHours().toString();
        const dateMinutes =  timeValue.time.getMinutes().toString().length === 1 ? "0" +  timeValue.time.getMinutes().toString() : timeValue.time.getMinutes().toString();
        const dateSeconds =  timeValue.time.getSeconds().toString().length === 1 ? "0" +  timeValue.time.getSeconds().toString() : timeValue.time.getSeconds().toString();
  
        // get date
        const dateDay =  timeValue.time.getDate().toString().length === 1 ? "0" +  timeValue.time.getDate().toString() :  timeValue.time.getDate().toString();
        const dateMonth =  timeValue.time.getMonth().toString().length === 1 ? "0" + (timeValue.time.getMonth() + 1).toString() : (timeValue.time.getMonth() + 1).toString();
        
        const timedata = dateHours + ":" + dateMinutes;
        const datedata = dateDay + "/" + dateMonth;
        const yeardata =  timeValue.time.getFullYear();
  
        return {timedata, datedata, yeardata, dateSeconds};
        // setNewDateObj({ timedata, datedata, yeardata, dateSeconds });
        // dispatch(change({ operation: 'changeDate', data: {timedata, datedata, yeardata, dateSeconds} }));
  };

  // retun true if element contain true
  const findProperty = data => {
    for (const key in data) {
      if (data[key] === true) {
        return true;
      }
    }
  };

  const addMessage = (_,evt) => {

    evt.preventDefault();

    // check not personal message
    if(selectorGallerySlice.modalPersonalIsOpen === false) {
      // check selected arts and style
      if (findProperty(pathSelector.arts) && findProperty(pathSelector.style)) {

        // simple mode
        if(selectorGallerySlice.answerId === '') {
          
          // create chats tree
          if(selectorGallerySlice.currentItemId === '') {
        
            const path = pathCreator({pathSelector, section: 'chats', contents: 'messages', write: true, users: selectorGallerySlice.users, userIsSingInId: selectorSingInSlice.singInId});

            // to database
            writeUserData(path, {name: `${selectorGallerySlice.users.find(element => element.uid === selectorSingInSlice.singInId).userName}`, message: message,}, tick(), false);

          } else {
            const path = pathCreator({pathSelector, section: 'chats', contents: `elements/messages/${selectorGallerySlice.currentItemId}`, write: true, users: selectorGallerySlice.users, userIsSingInId: selectorSingInSlice.singInId});

            // to database
            writeUserData(path, {name: `${selectorGallerySlice.users.find(element => element.uid === selectorSingInSlice.singInId).userName}`, message: message,}, tick(), false);
            
          } 
        } else {
          // answer mode
          // create chats tree
          if(selectorGallerySlice.currentItemId === '') {
            const path = pathCreator({pathSelector, section: 'chats', contents: 'messages', write: true, users: selectorGallerySlice.users, userIsSingInId: selectorSingInSlice.singInId});

            // to database
            writeUserData(path, {name: `${selectorGallerySlice.users.find(element => element.uid === selectorSingInSlice.singInId).userName}`, 
            messageAnswer: selectorGallerySlice.messagesBuffer.find(element => element.id === selectorGallerySlice.answerId).message, 
            dateAnswer: selectorGallerySlice.messagesBuffer.find(element => element.id === selectorGallerySlice.answerId).date, 
            timeAnswer: selectorGallerySlice.messagesBuffer.find(element => element.id === selectorGallerySlice.answerId).time, 
            nameAnswer: selectorGallerySlice.messagesBuffer.find(element => element.id === selectorGallerySlice.answerId).name,
            secondsAnswer: selectorGallerySlice.messagesBuffer.find(element => element.id === selectorGallerySlice.answerId).second, message: message, answerStatus: true}, tick(), false);

          } else {
            const path = pathCreator({pathSelector, section: 'chats', contents: `elements/messages/${selectorGallerySlice.currentItemId}`, write: true, users: selectorGallerySlice.users, userIsSingInId: selectorSingInSlice.singInId});

            // to database
            writeUserData(path, {name: `${selectorGallerySlice.users.find(element => element.uid === selectorSingInSlice.singInId).userName}`, 
            messageAnswer: selectorGallerySlice.itemsMessagesBuffer.find(element => element.id === selectorGallerySlice.answerId).message,
            dateAnswer: selectorGallerySlice.itemsMessagesBuffer.find(element => element.id === selectorGallerySlice.answerId).date, 
            timeAnswer: selectorGallerySlice.itemsMessagesBuffer.find(element => element.id === selectorGallerySlice.answerId).time, 
            nameAnswer: selectorGallerySlice.itemsMessagesBuffer.find(element => element.id === selectorGallerySlice.answerId).name,
            secondsAnswer: selectorGallerySlice.itemsMessagesBuffer.find(element => element.id === selectorGallerySlice.answerId).second, message: message, answerStatus: true}, tick(), false);
          } 

      
          dispatch(change({ operation: 'updateAnswerId', data: '' }));
        }     

        reset({Message: '', });
    } else {
      Notiflix.Notify.info('Style not selected', {width: '450px', position: 'center-top', fontSize: '24px',});
    }
    } else {

      // simple mode
      if(selectorGallerySlice.answerId === '') {

        const messageId = nanoid();
        // if message is personal
        const myPath = `${selectorGallerySlice.users.find(element => element.uid === selectorSingInSlice.singInId).userName}/personalChat/${selectorGallerySlice.selectedPerson}/${messageId}`;
        const personPath = `${selectorGallerySlice.users.find(element => element.uid === selectorGallerySlice.selectedPerson).userName}/personalChat/${selectorSingInSlice.singInId}/${messageId}`;
        // to database
        // write to current user
        writeUserData(myPath, {name: `${selectorGallerySlice.users.find(element => element.uid === selectorSingInSlice.singInId).userName}`, message: message, unread: false,}, tick(), false);
        // write to person
        writeUserData(personPath, {name: `${selectorGallerySlice.users.find(element => element.uid === selectorSingInSlice.singInId).userName}`, message: message, unread: true,}, tick(), false);

        reset({Message: '', });

      } else {
        const messageId = nanoid();
        // if message is personal
        const myPath = `${selectorGallerySlice.users.find(element => element.uid === selectorSingInSlice.singInId).userName}/personalChat/${selectorGallerySlice.selectedPerson}/${messageId}`;
        const personPath = `${selectorGallerySlice.users.find(element => element.uid === selectorGallerySlice.selectedPerson).userName}/personalChat/${selectorSingInSlice.singInId}/${messageId}`;
        // to database
       
        // write to current user
        writeUserData(myPath, {name: `${selectorGallerySlice.users.find(element => element.uid === selectorSingInSlice.singInId).userName}`
        , 
            messageAnswer: selectorGallerySlice.personalMessagesBuffer[selectorGallerySlice.selectedPerson].find(element => element.id === selectorGallerySlice.answerId).message, 
            dateAnswer: selectorGallerySlice.personalMessagesBuffer[selectorGallerySlice.selectedPerson].find(element => element.id === selectorGallerySlice.answerId).date, 
            timeAnswer: selectorGallerySlice.personalMessagesBuffer[selectorGallerySlice.selectedPerson].find(element => element.id === selectorGallerySlice.answerId).time, 
            nameAnswer: selectorGallerySlice.personalMessagesBuffer[selectorGallerySlice.selectedPerson].find(element => element.id === selectorGallerySlice.answerId).name,
            secondsAnswer: selectorGallerySlice.personalMessagesBuffer[selectorGallerySlice.selectedPerson].find(element => element.id === selectorGallerySlice.answerId).second, 
            message: message, answerStatus: true, unread: true,}, tick(), false);
        // write to person
        writeUserData(personPath, {name: `${selectorGallerySlice.users.find(element => element.uid === selectorSingInSlice.singInId).userName}`,
            messageAnswer: selectorGallerySlice.personalMessagesBuffer[selectorGallerySlice.selectedPerson].find(element => element.id === selectorGallerySlice.answerId).message, 
            dateAnswer: selectorGallerySlice.personalMessagesBuffer[selectorGallerySlice.selectedPerson].find(element => element.id === selectorGallerySlice.answerId).date, 
            timeAnswer: selectorGallerySlice.personalMessagesBuffer[selectorGallerySlice.selectedPerson].find(element => element.id === selectorGallerySlice.answerId).time, 
            nameAnswer: selectorGallerySlice.personalMessagesBuffer[selectorGallerySlice.selectedPerson].find(element => element.id === selectorGallerySlice.answerId).name,
            secondsAnswer: selectorGallerySlice.personalMessagesBuffer[selectorGallerySlice.selectedPerson].find(element => element.id === selectorGallerySlice.answerId).second,
            message: message, answerStatus: true, unread: true,}, tick(), false);

        dispatch(change({ operation: 'updateAnswerId', data: '' }));

        reset({Message: '', });
      }
    }
  };

  const inputChange = (evt) => {
    setMessage(evt.target.value);
  };

  const inputSearch = (evt) => {
    if(evt.target.name === 'SearchName') setSearchName(evt.target.value);
    if(evt.target.name === 'SearchDate') setSearchDate(evt.target.value);
    if(evt.target.name === 'SearchText') setSearchText(evt.target.value);
  };

  const searchMenuHandle = () => {
    setSearchMenuToggle(value => !value);

    if(searchMenuToggle === true) {
      setSearchName('');
      setSearchDate('');
      setSearchText('');
    } 
  };

  const cancelHandle = () => {
   
    dispatch(change({ operation: 'updateAnswerId', data: '' }));

  };

  const scrollHandler = () => {
    
    messageBlock.current.scrollIntoView({ behavior: "smooth", block: "center", inline: "nearest" });
  };

  const scrollEnd = (evt) => {
    
    dispatch(change({ operation: 'updateScrollIsEnd', data: false }));

    // detect scroll to end
    if(evt.target.scrollHeight - evt.target.scrollTop -  evt.target.clientHeight === 0){
      
      dispatch(change({ operation: 'updateScrollIsEnd', data: true }));
      dispatch(change({ operation: 'updateItemMesBuffLength', data: selectorGallerySlice.itemsMessagesBuffer.length }));
      dispatch(change({ operation: 'updateMesBuffLength', data: selectorGallerySlice.messagesBuffer.length }));
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
    <div className={ma.container} style={selectorGallerySlice.dayNight ? {backgroundColor: '#384a83',} : {backgroundColor: ''}}>

        <MessageCleaner />

        <form onSubmit={handleSubmit(addMessage)}>

            <div className={ma.messagertitleblock}>
              <p className={ma.messagesCounter} style={selectorGallerySlice.dayNight ? {color: 'rgb(122, 152, 206)', fontWeight: '600'} : {color: 'white', fontWeight: '600'}}>
                {selectorGallerySlice.settings.languageSelector === 'English' ? `${selectorGallerySlice.selectedPerson === '' ? selectorGallerySlice.currentItemId === '' ? selectorGallerySlice.messagesBuffer.length : selectorGallerySlice.itemsMessagesBuffer.length : Object.keys(selectorGallerySlice.personalMessagesBuffer).length !== 0 && selectorGallerySlice.personalMessagesBuffer[selectorGallerySlice.selectedPerson] ? selectorGallerySlice.personalMessagesBuffer[selectorGallerySlice.selectedPerson].length : 'No'} messages` : 
                selectorGallerySlice.settings.languageSelector === 'Українська' ? `${selectorGallerySlice.selectedPerson === '' ? selectorGallerySlice.currentItemId === '' ? selectorGallerySlice.messagesBuffer.length : selectorGallerySlice.itemsMessagesBuffer.length : Object.keys(selectorGallerySlice.personalMessagesBuffer).length !== 0 && selectorGallerySlice.personalMessagesBuffer[selectorGallerySlice.selectedPerson] ? selectorGallerySlice.personalMessagesBuffer[selectorGallerySlice.selectedPerson].length : 'No'} повідомлень` : 
                selectorGallerySlice.settings.languageSelector === 'Polska' ? `${selectorGallerySlice.selectedPerson === '' ? selectorGallerySlice.currentItemId === '' ? selectorGallerySlice.messagesBuffer.length : selectorGallerySlice.itemsMessagesBuffer.length : Object.keys(selectorGallerySlice.personalMessagesBuffer).length !== 0 && selectorGallerySlice.personalMessagesBuffer[selectorGallerySlice.selectedPerson] ? selectorGallerySlice.personalMessagesBuffer[selectorGallerySlice.selectedPerson].length : 'No'} wiadomości` : 
                `${selectorGallerySlice.selectedPerson === '' ? selectorGallerySlice.currentItemId === '' 
                ? selectorGallerySlice.messagesBuffer.length : selectorGallerySlice.itemsMessagesBuffer.length : Object.keys(selectorGallerySlice.personalMessagesBuffer).length !== 0 ? selectorGallerySlice.personalMessagesBuffer[selectorGallerySlice.selectedPerson].length : '0'} messages`}</p>

              <p style={{color: 'rgb(122, 152, 206)',}}>Messages older than 10 days are automatically deleted.</p> 
            </div>

            <div className={ma.area} wrap='soft' onScroll={scrollEnd} style={selectorGallerySlice.dayNight ? {borderColor: 'rgb(122, 152, 206)',} : {borderColor: 'white',}}>

              {!selectorGallerySlice.modalPersonalIsOpen && selectorGallerySlice.currentItemId === '' && selectorGallerySlice.messagesBuffer.length !== 0 ? <ScrollDown data={scrollHandler} scrollDownDetect={selectorGallerySlice.scrollIsEnd} /> : ''}

                <ul className={ma.list}>
                    {
                      !selectorGallerySlice.modalPersonalIsOpen ? selectorGallerySlice.currentItemId === '' ? selectorGallerySlice.messagesBuffer !== null && selectorGallerySlice.messagesBuffer !== undefined ? sortMessages(selectorGallerySlice.messagesBuffer).map(value => 
                      { return value.message.includes(searchText) && value.date.includes(searchDate) && value.name.includes(searchName) ? <li className={ma.item} ref={messageBlock} key={value.id} style={value.id === selectorGallerySlice.answerId ? {boxShadow: '0 2px 2px 0.5px lightcoral'} : {boxShadow: 'none'}}><MessageItem data={value} /></li> : ''}) : <EmptyImg style={{width: '100px', height: '100px',}} /> : 
                       selectorGallerySlice.itemsMessagesBuffer !== null && selectorGallerySlice.itemsMessagesBuffer !== undefined ? sortMessages(selectorGallerySlice.itemsMessagesBuffer).map(value => 
                      { return value.message.includes(searchText) && value.date.includes(searchDate) && value.name.includes(searchName) ? <li className={ma.item} ref={messageBlock} key={value.id} style={value.id === selectorGallerySlice.answerId ? {boxShadow: '0 2px 2px 0.5px lightcoral'} : {boxShadow: 'none'}}><MessageItem data={value} /></li> : ''}) : <EmptyImg style={{width: '100px', height: '100px',}} /> : 
                      
                      selectorGallerySlice.selectedPerson !== '' && Object.keys(selectorGallerySlice.personalMessagesBuffer).length !== 0 && selectorGallerySlice.personalMessagesBuffer !== null && selectorGallerySlice.personalMessagesBuffer !== undefined && selectorGallerySlice.personalMessagesBuffer[selectorGallerySlice.selectedPerson] ? sortMessages(selectorGallerySlice.personalMessagesBuffer[selectorGallerySlice.selectedPerson]).map(value => 
                      { return value.message.includes(searchText) && value.date.includes(searchDate) && value.name.includes(searchName) ? <li className={ma.item} key={value.id}><PersonMessageItem data={value} /></li> : ''}) : <EmptyImg style={{width: '100px', height: '100px',}} />
                    }
                </ul>

            </div>
         
                   
            <div className={ma.field}>
                
                <h1 className={ma.title}>
                {selectorGallerySlice.settings.languageSelector === 'English' ? <p>Messanger</p> : 
                  selectorGallerySlice.settings.languageSelector === 'Українська' ? <p>Посланець</p> : 
                  selectorGallerySlice.settings.languageSelector === 'Polska' ? <p>Posłaniec</p> : <p>Messanger</p>}
                </h1>

                {selectorGallerySlice.answerId !== '' ? selectorGallerySlice.selectedPerson === '' ?
                  selectorGallerySlice.currentItemId === '' ? 
                  <div className={ma.answerStamp}>

                    <p className={ma.answerStampTitle}>
                    {selectorGallerySlice.settings.languageSelector === 'English' ? <p>Reply to message:</p> : 
                      selectorGallerySlice.settings.languageSelector === 'Українська' ? <p>Відповідь на повідомлення:</p> : 
                      selectorGallerySlice.settings.languageSelector === 'Polska' ? <p>Odpowiedz na wiadomość:</p> : <p>Reply to message:</p>}
                    </p>

                    <div className={ma.answerTitle}>
                      <p className={ma.answerStyle}>{selectorGallerySlice.messagesBuffer.find(element => element.id === selectorGallerySlice.answerId).name}</p>
                      <p className={ma.answerStyle}>{selectorGallerySlice.messagesBuffer.find(element => element.id === selectorGallerySlice.answerId).date}</p>
                      <div className={ma.time}>
                        <p className={ma.answerStyle}>{selectorGallerySlice.messagesBuffer.find(element => element.id === selectorGallerySlice.answerId).time}</p>
                        <p className={ma.answerStyle}>:{selectorGallerySlice.messagesBuffer.find(element => element.id === selectorGallerySlice.answerId).second}</p>
                      </div>
                    </div>
                    
                    <p className={ma.answer}>...{selectorGallerySlice.messagesBuffer.find(element => element.id === selectorGallerySlice.answerId).message}</p>
                    <button className={ma.searchbutton} onClick={cancelHandle}>
                    {selectorGallerySlice.settings.languageSelector === 'English' ? <p>Cancel</p> : 
                      selectorGallerySlice.settings.languageSelector === 'Українська' ? <p>Закрити</p> : 
                      selectorGallerySlice.settings.languageSelector === 'Polska' ? <p>Zamknąć</p> : <p>Cancel</p>}
                    </button>
                  </div> :
                  <div className={ma.answerStamp}> 
             
                    <p className={ma.answerStampTitle}>
                    {selectorGallerySlice.settings.languageSelector === 'English' ? <p>Reply to message:</p> : 
                      selectorGallerySlice.settings.languageSelector === 'Українська' ? <p>Відповідь на повідомлення:</p> : 
                      selectorGallerySlice.settings.languageSelector === 'Polska' ? <p>Odpowiedz na wiadomość:</p> : <p>Reply to message:</p>}
                    </p>

                    <div className={ma.answerTitle}>
                      <p className={ma.answerStyle}>{selectorGallerySlice.itemsMessagesBuffer.find(element => element.id === selectorGallerySlice.answerId).name}</p>
                      <p className={ma.answerStyle}>{selectorGallerySlice.itemsMessagesBuffer.find(element => element.id === selectorGallerySlice.answerId).date}</p>
                      <div className={ma.time}>
                        <p className={ma.answerStyle}>{selectorGallerySlice.itemsMessagesBuffer.find(element => element.id === selectorGallerySlice.answerId).time}</p>
                        <p className={ma.answerStyle}>:{selectorGallerySlice.itemsMessagesBuffer.find(element => element.id === selectorGallerySlice.answerId).second}</p>
                      </div>
                    </div>
                  
                  <p className={ma.answer}>...{selectorGallerySlice.itemsMessagesBuffer.find(element => element.id === selectorGallerySlice.answerId).message}</p>
                  <button className={ma.searchbutton} onClick={cancelHandle} onMouseOver={changeBorderOver} onMouseOut={changeBorderOut}>
                  {selectorGallerySlice.settings.languageSelector === 'English' ? <p>Cancel</p> : 
                      selectorGallerySlice.settings.languageSelector === 'Українська' ? <p>Закрити</p> : 
                      selectorGallerySlice.settings.languageSelector === 'Polska' ? <p>Zamknąć</p> : <p>Cancel</p>}
                  </button>
                </div>
                  :
                  <div className={ma.answerStamp}>

                  <p className={ma.answerStampTitle}>
                  {selectorGallerySlice.settings.languageSelector === 'English' ? <p>Reply to message:</p> : 
                    selectorGallerySlice.settings.languageSelector === 'Українська' ? <p>Відповідь на повідомлення:</p> : 
                    selectorGallerySlice.settings.languageSelector === 'Polska' ? <p>Odpowiedz na wiadomość:</p> : <p>Reply to message:</p>}
                  </p>

                  <div className={ma.answerTitle}>
                    <p className={ma.answerStyle}>{selectorGallerySlice.personalMessagesBuffer[selectorGallerySlice.selectedPerson].find(element => element.id === selectorGallerySlice.answerId).name}</p>
                    <p className={ma.answerStyle}>{selectorGallerySlice.personalMessagesBuffer[selectorGallerySlice.selectedPerson].find(element => element.id === selectorGallerySlice.answerId).date}</p>
                    <div className={ma.time}>
                      <p className={ma.answerStyle}>{selectorGallerySlice.personalMessagesBuffer[selectorGallerySlice.selectedPerson].find(element => element.id === selectorGallerySlice.answerId).time}</p>
                      <p className={ma.answerStyle}>:{selectorGallerySlice.personalMessagesBuffer[selectorGallerySlice.selectedPerson].find(element => element.id === selectorGallerySlice.answerId).second}</p>
                    </div>
                  </div>

                  <p className={ma.answer}>...{selectorGallerySlice.personalMessagesBuffer[selectorGallerySlice.selectedPerson].find(element => element.id === selectorGallerySlice.answerId).message}</p>
                  <button className={ma.searchbutton} onClick={cancelHandle}>
                  {selectorGallerySlice.settings.languageSelector === 'English' ? <p>Cancel</p> : 
                    selectorGallerySlice.settings.languageSelector === 'Українська' ? <p>Закрити</p> : 
                    selectorGallerySlice.settings.languageSelector === 'Polska' ? <p>Zamknąć</p> : <p>Cancel</p>}
                  </button>
                  </div>
                  : ''}

                <button className={ma.searchbutton} onClick={searchMenuHandle} onMouseOver={changeBorderOver} onMouseOut={changeBorderOut} style={selectorGallerySlice.dayNight ? {border: 'none', backgroundColor: 'rgb(122, 152, 206)',} : {border: 'none', backgroundColor: '',}}>{searchMenuToggle ? <TriangleUpImg style={{width: '10px', height: '10px'}}/> : <TriangleDownImg style={{width: '10px', height: '10px'}}/>}</button>

                {searchMenuToggle ? <div>
                  
                  <div className={ma.searchcont} style={selectorGallerySlice.dayNight ? {borderColor: 'rgb(122, 152, 206)',} : {borderColor: '',}}>
                    <label className={ma.labsearch}> 

                    <div className={ma.serachlable}>

                      <p>
                      {selectorGallerySlice.settings.languageSelector === 'English' ? <p style={selectorGallerySlice.dayNight ? {color: 'rgb(122, 152, 206)',} : {color: 'white',}}>SearchByName</p> : 
                      selectorGallerySlice.settings.languageSelector === 'Українська' ? <p style={selectorGallerySlice.dayNight ? {color: 'rgb(122, 152, 206)',} : {color: 'white',}}>Знайти за назвою</p> : 
                      selectorGallerySlice.settings.languageSelector === 'Polska' ? <p style={selectorGallerySlice.dayNight ? {color: 'rgb(122, 152, 206)',} : {color: 'white',}}>Znajdź według nazwy</p> : <p>SearchByName</p>}
                      </p>
                               
                      <input {...register('SearchName', { 
                        
                        value: searchName, })} 
                        style={selectorGallerySlice.dayNight ? {backgroundColor: 'rgb(122, 152, 206)',} : {backgroundColor: '',}}
                        className={ma.insearch} 
                        type="text"
                        autoComplete='false'
                        onChange={inputSearch}
                        title="searchName"
                        placeholder=
                        {selectorGallerySlice.settings.languageSelector === 'English' ? "Enter name...": 
                          selectorGallerySlice.settings.languageSelector === 'Українська' ? "Введіть ім'я...": 
                          selectorGallerySlice.settings.languageSelector === 'Polska' ? "Wpisz imię..." : "Enter name..."}>
         
                      </input>

                    </div>

                    </label>

                    <label className={ma.labsearch}>
                      
                      <div className={ma.serachlable}>

                        <p>{selectorGallerySlice.settings.languageSelector === 'English' ? <p style={selectorGallerySlice.dayNight ? {color: 'rgb(122, 152, 206)',} : {color: 'white',}}>SearchByDate</p> : 
                          selectorGallerySlice.settings.languageSelector === 'Українська' ? <p style={selectorGallerySlice.dayNight ? {color: 'rgb(122, 152, 206)',} : {color: 'white',}}>Знайти за датою</p> : 
                          selectorGallerySlice.settings.languageSelector === 'Polska' ? <p style={selectorGallerySlice.dayNight ? {color: 'rgb(122, 152, 206)',} : {color: 'white',}}>Znajdź według daty</p> : <p>SearchByDate</p>}
                        </p>
                                
                        <input {...register('SearchDate', { 
            
                          value: searchDate, })} 
                          style={selectorGallerySlice.dayNight ? {backgroundColor: 'rgb(122, 152, 206)',} : {backgroundColor: '',}}
                          className={ma.insearch} 
                          type="text"
                          autoComplete='false'
                          onChange={inputSearch}
                          title="searchDate"
                          placeholder=
                          {selectorGallerySlice.settings.languageSelector === 'English' ? "Enter date...": 
                          selectorGallerySlice.settings.languageSelector === 'Українська' ? "Введіть дату...": 
                          selectorGallerySlice.settings.languageSelector === 'Polska' ? "Wpisz datę..." : "Enter date..."}>

                        </input>
                        
                      </div>

                    </label>

                    <label className={ma.labsearch}> 

                      <div className={ma.serachlable}>   
                    
                        <p>
                        {selectorGallerySlice.settings.languageSelector === 'English' ? <p style={selectorGallerySlice.dayNight ? {color: 'rgb(122, 152, 206)',} : {color: 'white',}}>SearchByText</p> : 
                          selectorGallerySlice.settings.languageSelector === 'Українська' ? <p style={selectorGallerySlice.dayNight ? {color: 'rgb(122, 152, 206)',} : {color: 'white',}}>Знайти за текстом</p> : 
                          selectorGallerySlice.settings.languageSelector === 'Polska' ? <p style={selectorGallerySlice.dayNight ? {color: 'rgb(122, 152, 206)',} : {color: 'white',}}>Znajdź według tekstu</p> : <p style={selectorGallerySlice.dayNight ? {color: 'rgb(122, 152, 206)',} : {color: 'white',}}>SearchByText</p>}
                        </p>
                                
                        <input {...register('SearchText', { 
            
                          value: searchText, })} 
                          style={selectorGallerySlice.dayNight ? {backgroundColor: 'rgb(122, 152, 206)',} : {backgroundColor: '',}}
                          className={ma.insearch} 
                          type="text"
                          autoComplete='false'
                          onChange={inputSearch}
                          title="searchText"
                          placeholder=
                          {selectorGallerySlice.settings.languageSelector === 'English' ? "Enter text...": 
                          selectorGallerySlice.settings.languageSelector === 'Українська' ? "Введіть текст...": 
                          selectorGallerySlice.settings.languageSelector === 'Polska' ? "Wpisz tekst..." : "Enter text..."}>

                        </input>

                      </div>

                    </label>
                  </div>
                </div> : ''}       
                <label className={ma.lab}>
                    
                    <textarea {...register('Message', {required: 'Please fill field!', 

                        maxLength: {value:300, message: 'Invalid length!'},  value:message,})}
                        style={selectorGallerySlice.dayNight ? {backgroundColor: 'rgb(122, 152, 206)',} : {backgroundColor: '',}}
                        wrap='soft'
                        className={ma.in} 
                        type="text"
                        autoComplete='false'
                        onChange={inputChange}
                        title="Messange"
                        placeholder=
                        {selectorGallerySlice.settings.languageSelector === 'English' ? "Enter messange...": 
                          selectorGallerySlice.settings.languageSelector === 'Українська' ? "Введіть повідомлення...": 
                          selectorGallerySlice.settings.languageSelector === 'Polska' ? "Wpisz wiadomość" : "Enter messange..."}>

                    </textarea>
                </label>

                <button className={ma.sendbutton} onMouseOver={changeBorderOver} onMouseOut={changeBorderOut} style={selectorGallerySlice.dayNight ? {backgroundColor: 'rgb(122, 152, 206)',} : {backgroundColor: '',}}>
                {selectorGallerySlice.settings.languageSelector === 'English' ? <p>Send</p> : 
                  selectorGallerySlice.settings.languageSelector === 'Українська' ? <p>Надіслати</p> : 
                  selectorGallerySlice.settings.languageSelector === 'Polska' ? <p>Wysłać</p> : <p>Send</p>} 
                  <SendImg style={{width: '25px', height: '25px',}} />
                </button>
            </div>
                                
        </form>
        
    </div>
  )
}

export default MageChat