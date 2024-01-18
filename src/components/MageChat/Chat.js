import { useState, useEffect, useRef} from 'react';
import { useSelector, useDispatch} from "react-redux"
import { useForm } from 'react-hook-form';
import useSound from 'use-sound';

import writeUserData from 'API/writerDB';
import pathCreator from './pathCreator/pathCreator';
import MessageItem from './MessageItem/MessageItem';
import ScrollDown from './ScrollDown/ScrollDown';

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
    
      if(selectorGallerySlice.itemMesBuffLength !== selectorGallerySlice.itemsMessagesBuffer.length && selectorGallerySlice.itemsMessagesBuffer.length != 0) {
         
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

  const addMessage = (_,evt) => {

    evt.preventDefault();
    
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

  return (
    <div className={ma.container} style={selectorGallerySlice.dayNight ? {backgroundColor: '#384a83',} : {backgroundColor: ''}}>
        
        <form onSubmit={handleSubmit(addMessage)}>
       
            <p className={ma.messagesCounter} style={selectorGallerySlice.dayNight ? {color: 'rgb(122, 152, 206)', fontWeight: '600'} : {color: 'white', fontWeight: '600'}}>{`${selectorGallerySlice.currentItemId === '' ? selectorGallerySlice.messagesBuffer.length : selectorGallerySlice.itemsMessagesBuffer.length} messages`}</p>
             
            <div className={ma.area} wrap='soft' onScroll={scrollEnd} style={selectorGallerySlice.dayNight ? {borderColor: 'rgb(122, 152, 206)',} : {borderColor: 'white',}}>

              {selectorGallerySlice.currentItemId === '' && selectorGallerySlice.messagesBuffer.length !== 0 ? <ScrollDown data={scrollHandler} scrollDownDetect={selectorGallerySlice.scrollIsEnd} /> : ''}

                <ul className={ma.list}>
                    {
                      selectorGallerySlice.currentItemId === '' ? selectorGallerySlice.messagesBuffer !== null && selectorGallerySlice.itemsMessagesBuffer !== undefined ? sortMessages(selectorGallerySlice.messagesBuffer).map(value => 
                      { return value.message.includes(searchText) && value.date.includes(searchDate) && value.name.includes(searchName) ? <li className={ma.item} ref={messageBlock} key={value.id} style={value.id === selectorGallerySlice.answerId ? {boxShadow: '0 2px 2px 0.5px lightcoral'} : {boxShadow: 'none'}}><MessageItem data={value} /></li> : ''}) : <EmptyImg style={{width: '100px', height: '100px',}} /> : 
                       selectorGallerySlice.itemsMessagesBuffer !== null && selectorGallerySlice.itemsMessagesBuffer !== undefined ? sortMessages(selectorGallerySlice.itemsMessagesBuffer).map(value => 
                      { return value.message.includes(searchText) && value.date.includes(searchDate) && value.name.includes(searchName) ? <li className={ma.item} ref={messageBlock} key={value.id} style={value.id === selectorGallerySlice.answerId ? {boxShadow: '0 2px 2px 0.5px lightcoral'} : {boxShadow: 'none'}}><MessageItem data={value} /></li> : ''}) : <EmptyImg style={{width: '100px', height: '100px',}} />
                    }
                </ul>

            </div>
         
                   
            <div className={ma.field}>
                
                <h1 className={ma.title}>Messanger</h1>

                {selectorGallerySlice.answerId !== '' ? 
                  selectorGallerySlice.currentItemId === '' ? 
                  <div className={ma.answerStamp}>

                    <p className={ma.answerStampTitle}>Reply to message:</p>

                    <div className={ma.answerTitle}>
                      <p className={ma.answerStyle}>{selectorGallerySlice.messagesBuffer.find(element => element.id === selectorGallerySlice.answerId).name}</p>
                      <p className={ma.answerStyle}>{selectorGallerySlice.messagesBuffer.find(element => element.id === selectorGallerySlice.answerId).date}</p>
                      <div className={ma.time}>
                        <p className={ma.answerStyle}>{selectorGallerySlice.messagesBuffer.find(element => element.id === selectorGallerySlice.answerId).time}</p>
                        <p className={ma.answerStyle}>:{selectorGallerySlice.messagesBuffer.find(element => element.id === selectorGallerySlice.answerId).second}</p>
                      </div>
                    </div>
                    
                    <p className={ma.answer}>...{selectorGallerySlice.messagesBuffer.find(element => element.id === selectorGallerySlice.answerId).message}</p>
                    <button onClick={cancelHandle}>Cancel</button>
                  </div> :
                  <div className={ma.answerStamp}> 
             
                    <p className={ma.answerStampTitle}>Reply to message:</p>

                    <div className={ma.answerTitle}>
                      <p className={ma.answerStyle}>{selectorGallerySlice.itemsMessagesBuffer.find(element => element.id === selectorGallerySlice.answerId).name}</p>
                      <p className={ma.answerStyle}>{selectorGallerySlice.itemsMessagesBuffer.find(element => element.id === selectorGallerySlice.answerId).date}</p>
                      <div className={ma.time}>
                        <p className={ma.answerStyle}>{selectorGallerySlice.itemsMessagesBuffer.find(element => element.id === selectorGallerySlice.answerId).time}</p>
                        <p className={ma.answerStyle}>:{selectorGallerySlice.itemsMessagesBuffer.find(element => element.id === selectorGallerySlice.answerId).second}</p>
                      </div>
                    </div>
                  
                  <p className={ma.answer}>...{selectorGallerySlice.itemsMessagesBuffer.find(element => element.id === selectorGallerySlice.answerId).message}</p>
                  <button onClick={cancelHandle}>Cancel</button>
                </div>
                  : ''}

                <button onClick={searchMenuHandle} style={selectorGallerySlice.dayNight ? {border: 'none', backgroundColor: 'rgb(122, 152, 206)',} : {border: 'none', backgroundColor: '',}}>{searchMenuToggle ? <TriangleUpImg style={{width: '10px', height: '10px'}}/> : <TriangleDownImg style={{width: '10px', height: '10px'}}/>}</button>

                {searchMenuToggle ? <div>
                  
                  <div>
                    <label className={ma.labserach}> 

                    <div className={ma.serachlable}>

                      <p>SearchByName</p>
                               
                      <input {...register('SearchName', { 
                        
                        value: searchName, })} 
                        style={selectorGallerySlice.dayNight ? {backgroundColor: 'rgb(122, 152, 206)',} : {backgroundColor: '',}}
                        className={ma.insearch} 
                        type="text"
                        autoComplete='false'
                        onChange={inputSearch}
                        title="searchName"
                        placeholder="Enter name...">
         
                      </input>

                    </div>

                    </label>

                    <label className={ma.labserach}>
                      
                      <div className={ma.serachlable}>

                        <p>SearchByDate</p>
                                
                        <input {...register('SearchDate', { 
            
                          value: searchDate, })} 
                          style={selectorGallerySlice.dayNight ? {backgroundColor: 'rgb(122, 152, 206)',} : {backgroundColor: '',}}
                          className={ma.insearch} 
                          type="text"
                          autoComplete='false'
                          onChange={inputSearch}
                          title="searchDate"
                          placeholder="Enter date...">

                        </input>
                        
                      </div>

                    </label>

                    <label className={ma.labserach}> 

                      <div className={ma.serachlable}>   
                    
                        <p>SearchByText</p>
                                
                        <input {...register('SearchText', { 
            
                          value: searchText, })} 
                          style={selectorGallerySlice.dayNight ? {backgroundColor: 'rgb(122, 152, 206)',} : {backgroundColor: '',}}
                          className={ma.insearch} 
                          type="text"
                          autoComplete='false'
                          onChange={inputSearch}
                          title="searchText"
                          placeholder="Enter text...">

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
                        placeholder="Enter messange...">

                    </textarea>
                </label>

                <button className={ma.button} style={selectorGallerySlice.dayNight ? {backgroundColor: 'rgb(122, 152, 206)',} : {backgroundColor: '',}}>Send <SendImg style={{width: '25px', height: '25px',}} /></button>
            </div>
                                
        </form>
        
    </div>
  )
}

export default MageChat