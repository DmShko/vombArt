import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';

import di from './Style.module.scss';
import Notiflix from 'notiflix';
import { change } from 'vomgallStore/gallerySlice';
import { addStyleToPath } from 'vomgallStore/pathSlice';
import { deleteStyleToPath } from 'vomgallStore/pathSlice';
import { getDatabase, ref, onValue } from 'firebase/database';

const Direction = () => {

  const dispatch = useDispatch();

  const selectorGallSlice = useSelector(state => state.gallery);
  
  const pathSelector = useSelector(state => state.path.logicPath);

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
      getPropertyKey(pathSelector.arts) !== undefined && Object.keys(pathSelector.style).includes(style.toLowerCase()) === false
      && Object.keys(selectorGallSlice.users.find(element => element.uid === selectorSingInSlice.singInId).arts[getPropertyKey(pathSelector.arts)].style).length < 20) {
      dispatch(
        change({
          operation: 'addUserStyle',
          currentUserName: pathSelector.name,
          artsName: getPropertyKey(pathSelector.arts),
          data: style,
        })
      );

      // add style to 'logicPath'
      dispatch(
        addStyleToPath({
          data: style.toLowerCase(),
        })
      );
      
    } else Notiflix.Notify.info('Please, select art section! Max style length - 20!', {width: '450px', position: 'center-top', fontSize: '24px',});
    reset({Style: ''});
 
  };

  const deleteStyle = (_, evt) => {

    evt.preventDefault();

      const checkStyle = ['oil', 'watercolor', 'digital', 'mix', 'poem', 'liric', 'classic', 'pop'];

      const path = `${selectorGallSlice.users.find(element => 
        element.uid === selectorSingInSlice.singInId).userName}/items/${getPropertyKey(pathSelector.arts)}`;
      
       // listenAccount(path);
       const db = getDatabase();
       const starCountRef = ref(db, `${path}/${style.toLowerCase()}`);

       //firebase listener function
       onValue(starCountRef, snapshot => {

        // load account array from DB
        const styleData = snapshot.val();

        if(getPropertyKey(pathSelector.arts) !== undefined && pathSelector.arts[getPropertyKey(pathSelector.arts)] !== undefined
        && checkStyle.includes(style.toLowerCase()) === false) 
        { 
          if(styleData === null) {
            dispatch(
              change({
                operation: 'deleteUserStyle',
                currentUserName: pathSelector.name,
                artsName: getPropertyKey(pathSelector.arts),
                data: style,
              })
            );
  
            // delete style from 'logicPath'
            dispatch(
              deleteStyleToPath({
                data: style.toLowerCase(),
              })
            );
          }else Notiflix.Notify.info(`This style is not empty. In first delete style content.`, {width: '450px', position: 'center-top', fontSize: '24px',});
          
        }else Notiflix.Notify.info('This style is absent locked or art section is not selected!', {width: '450px', position: 'center-top', fontSize: '24px',});

       });

    reset({ Style: '' });
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