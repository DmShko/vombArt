import { useState } from 'react';
import { useSelector } from "react-redux"
import { useForm } from 'react-hook-form';

import writeUserData from 'API/writerDB';
import pathCreator from 'API/writerDB';

import ma from './Chat.module.scss'

const MageChat = () => {

  const pathSelector = useSelector(state => state.path.logicPath);

  const [message, setMessage] = useState('');

  const { register, handleSubmit, formState:{errors}, reset} = useForm({mode: 'onBlur'});

  const addUser = (evt) => {

    evt.preventDefault();

    const path = pathCreator(pathSelector);

    // to database
    writeUserData(path, Date.UTC.Date, Date.UTC.Time, message);

    reset({message: '', });

  };

  const inputChange = (evt) => {
    setMessage(evt.target.value);
  };

  return (
    <div className={ma.container}>
        
        <form onSubmit={handleSubmit(addUser)}>

           
            <div className={ma.area} wrap='soft'>

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

                <button className={ma.button}>Send</button>
            </div>
                                
        </form>
        
    </div>
  )
}

export default MageChat