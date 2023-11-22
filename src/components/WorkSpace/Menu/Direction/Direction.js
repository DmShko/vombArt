import { useState } from 'react';
import { useForm } from 'react-hook-form';

import di from './Direction.module.scss'

const Direction = () => {

  const { register, handleSubmit, formState:{errors}, reset} = useForm({mode: 'onBlur'});

  const [direction, setSelectDirection] = useState('');

  const stateChange = data => {

    const { name, value } = data;

    // change 'name' and 'number' without use previous value
    switch(name) {
        case 'Direction':
            setSelectDirection(value);
            break;
        
        default: break;
    }

  };

  const inputChange = evt => {
    
    // change 'name','email', 'password'
    stateChange(evt.target);
  };

  const addUser = (_, evt) => {
   
    evt.preventDefault();
 
    reset({direction: '',});
 
  };

  return (
    <div className={di.container}>
        <form className={di.fise} onSubmit={handleSubmit(addUser)}>
                        <fieldset className={di.fset}>
                        <legend>Direction</legend>
                            <div className={di.field}>
                                <label className={di.lab}> Select direction
                                    <select {...register('Direction', {required: 'Please fill the Style field!', 
                
                                    maxLength: {value:16, message: 'Invalid length!'},  value:direction, pattern: {value: /\w{0}[a-zA-Zа-яА-Я]+\s\w{0}[a-zA-Zа-яА-Я]+/, message: 'Invalid Direction!'}})}

                                    className={di.in} 
                                    type="text"
                                    autoComplete='false'
                                    onChange={inputChange}
                                    title="Style"
                                    placeholder="Enter style...">

                                        <option value="1">Oil</option>
                                        <option value="2">Watercolor</option>
                                        <option value="3">Digital</option>
                                        <option value="4">Mix</option>
                                        
                                    </select>
                                </label>

                                <button className={di.button}>Add</button>
                        </div>
                        
                        </fieldset>
                    </form>
    </div>
  )
}

export default Direction