import { useState, useEffect} from 'react';
import { useSelector, useDispatch} from "react-redux"
import { useForm } from 'react-hook-form';

import writeUserData from 'API/writerDB';
import pathCreator from './pathCreator/pathCreator';
import MessageItem from './MessageItem/MessageItem';
import { ReactComponent as EmptyImg } from '../../images/empty-white-box-svgrepo-com.svg';
import { ReactComponent as SendImg } from '../../images/send-alt-2-svgrepo-com.svg';

import ma from './Chat.module.scss'
import { change } from 'vomgallStore/gallerySlice';

const MageChat = () => {

  const selectorGallerySlice = useSelector(state => state.gallery);
  const pathSelector = useSelector(state => state.path.logicPath);
  const dispatch = useDispatch();

  const [timeValue, setTimeValue] = useState({ time: new Date() });
  const [newDateObj, setNewDateObj] = useState({});
  const [message, setMessage] = useState('');

  const { register, handleSubmit, formState:{errors}, reset} = useForm({mode: 'onBlur'});

  useEffect(() => {
    tick();
  },[])

  function tick() {
    
        setTimeValue({
          time: new Date()
        });
        
        const dateHours =  timeValue.time.getHours().toString().length === 1 ? "0" +  timeValue.time.getHours().toString() :  timeValue.time.getHours().toString();
        const dateMinutes =  timeValue.time.getMinutes().toString().length === 1 ? "0" +  timeValue.time.getMinutes().toString() : timeValue.time.getMinutes().toString();
        const dateSeconds =  timeValue.time.getSeconds();
  
        // get date
        const dateDay =  timeValue.time.getDate().toString().length === 1 ? "0" +  timeValue.time.getDate().toString() :  timeValue.time.getDate().toString();
        const dateMonth =  timeValue.time.getMonth().toString().length === 1 ? "0" + (timeValue.time.getMonth() + 1).toString() : (timeValue.time.getMonth() + 1).toString();
        
        const timedata = dateHours + ":" + dateMinutes;
        const datedata = dateDay + "/" + dateMonth;
        const yeardata =  timeValue.time.getFullYear();
  
        setNewDateObj({ timedata, datedata, yeardata, dateSeconds });
        dispatch(change({ operation: 'changeDate', data: {timedata, datedata, yeardata, dateSeconds} }));
  };

  const addUser = (_,evt) => {

    evt.preventDefault();
    
    // create chats tree
    const path = pathCreator({pathSelector, section: 'chats', contents: 'messages', write: true});
    
    // to database
    writeUserData(path, {name: 'Dima', message: message,}, selectorGallerySlice.date);

    reset({message: '', });

  };

  const inputChange = (evt) => {
    setMessage(evt.target.value);
  };

  return (
    <div className={ma.container}>
        
        <form onSubmit={handleSubmit(addUser)}>

           
            <div className={ma.area} wrap='soft'>
                <ul className={ma.list}>
                    {
                      selectorGallerySlice.messagesBuffer !== null ? selectorGallerySlice.messagesBuffer.map(value => 
                      { return <li className={ma.item} key={value.id}><MessageItem data={value} /></li>}) : <EmptyImg style={{width: '100px', height: '100px',}} />
                    }
                </ul>
            </div>
         
                   
            <div className={ma.field}>
                
                <h1 className={ma.title}>Messanger</h1>

                <label className={ma.lab}>
                    <textarea {...register('Messange', {required: 'Please fill field!', 
            
                        maxLength: {value:300, message: 'Invalid length!'},  value:message,})}
                        wrap='soft'
                        className={ma.in} 
                        type="text"
                        autoComplete='false'
                        onChange={inputChange}
                        title="Messange"
                        placeholder="Enter messange...">

                    </textarea>
                </label>

                <button className={ma.button}>Send <SendImg style={{width: '25px', height: '25px',}} /></button>
            </div>
                                
        </form>
        
    </div>
  )
}

export default MageChat