import { useSelector, useDispatch } from 'react-redux'
import { useState, useEffect } from 'react';
import { nanoid } from 'nanoid';

import ga from './Gallery.module.scss'

import { getDatabase, ref, onValue } from 'firebase/database';

import { changePath } from 'vomgallStore/pathSlice';
import pathCreator from '../MageChat/pathCreator/pathCreator';
import { Loader } from 'components/Loader/Loader';
import Item from '../WorkSpace/Item/Item';
import Pagination from '../Pagination/Pagination'

import { change } from 'vomgallStore/gallerySlice';

import { ReactComponent as BlotImg } from '../../images/paint-mark-1-svgrepo-com.svg';

const Gallery = () => {

  const dispatch = useDispatch();
  const selectorGallSlice = useSelector(state => state.gallery);
  const selectorUserPath = useSelector(state => state.path);
  const pathSelector = selectorUserPath.logicPath ;

  const [drawVisible, setDrawVisible] = useState(true);
  const [musicVisible, setMusicVisible] = useState(false);
  const [liricsVisible, setLiricsVisible] = useState(false);
 
  useEffect(() => {
    // retun true if element contain true
    const findProperty = data => {
      for (const key in data) {
        if (data[key] === true) {
          return true;
        }
      }
    };

    // check selected arts and style
    if (findProperty(pathSelector.arts) && findProperty(pathSelector.style)) {
      dispatch(change({ operation: 'changeLoad', data: true }));
      // create items tree and create chats tree
      const path = [
        pathCreator({
          pathSelector,
          section: 'items',
          contents: 'elements',
          write: false,
        }),

        pathCreator({
          pathSelector,
          section: 'chats',
          contents: 'messages',
          write: false,
        }),
      ];

      // listenUserData(path);
      const db = getDatabase();
      for (let j = 0; j < path.length; j += 1) {
        const starCountRef = ref(db, path[j]);

        //firebase listener function
        onValue(starCountRef, snapshot => {
          // load data from database
          const data = snapshot.val();
          
          // hidden loader, when data is loaded
          dispatch(change({ operation: 'changeLoad', data: false }));

          let items = [];
          let keys = [];
          // check database not empty
          if (data !== null) {
            // convert data-object to array of objects
            for (const key in data) {
              items.push(data[key]);

              keys.push(key);
            }

            // add keys each object of items array
            for (let i = 0; i < items.length; i += 1) {
              items[i] = { ...items[i], id: keys[i] };
            }

            // save data to gallery state (for reload page)
            // new data load to ItemsBuffer only if user switched new art or style

            j === 0
              ? dispatch(
                  change({ operation: 'changeItemsBuffer', data: items })
                )
              : dispatch(
                  change({ operation: 'changeMessagesBuffer', data: items })
                );
          } else {
            dispatch(change({ operation: 'changeItemsBuffer', data: null }));
            dispatch(change({ operation: 'changeMessagesBuffer', data: null }));
          }
        });
      }
    }

    // change active color
    for (const key in selectorUserPath.logicPath.style) {

      if (selectorUserPath.logicPath.style[key] === true) {    
        dispatch(change({ operation: 'changeColorActive', data: key }));
      }

    }
      
  }, [pathSelector]);

  // handler arts button click
  const clickButtonArts = ({ target }) => {

    switch (target.name) {
      case 'Lirics':
        
        // visibility 'Lirics' on
        setLiricsVisible(true);

        // visibility ather reset
        setDrawVisible(false);
        setMusicVisible(false);

        dispatch(changePath({ changeElement: 'arts.lirics', data: true }));

        // reset another value
        dispatch(changePath({ changeElement: 'arts.music', data: false }));
        dispatch(changePath({ changeElement: 'arts.draw', data: false }));
        break;
      case 'Music':

        // visibility 'Music' on
        setMusicVisible(true);

        // visibility ather reset
        setDrawVisible(false);
        setLiricsVisible(false);

        dispatch(changePath({ changeElement: 'arts.music', data: true }));

        // reset another value
        dispatch(changePath({ changeElement: 'arts.lirics', data: false }));
        dispatch(changePath({ changeElement: 'arts.draw', data: false }));
        break;
      case 'Drawing':

        // visibility 'Drawing' on
        setDrawVisible(true);

        // visibility ather reset
        setMusicVisible(false);
        setLiricsVisible(false);

        dispatch(changePath({ changeElement: 'arts.draw', data: true }));

        // reset another value
        dispatch(changePath({ changeElement: 'arts.lirics', data: false }));
        dispatch(changePath({ changeElement: 'arts.music', data: false }));
        break;
      default:
        break;
    }
  };

  // handler style button click
  const clickButtonStyle = ({ target }) => {
  
    // reset another value before write new
    for(const key in selectorUserPath.logicPath.style) {

      dispatch(changePath({changeElement: `style.${key}`, data: false}));
      
    };
   
    dispatch(changePath({changeElement: `style.${Object.keys(selectorUserPath.logicPath.style).find(value => value === target.name.toLowerCase())}`, data: true}));

  };

  return (
    <div className={ga.container}>
      <div className={ga.arts}>
        <button
          type="button"
          style={
            selectorUserPath.logicPath.arts.lirics
              ? { backgroundColor: 'rgba(194, 212, 31, 0.801)' }
              : { backgroundColor: 'rgba(209, 209, 209, 0.522)' }
          }
          name="Lirics"
          onClick={clickButtonArts}
        >
          Lirics
        </button>
        <button
          type="button"
          style={
            selectorUserPath.logicPath.arts.music
              ? { backgroundColor: 'rgba(194, 212, 31, 0.801)' }
              : { backgroundColor: 'rgba(209, 209, 209, 0.522)' }
          }
          name="Music"
          onClick={clickButtonArts}
        >
          Music
        </button>
        <button
          type="button"
          style={
            selectorUserPath.logicPath.arts.draw
              ? { backgroundColor: 'rgba(194, 212, 31, 0.801)' }
              : { backgroundColor: 'rgba(209, 209, 209, 0.522)' }
          }
          name="Drawing"
          onClick={clickButtonArts}
        >
          Drawing
        </button>
      </div>

      <div>
        <div>
          <p className={ga.title}>Styles</p>
          <ul className={ga.style}>
            {drawVisible
              ? selectorGallSlice.users
                  .find(value => value.name === selectorUserPath.logicPath.name)
                  .arts.draw.style.map(value => (
                    <li key={nanoid()}>
                      <button
                        type="button"
                        name={value}
                        style={
                          value.toLowerCase() === selectorGallSlice.colorActive
                            ? { backgroundColor: 'rgba(194, 212, 31, 0.801)' }
                            : { backgroundColor: 'var(--text-color)' }
                        }
                        onClick={clickButtonStyle}
                      >
                        {value}
                      </button>
                    </li>
                  ))
              : ''}
            {musicVisible
              ? selectorGallSlice.users
                  .find(value => value.name === selectorUserPath.logicPath.name)
                  .arts.music.style.map(value => (
                    <li key={nanoid()}>
                      <button
                        type="button"
                        name={value}
                        style={
                          value.toLowerCase() === selectorGallSlice.colorActive
                            ? { backgroundColor: 'rgba(194, 212, 31, 0.801)' }
                            : { backgroundColor: 'var(--text-color)' }
                        }
                        onClick={clickButtonStyle}
                      >
                        {value}
                      </button>
                    </li>
                  ))
              : ''}

            {liricsVisible
              ? selectorGallSlice.users
                  .find(value => value.name === selectorUserPath.logicPath.name)
                  .arts.lirics.style.map(value => (
                    <li key={nanoid()}>
                      <button
                        type="button"
                        name={value}
                        style={
                          value.toLowerCase() === selectorGallSlice.colorActive
                            ? { backgroundColor: 'rgba(194, 212, 31, 0.801)' }
                            : { backgroundColor: 'var(--text-color)' }
                        }
                        onClick={clickButtonStyle}
                      >
                        {value}
                      </button>
                    </li>
                  ))
              : ''}
          </ul>
        </div>

        <div>
          <p className={ga.title}>Elements</p>
          <div className={ga.loadContainer}>
            {selectorGallSlice.load ? <Loader /> : ''}
          </div>
          <ul className={ga.listItems}>
            {selectorGallSlice.itemsBuffer !== null ? (
              selectorGallSlice.itemsBuffer.map(element => {
                return (
                  <li key={element.id} className={ga.item}>
                    <Item data={element} />
                  </li>
                );
              })
            ) : (
              <div className={ga.notResult}>
                <p>This section empty. Hurry up to load new elements!</p>{' '}
                <BlotImg className={ga.blotImg} />
              </div>
            )}
          </ul>
          <Pagination />
        </div>
      </div>
    </div>
  );
}

export default Gallery