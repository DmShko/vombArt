import { useState } from 'react';
import { useForm } from 'react-hook-form';

import nf from './NewForm.module.scss'

const NewForm = () => {

  const { register, handleSubmit, formState:{errors}, reset} = useForm({mode: 'onBlur'});

  const [style, setStyle] = useState('');
  const [title, setTitle] = useState('');

  const stateChange = data => {

    const { name, value } = data;

    // change 'name' and 'number' without use previous value
    switch(name) {
        case 'Style':
            setStyle(value);
            break;
        case 'Title':
            setTitle(value)
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
 
    reset({style: '', title: ''});
 
  };

  return (
    <div className={nf.container}>
        <form className={nf.fise} onSubmit={handleSubmit(addUser)}>
                        <fieldset className={nf.fset}>
                        <legend>Add new</legend>
                            <div className={nf.field}>
                                <label className={nf.lab}> Style
                                    <input {...register('Style', {required: 'Please fill the Style field!', 
                
                                    maxLength: {value:16, message: 'Invalid length!'},  value:style, pattern: {value: /\w{0}[a-zA-Zа-яА-Я]+\s\w{0}[a-zA-Zа-яА-Я]+/, message: 'Invalid Style!'}})}

                                    className={nf.in} 
                                    type="text"
                                    autoComplete='false'
                                    onChange={inputChange}
                                    title="Style"
                                    placeholder="Enter style..."></input>
                                </label>

                                <label className={nf.lab}> Title
                                <input {...register('Password', {required: 'Please fill the Title field!', 
                
                                maxLength: {value:16, message: 'Invalid length!'},  value:title, pattern: {value: /\w{0}[a-zA-Zа-яА-Я]+\s\w{0}[a-zA-Zа-яА-Я]+/, message: 'Invalid Title!'}})}

                                className={nf.in}
                                type="text"
                            
                                onChange={inputChange}
                                autoComplete='false'
                                title="Title"
                                placeholder="Enter title..."></input>
                                </label>

                                <button className={nf.button}>Add</button>
                        </div>
                        
                        </fieldset>
                    </form>
    </div>
  )
}

export default NewForm