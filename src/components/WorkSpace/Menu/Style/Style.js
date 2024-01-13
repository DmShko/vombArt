import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';

import di from './Style.module.scss';
import Notiflix from 'notiflix';
import { change } from 'vomgallStore/gallerySlice';
import { addStyleToPath } from 'vomgallStore/pathSlice';
import { deleteStyleToPath } from 'vomgallStore/pathSlice';
import pathCreator from '../../../MageChat/pathCreator/pathCreator';

const Direction = () => {

  const dispatch = useDispatch();

  const selectorGallSlice = useSelector(state => state.gallery);
  
  const selectorPathState = useSelector(state => state.path.logicPath);

  const selectorSingInSlice = useSelector(state => state.singIn);

  const { register, handleSubmit, formState:{errors}, reset} = useForm({mode: 'onBlur'});

  const [style, setSelectDirection] = useState('');

  const [checkAdd, setCheckAdd] = useState(true);

  const [checkDel, setCheckDel] = useState(false);

  // retun key of element, that have value true
  const getPropertyKey = (data) => {
    for (const key in data) {
      if (data[key] === true) {
        return key;
      } 
    } 
  };

  const stateChange = data => {

    const { name, value } = data;

    // change 'name' and 'number' without use previous value
    switch(name) {
        case 'Style':
         
            setSelectDirection(value);
            break;
        
        default: break;
    }

  };

  const inputChange = evt => {
    
    // change 'name','email', 'password'
    stateChange(evt.target);
  };

  const addStyle = (_, evt) => {
    
    evt.preventDefault();
    if (
      getPropertyKey(selectorPathState.arts) !== undefined) {
      dispatch(
        change({
          operation: 'addUserStyle',
          currentUserName: selectorPathState.name,
          artsName: getPropertyKey(selectorPathState.arts),
          data: style,
        })
      );

      // add style to 'logicPath'
      dispatch(
        addStyleToPath({
          data: style,
        })
      );
      
    } else Notiflix.Notify.info('Please, select art section!', {width: '450px', position: 'center-top', fontSize: '24px',});
    reset({style: ''});
 
  };

  // retun true if element contain true
  const findProperty = data => {
    for (const key in data) {
      if (data[key] === true) {
        return true;
      }
    }
  };

  const deleteStyle = (_, evt) => {
    evt.preventDefault();

    console.log(selectorPathState);
    // check selected arts and style
    if (findProperty(selectorPathState.arts) && findProperty(selectorPathState.style)) {
      const path = [
        pathCreator({
        selectorPathState,
        section: 'items',
        contents: 'elements',
        write: false,
        users: selectorGallSlice.users,
        userIsSingInId: selectorSingInSlice.singInId
      })];

      console.log(path);
    }
    if (
      getPropertyKey(selectorPathState.arts) !== undefined
    ) {
      dispatch(
        change({
          operation: 'deleteUserStyle',
          currentUserName: selectorPathState.name,
          artsName: getPropertyKey(selectorPathState.arts),
          data: style,
        })
      );

      // delete style from 'logicPath'
      dispatch(
        deleteStyleToPath({
          data: style,
        })
      );
    }else Notiflix.Notify.info('Please, select art section!', {width: '450px', position: 'center-top', fontSize: '24px',});

    reset({ style: '' });
  };


  const checked = ({ target }) => {
    if (target.name === 'add') {
      setCheckAdd(!checkAdd);
      setCheckDel(!checkDel);
    } else {
      setCheckAdd(!checkAdd);
      setCheckDel(!checkDel);
    }
  };

  return (
    <div className={di.container}>
      <form
        className={di.fise}
        onSubmit={checkAdd ? handleSubmit(addStyle) : handleSubmit(deleteStyle)}
      >
        <fieldset className={di.fset}>
          <legend>{checkAdd ? 'Add Style' : 'Delete Style'}</legend>
          <div className={di.field}>
            <div className={di.radioCont}>
              <label>
                {' '}
                Add{' '}
                <input
                  className={di.radio}
                  type="radio"
                  name="add"
                  checked={checkAdd}
                  onChange={checked}
                ></input>
              </label>
              <label>
                {' '}
                Delete{' '}
                <input
                  className={di.radio}
                  type="radio"
                  name="delete"
                  checked={checkDel}
                  onChange={checked}
                ></input>
              </label>
            </div>

            <label className={di.lab}>
              {' '}
              Style name
              <input
                {...register('Style', {
                  required: 'Please fill the Style field!',

                  maxLength: { value: 16, message: 'Invalid length!' },
                  value: style,
                })}
                className={di.in}
                type="text"
                autoComplete="false"
                onChange={inputChange}
                title="Style"
                placeholder="Enter style name..."
              ></input>
            </label>

            <button className={di.button}>{checkAdd ? 'Add' : 'Delete'}</button>
          </div>
        </fieldset>
      </form>
    </div>
  );
}

export default Direction