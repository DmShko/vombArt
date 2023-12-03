import { useState, useEffect} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';

import writeUserData from 'API/writerDB';
import pathCreator from '../../../MageChat/pathCreator/pathCreator';
import { change } from 'vomgallStore/gallerySlice';
import nf from './NewItem.module.scss'

const NewItem = () => {
  const dispatch = useDispatch();

  const selectorGallerySlice = useSelector(state => state.gallery);
  const pathSelector = useSelector(state => state.path.logicPath);
  const [timeValue, setTimeValue] = useState({ time: new Date() });
  const [newDateObj, setNewDateObj] = useState({});
  const [message, setMessage] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({ mode: 'onBlur' });

  const [description, setDescription] = useState('');
  const [title, setTitle] = useState('');
  useEffect(() => {
    tick();
  }, []);

  function tick() {
    setTimeValue({
      time: new Date(),
    });

    const dateHours =
      timeValue.time.getHours().toString().length === 1
        ? '0' + timeValue.time.getHours().toString()
        : timeValue.time.getHours().toString();
    const dateMinutes =
      timeValue.time.getMinutes().toString().length === 1
        ? '0' + timeValue.time.getMinutes().toString()
        : timeValue.time.getMinutes().toString();
    const dateSeconds = timeValue.time.getSeconds();

    // get date
    const dateDay =
      timeValue.time.getDate().toString().length === 1
        ? '0' + timeValue.time.getDate().toString()
        : timeValue.time.getDate().toString();
    const dateMonth =
      timeValue.time.getMonth().toString().length === 1
        ? '0' + (timeValue.time.getMonth() + 1).toString()
        : (timeValue.time.getMonth() + 1).toString();

    const timedata = dateHours + ':' + dateMinutes;
    const datedata = dateDay + '/' + dateMonth;
    const yeardata = timeValue.time.getFullYear();

    setNewDateObj({ timedata, datedata, yeardata, dateSeconds });
    dispatch(
      change({
        operation: 'changeDate',
        data: { timedata, datedata, yeardata, dateSeconds },
      })
    );
  }
  const stateChange = data => {
    const { name, value } = data;

    // change 'name' and 'number' without use previous value
    switch (name) {
      case 'Title':
        setTitle(value);
        break;
      case 'Description':
        setDescription(value);
        break;

      default:
        break;
    }
  };

  const inputChange = evt => {
    // change 'name','email', 'password'
    stateChange(evt.target);
  };

  // retun true if element contain true
  const findProperty = data => {
    for (const key in data) {
      if (data[key] === true) {
        return true;
      }
    }
  };

  const addItem = (_, evt) => {
    evt.preventDefault();

    // check selected arts and style
    if (findProperty(pathSelector.arts) && findProperty(pathSelector.style)) {
      // create items tree
      const path = pathCreator({
        pathSelector,
        section: 'items',
        contents: 'elements',
        write: true,
      });
      // to database
      writeUserData(path, { title: title, description: description }, selectorGallerySlice.date);
    }

    reset({ description: '', title: '' });
  };

  return (
    <div className={nf.container}>
      <form className={nf.fise} onSubmit={handleSubmit(addItem)}>
        <fieldset className={nf.fset}>
          <legend>New item</legend>
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

            <button className={nf.button}>Add Item</button>
          </div>
        </fieldset>
      </form>
    </div>
  );
}

export default NewItem