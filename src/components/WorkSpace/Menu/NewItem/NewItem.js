import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';

import { change } from 'vomgallStore/gallerySlice';
import nf from './NewItem.module.scss'

const NewItem = () => {

  const dispatch = useDispatch();

  const { register, handleSubmit, formState:{errors}, reset} = useForm({mode: 'onBlur'});

  const [description, setDescription] = useState('');
  const [title, setTitle] = useState('');

  const stateChange = data => {

    const { name, value } = data;

    // change 'name' and 'number' without use previous value
    switch(name) {
        case 'Title':
            setTitle(value);
            break;
        case 'Description':
            setDescription(value);
            break;
        
        default: break;
    }

  };

  const inputChange = evt => {
    
    // change 'name','email', 'password'
    stateChange(evt.target);
  };

  const addItem = (_, evt) => {
   
    evt.preventDefault();

    dispatch(
      change({
        operation: 'addItem',
        currentUserName: selectorPathState.name,
        artsName: getPropertyKey(selectorPathState.arts),
        data: {description: description, title: title },
      })
    );
 
    reset({description: '', title: ''});
 
  };

  return (
    <div className={nf.container}>
      <form className={nf.fise} onSubmit={handleSubmit(addItem)}>
        <fieldset className={nf.fset}>
          <legend>Add item</legend>
          <div className={nf.field}>
            <label className={nf.lab}>
              {' '}
              Title
              <input
                {...register('Title', {
                  required: 'Please fill the Title field!',

                  maxLength: { value: 16, message: 'Invalid length!' },
                  value: title,
                })}
                className={nf.in}
                type="text"
                autoComplete="false"
                onChange={inputChange}
                title="Title"
                placeholder="Enter style..."
              ></input>
            </label>

            <label className={nf.lab}>
              {' '}
              Description
              <textarea
                {...register('Description', {
                  required: 'Please fill the Description field!',

                  maxLength: { value: 100, message: 'Invalid length!' },
                  value: description,
                })}
                className={nf.in}
                type="text"
                onChange={inputChange}
                autoComplete="false"
                title="Description"
                placeholder="Enter short description..."
              ></textarea>
            </label>

            <button className={nf.button}>Add</button>
          </div>
        </fieldset>
      </form>
    </div>
  );
}

export default NewItem