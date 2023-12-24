import { useSelector, useDispatch } from 'react-redux'
import { useState, useEffect } from 'react';
// import { useLocation } from 'react-router-dom';
import { nanoid } from 'nanoid';

import ga from './Gallery.module.scss'

import { getDatabase, ref, onValue } from 'firebase/database';

import { changePath } from 'vomgallStore/pathSlice';
import pathCreator from '../MageChat/pathCreator/pathCreator';
import { Loader } from 'components/Loader/Loader';
import Item from '../WorkSpace/Item/Item';
import readerStorAPI from '../../API/readerStorageAPI'
import writeUserData from 'API/writerDB';

import { change } from 'vomgallStore/gallerySlice';
import { changeReadStorage } from 'vomgallStore/readSlice'
// import { changePathName } from 'vomgallStore/pathSlice'
import { updatePathStyle } from 'vomgallStore/pathSlice'
import ModalItem from 'components/ModalItem/ModalItem';

import { ReactComponent as BlotImg } from '../../images/paint-mark-1-svgrepo-com.svg';
import { ReactComponent as WriteImg } from '../../images/edit-pen-write-1-svgrepo-com.svg';
import { ReactComponent as MusicImg } from '../../images/music-note-svgrepo-com.svg';
import { ReactComponent as DrawImg } from '../../images/palette-svgrepo-com.svg';
import { ReactComponent as ViewsImg } from '../../images/view-svgrepo-com.svg';

import { ReactComponent as HeartImg } from '../../images/heart-svgrepo-com.svg';
import { ReactComponent as LevelImg } from '../../images/layer-svgrepo-com.svg';

const Gallery = () => {

  const dispatch = useDispatch();
  const selectorGallSlice = useSelector(state => state.gallery);
  const selectorSingInSlice = useSelector(state => state.singIn);
  const selectorUserPath = useSelector(state => state.path);
  const selectorItemsUrl = useSelector(state => state.readStorage);
  const pathSelector = selectorUserPath.logicPath ;

  const [drawVisible, setDrawVisible] = useState(true);
  const [musicVisible, setMusicVisible] = useState(false);
  const [liricsVisible, setLiricsVisible] = useState(false);
 
  const [itemClickId, setItemClickId] = useState([]);
  const [ modalItemToggle, setModalItemToggle] = useState(false);
  const [ currentItemURL, setCurrentItemURL] = useState('');

  const [ currentItemId, setCurrentItemId] = useState('');
  
  // const location = useLocation();
  function makeUpdatePathStyleList() {

    let updateStyles = [];
    const currentArts = selectorGallSlice.users.find(element => element.userName === pathSelector.name).arts;

    for(const key in currentArts) {
      updateStyles = [...updateStyles, ...currentArts[key].style]; 
    };

    return updateStyles;

  };

  // clear 'selectedItems' and update heartsStatistic and viewsStatistic and levelStatistic from DB
  useEffect(() => {

    dispatch(change({operation: 'updateSelectedItems', data: []}));

    const refs = ['heartsStatistic', 'viewsStatistic', 'levelStatistic'];
    // load heartsStatistic and viewsStatistic and levelStatistic
    const db = getDatabase();

    for(let s = 0; s < refs.length; s += 1) {

      const statisticRef = ref(db, `${refs[s]}`);

      //firebase listener function
      onValue(statisticRef, snapshot => {
        // load data from database
        const data = snapshot.val();

        if(data !== null && data !== undefined) {
          if(s === 0) {
            dispatch(change({operation: 'changeHeartsStatistic', mode: 'update',
            data: data}));
          }

          if(s === 1) {
            dispatch(change({operation: 'changeViewsStatistic', mode: 'update',
          data: data}));
          }

          if(s === 2) {
            dispatch(change({operation: 'changeLevelStatistic', mode: 'update',
          data: data}));
          }
        }

      });
    }

  },[]);

  // change currentItemId in 'gellary' slice  
  useEffect(() => {

    dispatch(change({operation: 'changeCurrentItemId', data: currentItemId}));

  },[currentItemId]);

  // start viewsHandle
  useEffect(() => {

    if(selectorGallSlice.currentItemId !== '') {
      viewsHandle();
      levelCount ();
    }

  },[selectorGallSlice.currentItemId]);

  // write statistic to DB
  useEffect(() => {
    
    if(selectorGallSlice.heartsStatistic !== null && selectorGallSlice.heartsStatistic !== undefined) {

      if(Object.keys(selectorGallSlice.heartsStatistic).length !== 0) {
        writeUserData(
          'heartsStatistic',
          selectorGallSlice.heartsStatistic,
          null, true
        );
      };
    
    }; 
    
  },[selectorGallSlice.heartsStatistic]);

  // write views statistic to DB
  useEffect(() => {
    
    if(selectorGallSlice.viewsStatistic !== null && selectorGallSlice.viewsStatistic !== undefined) {

      if(Object.keys(selectorGallSlice.viewsStatistic).length !== 0) {
        writeUserData(
          'viewsStatistic',
          selectorGallSlice.viewsStatistic,
          null, true
        );
      };
      
    };

  },[selectorGallSlice.viewsStatistic]);

  // write level statistic to DB
  useEffect(() => {
    
    if(selectorGallSlice.levelStatistic !== null && selectorGallSlice.levelStatistic !== undefined) {

      if(Object.keys(selectorGallSlice.levelStatistic).length !== 0) {
        writeUserData(
          'levelStatistic',
          selectorGallSlice.levelStatistic,
          null, true
        );
      };
      
    };

  },[selectorGallSlice.levelStatistic]);

  // increment views and clear currentItemId
  useEffect(() => {

    // clear currentItemId
    if(!modalItemToggle) setCurrentItemId('');

  },[modalItemToggle]);

  // update 'selectedItems'
  useEffect(() => {
    itemClickId.length !== 0 ? 
      dispatch(change({operation: 'updateSelectedItems', data: itemClickId})):
        dispatch(change({operation: 'updateSelectedItems', data: []}));
  },[itemClickId]);

  useEffect(() => {
    if(selectorGallSlice.users !== null && selectorGallSlice.users !== undefined) {
      dispatch(updatePathStyle({data: makeUpdatePathStyleList()}));
    }
  },[selectorGallSlice.users]);

  useEffect(() => {

    // dispatch(changeReadStorage({operation: `changeItemsURL`}));

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
          users: selectorGallSlice.users,
          userIsSingInId: selectorSingInSlice.singInId
        }),

        pathCreator({
          pathSelector,
          section: 'chats',
          contents: 'messages',
          write: false,
          users: selectorGallSlice.users,
          userIsSingInId: selectorSingInSlice.singInId
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

      // get elements URL from fireBase Storage
      if(selectorGallSlice.itemsBuffer !== null && selectorGallSlice.itemsBuffer.length !== 0) {
        
        // clear ItemsURL array
        dispatch(changeReadStorage({operation: `changeItemsURL`}));
        
        selectorGallSlice.itemsBuffer.forEach(element => {

          dispatch(readerStorAPI({path: `${path[0]}${element.id}`, elementId: element.id}));
          
        });


      }
    }

    // change active color
    for (const key in selectorUserPath.logicPath.style) {

      if (selectorUserPath.logicPath.style[key] === true) {    
        dispatch(change({ operation: 'changeColorActive', data: key }));
      }

    }

    // if(location.pathname === 'community') dispatch(changePathName({ changeElement: 'name', data: true }));
    
      
  }, [pathSelector]);

  useEffect(() => {

    if(selectorGallSlice.itemsBuffer !== null && selectorGallSlice.itemsBuffer.length !== 0) {
        
      selectorGallSlice.itemsBuffer.forEach(element => {

        // add url to itemsBuffer
        if(selectorItemsUrl.itemsURL.length !== 0) {
          selectorItemsUrl.itemsURL.forEach(value => {if(value.id === element.id) 
            dispatch(change({operation: 'changeItemsUrl', id: element.id, url: selectorItemsUrl.itemsURL.find(value => value.id === element.id).url,}));
          });
          
        }
        
      });

    }
     
  },[selectorItemsUrl.itemsURL]);

  // handler arts button click
  const clickButtonArts = ({ currentTarget }) => {

    switch (currentTarget.name) {
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

  const itemClickHandle = ({ currentTarget }) => {

    if(selectorGallSlice.selectedItems !== undefined){

      // add/delete item from itemClickId on click
      selectorGallSlice.selectedItems.find(element => element === currentTarget.id) === undefined ? 
        setItemClickId([...itemClickId, currentTarget.id]): setItemClickId(itemClickId.filter(element => element !== currentTarget.id));
    }

    
  };

  const ModalItemToggleFunction = () => {
    // open item modal window
    setModalItemToggle(value => !value);
  };
  
  // double click on item
  const itemDoubleClickHandle = (evt) => {

    ModalItemToggleFunction();

    // save search item URL
    if(selectorGallSlice.itemsBuffer.find(element => element.id === evt.currentTarget.id) !== undefined)
    setCurrentItemURL(selectorGallSlice.itemsBuffer.find(element => element.id === evt.currentTarget.id).url);

    // save current item id, when modalItemToggle - true and clear, when - false
    setCurrentItemId(evt.currentTarget.id)
  };

  // click on heart
  const heartsHandle = () => {
    // check item selected
    if(selectorGallSlice.currentItemId !== '') {
      // add new user or new item to 'heartsStatistic'
      if(Object.keys(selectorGallSlice.heartsStatistic).length !== 0 && Object.keys(selectorGallSlice.heartsStatistic).includes(selectorSingInSlice.singInId)) {
          // add new item
          dispatch(change({operation: 'changeHeartsStatistic', mode: 'addItem',
          data: { item: selectorGallSlice.currentItemId, user: selectorSingInSlice.singInId}}));

      } else {
          // add new user and new item
          dispatch(change({operation: 'changeHeartsStatistic', mode: 'addUserField',
          data: selectorSingInSlice.singInId}));
          dispatch(change({operation: 'changeHeartsStatistic', mode: 'addItem',
          data: { item: selectorGallSlice.currentItemId, user: selectorSingInSlice.singInId}}));

      }

    }
  
  };

  // open item
  const viewsHandle = () => { 
    // check item selected
    if(selectorGallSlice.currentItemId !== '') {
      // add new item or new value to 'viewsStatistic'
      if(Object.keys(selectorGallSlice.viewsStatistic).length !== 0 && Object.keys(selectorGallSlice.viewsStatistic).includes(selectorGallSlice.currentItemId)) {
        // add new value to item
        dispatch(change({operation: 'changeViewsStatistic', mode: 'addValue',
         data: selectorGallSlice.currentItemId}));
      } else {
        // add new item and new value
        dispatch(change({operation: 'changeViewsStatistic', mode: 'addItem',
         data: selectorGallSlice.currentItemId}));
        dispatch(change({operation: 'changeViewsStatistic', mode: 'addValue',
         data: selectorGallSlice.currentItemId}));

      }
    }
  };

  const heartsCount = () => {

    let counter = 0;

    for(const key in selectorGallSlice.heartsStatistic) {
      if(selectorGallSlice.heartsStatistic[key].includes(selectorGallSlice.currentItemId)) counter += 1;
    }

    return counter;
  };

  const levelCount = () => {
   
    const rating = heartsCount() + selectorGallSlice.viewsStatistic[selectorGallSlice.currentItemId];
    
    if(selectorGallSlice.levelStatistic[selectorGallSlice.currentItemId] !== 10 && rating > 100) {
      
      const level = rating * 10 / 1000; 
      
      // check item selected
      if(selectorGallSlice.currentItemId !== '') {
        // add new item or new value to 'levelStatistic'
        if(Object.keys(selectorGallSlice.levelStatistic).length !== 0 && Object.keys(selectorGallSlice.levelStatistic).includes(selectorGallSlice.currentItemId)) {
          // add new value to item
          dispatch(change({operation: 'changeLevelStatistic', mode: 'addValue',
          data: {item: selectorGallSlice.currentItemId, level: level}}));
        } else {
          // add new item and new value
          dispatch(change({operation: 'changeLevelStatistic', mode: 'addItem',
          data: selectorGallSlice.currentItemId}));
          dispatch(change({operation: 'changeLevelStatistic', mode: 'addValue',
          data: {item: selectorGallSlice.currentItemId, level: level}}));

        }
      }
    }
    console.log(rating);
    if(rating < 100) {
      // add new item or new value to 'levelStatistic'
      if(Object.keys(selectorGallSlice.levelStatistic).length !== 0 && Object.keys(selectorGallSlice.levelStatistic).includes(selectorGallSlice.currentItemId)) {
        // add new value to item
        dispatch(change({operation: 'changeLevelStatistic', mode: 'addValue',
        data: {item: selectorGallSlice.currentItemId, level: 0}}));
      } else {
        // add new item and new value
        dispatch(change({operation: 'changeLevelStatistic', mode: 'addItem',
        data: selectorGallSlice.currentItemId}));
        dispatch(change({operation: 'changeLevelStatistic', mode: 'addValue',
        data: {item: selectorGallSlice.currentItemId, level: 0}}));

      }  
    };

  };

  return (
    <>
    {
      modalItemToggle && <ModalItem openClose={ModalItemToggleFunction}>
        <div style={{marginTop: '510px',}}>
          <img src={currentItemURL} alt='Content' style={{width: '100%', objectFit: 'contain', margin:'10px 0'}}></img> 

          <div style={{display: 'flex', flexDirection: 'row', justifyContent:'space-around', gap: '100px', width: '100%', marginBottom: '10px'}}>
            <div style={{display: 'flex', flexDirection: 'row', justifyContent:'space-around', alignItems: 'center', gap: '5px'}} id='hearts' onClick={heartsHandle}><HeartImg style={{width: '25px', height: '25px'}} /><p>{`Likes: ${heartsCount()}`}</p></div> 
            <div style={{display: 'flex', flexDirection: 'row', justifyContent:'space-around', alignItems: 'center', gap: '5px'}}><LevelImg style={{width: '25px', height: '25px'}}/><p>{`Level: ${selectorGallSlice.levelStatistic !== null ? selectorGallSlice.levelStatistic[selectorGallSlice.currentItemId] : ''}`}</p></div>
            <div style={{display: 'flex', flexDirection: 'row', justifyContent:'space-around', alignItems: 'center', gap: '5px'}}><ViewsImg style={{width: '25px', height: '25px'}}/><p>{`Views: ${selectorGallSlice.viewsStatistic !== null ? selectorGallSlice.viewsStatistic[selectorGallSlice.currentItemId] : ''}`}</p></div>
          </div>
        </div>
      </ ModalItem>
    }
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
          <div className={ga.artIcon}>Lirics <WriteImg style={
            { width: '20px', height: '20px', }
          }/></div>
          
        </button>
        <button
          type="button"
          style={
            selectorUserPath.logicPath.arts.music
              ? { backgroundColor: 'rgba(194, 212, 31, 0.801)', borderLeft: '2px solid white',
              borderRight: '2px solid white', }
              : { backgroundColor: 'rgba(209, 209, 209, 0.522)', borderLeft: '2px solid white',
              borderRight: '2px solid white', }
          }
          name="Music"
          onClick={clickButtonArts}
        >
          <div className={ga.artIcon}> Music <MusicImg style={
            { width: '20px', height: '20px',}
          }/></div>
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
          <div className={ga.artIcon}>Drawing <DrawImg style={
            { width: '20px', height: '20px', }
          }/></div>
        </button>
      </div>

      <div>
        <div>
          <p className={ga.title}>Styles</p>
          <ul className={ga.style}>
            {drawVisible 
              ? selectorGallSlice.users
                  .find(value => value.userName === selectorUserPath.logicPath.name)
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
                  .find(value => value.userName === selectorUserPath.logicPath.name)
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
                  .find(value => value.userName === selectorUserPath.logicPath.name)
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
          <div className={ga.total}>

            <p className={ga.title}>Elements</p>
            <p className={ga.title}></p>{selectorGallSlice.itemsBuffer !== null && selectorGallSlice.itemsBuffer.length !== 0 ? `total ${selectorGallSlice.itemsBuffer.length} pcs`: 'total 0 pcs'}
            
          </div>
          
          <div className={ga.loadContainer}>
            {selectorGallSlice.load ? <Loader /> : ''}
          </div>
          <ul className={ga.listItems}>
            {selectorGallSlice.pageBuffer.length !== 0 && selectorGallSlice.itemsBuffer !== null? (
              selectorGallSlice.pageBuffer[selectorGallSlice.pageQuantity.find(element => element.active === true).position].map(element => {
                return (
                  <li key={element.id} id={element.id} onClick={itemClickHandle} onDoubleClick={itemDoubleClickHandle} className={ga.item} style={selectorGallSlice.selectedItems.includes(element.id) ? {boxShadow: 'inset 0 0 7px #b6b5b5, 0px 2px 1px rgba(16, 16, 24, 0.08), 0px 1px 1px rgba(46, 47, 66, 0.16), 0px 1px 3px 3px rgba(194, 212, 31, 0.8)'} 
                  : {boxShadow: 'inset 0 0 7px #b6b5b5, 0px 2px 1px rgba(16, 16, 24, 0.08), 0px 1px 1px rgba(46, 47, 66, 0.16), 0px 1px 6px rgba(46, 47, 66, 0.08)'}}>
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
        </div> 
      </div>
    </div>
    </>
  );
}

export default Gallery