import { useSelector, useDispatch } from 'react-redux'
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom'; 
// import { useLocation } from 'react-router-dom';

import { nanoid } from 'nanoid';

import ga from './Gallery.module.scss'

import { getDatabase, ref, onValue } from 'firebase/database';

import { changePath } from 'vomgallStore/pathSlice';
import pathCreator from '../MageChat/pathCreator/pathCreator';
import { Loader } from 'components/Loader/Loader';
import Item from '../WorkSpace/Item/Item';
import readerStorAPI from '../../API/readerStorageAPI';
import writeUserData from 'API/writerDB';

import { change } from 'vomgallStore/gallerySlice';

// import { changePathName } from 'vomgallStore/pathSlice'
import { updatePathStyle } from 'vomgallStore/pathSlice';
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
  const pathSelector = selectorUserPath.logicPath;

  const [drawVisible, setDrawVisible] = useState(false);
  const [musicVisible, setMusicVisible] = useState(false);
  const [liricsVisible, setLiricsVisible] = useState(false);
 
  // const [itemClickId, setItemClickId] = useState([]);
  const [ modalItemToggle, setModalItemToggle] = useState(false);
  const [ currentItemURL, setCurrentItemURL] = useState('');
  const [ currentItemType, setCurrentItemType] = useState('');

  const [ currentItemId, setCurrentItemId] = useState('');
  const [ selectAllMode, setSelectAllMode] = useState(false);
  
  const location = useLocation();

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
    // eslint-disable-next-line
  },[]);

  // get elements URL from fireBase Storage see row 335 
  useEffect(() => {

    const path = [
      pathCreator({
        pathSelector,
        section: 'items',
        contents: 'elements',
        write: false,
        users: selectorGallSlice.users,
        userIsSingInId: selectorSingInSlice.singInId
      })]
    
    // get elements URL from fireBase Storage
    if(selectorGallSlice.itemsBuffer !== null && selectorGallSlice.itemsBuffer.length !== 0
      && selectorGallSlice.currentItemId === '') {
       
      // clear ItemsURL array
      // dispatch(changeReadStorage({operation: `changeItemsURL`}));
      
      // read storage URL for element 'id' from itemsBuffer
      selectorGallSlice.itemsBuffer.forEach(element => {

        dispatch(readerStorAPI({path: `${path[0]}${element.id}`, elementId: element.id}));
        
      });

    }
  // eslint-disable-next-line
  },[selectorGallSlice.itemsBuffer]);

  // change currentItemId in 'gellary' slice  
  useEffect(() => {

    dispatch(change({operation: 'changeCurrentItemId', data: currentItemId}));
    // eslint-disable-next-line
  },[currentItemId]);

  // start viewsHandle
  useEffect(() => {

    if(selectorGallSlice.currentItemId !== '') {
      viewsHandle();
      levelCount ();
    }
    // eslint-disable-next-line
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

  useEffect(() => {
    if(selectorGallSlice.users !== null && selectorGallSlice.users !== undefined) {
      dispatch(updatePathStyle({data: makeUpdatePathStyleList()}));
    }
    // eslint-disable-next-line
  },[selectorGallSlice.users, pathSelector.name]);

  /************ */
  useEffect(() => {
    let path = [];
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
      
      if(selectorGallSlice.currentItemId !== '') {
    
        path = [
          
          pathCreator({
            pathSelector,
            section: 'chats',
            contents: `elements/messages/${selectorGallSlice.currentItemId}`,
            write: false,
            users: selectorGallSlice.users,
            userIsSingInId: selectorSingInSlice.singInId
          })
        ];

      };
     
      // listenUserData(path);
      const db = getDatabase();
      for (let j = 0; j < path.length; j += 1) {
        const starCountRef = ref(db, path[j]);

        //firebase listener function
        onValue(starCountRef, snapshot => {
          // load data from database
          const data = snapshot.val();

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

            // item modal open
            if(selectorGallSlice.currentItemId !== ''){
              dispatch(
                    change({ operation: 'changeItemsMessagesBuffer', data: items })
              );
            };
          } else {

            dispatch(change({ operation: 'changeItemsMessagesBuffer', data: [] }));

          }
        });
      }

    }
   // eslint-disable-next-line   
  }, [selectorGallSlice.currentItemId]);


  useEffect(() => {
    let path = [];
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
      // create items tree and create chats tree for read

      // if(selectorGallSlice.currentItemId === '') {
        path = [
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
          })
        ];
      // } 
      // else {
      //   path = [
          
      //     pathCreator({
      //       pathSelector,
      //       section: 'chats',
      //       contents: `elements/messages/${selectorGallSlice.currentItemId}`,
      //       write: false,
      //       users: selectorGallSlice.users,
      //       userIsSingInId: selectorSingInSlice.singInId
      //     })
      //   ];
      // };
     
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

            // item modal close
            // if(selectorGallSlice.currentItemId === ''){
              j === 0 
                ? dispatch(
                    change({ operation: 'changeItemsBuffer', data: items })
                  )
                : dispatch(
                    change({ operation: 'changeMessagesBuffer', data: items })
                  );
            // };

            // item modal open
            // if(selectorGallSlice.currentItemId !== ''){
            //   dispatch(
            //         change({ operation: 'changeItemsMessagesBuffer', data: items })
            //   );
            // };
          } else {
            dispatch(change({ operation: 'changeItemsBuffer', data: [] }));
            dispatch(change({ operation: 'changeMessagesBuffer', data: [] }));
            // dispatch(change({ operation: 'changeItemsMessagesBuffer', data: [] }));
          }
        });
      }

       // get from here (see row 106) 
    }

    // change active color
    for (const key in selectorUserPath.logicPath.style) {

      if (selectorUserPath.logicPath.style[key] === true) {    
        dispatch(change({ operation: 'changeColorActive', data: key }));
      }

    }

    // if(location.pathname === 'community') dispatch(changePathName({ changeElement: 'name', data: true }));
    
   // eslint-disable-next-line   
  }, [pathSelector]);
              // ^, selectorGallSlice.currentItemId

  useEffect(() => {

    if(selectorGallSlice.itemsBuffer !== null && selectorGallSlice.itemsBuffer.length !== 0) {
        
      selectorGallSlice.itemsBuffer.forEach(element => {

        // add url to itemsBuffer 'changeItemsUrl' in 'gellary'
        if(selectorItemsUrl.itemsURL.length !== 0) {
          selectorItemsUrl.itemsURL.forEach(value => {if(value.id === element.id) 
            dispatch(change({operation: 'changeItemsUrl', id: element.id, url: selectorItemsUrl.itemsURL.find(value => value.id === element.id).url,}));
          });
          
        }
        
      });

    }
   // eslint-disable-next-line  
  },[selectorItemsUrl.itemsURL]);


  //change logicPath
  useEffect(() => {

    if(drawVisible) {

      // reset styles
      for(const key in selectorUserPath.logicPath.style) {

        dispatch(changePath({changeElement: `style.${key}`, data: false}));
        
      };

      // highlite active button off
      dispatch(change({ operation: 'changeColorActive', data: ''}));

      dispatch(changePath({ changeElement: 'arts.draw', data: true }));

      // reset another value
      dispatch(changePath({ changeElement: 'arts.lirics', data: false }));
      dispatch(changePath({ changeElement: 'arts.music', data: false }));

    };

    if(musicVisible) {

      // reset styles
      for(const key in selectorUserPath.logicPath.style) {

        dispatch(changePath({changeElement: `style.${key}`, data: false}));
        
      };

      // highlite active button off
      dispatch(change({ operation: 'changeColorActive', data: ''}));

      dispatch(changePath({ changeElement: 'arts.music', data: true }));

      // reset another value
      dispatch(changePath({ changeElement: 'arts.lirics', data: false }));
      dispatch(changePath({ changeElement: 'arts.draw', data: false }));

    };

    if(liricsVisible) {

      // reset styles
      for(const key in selectorUserPath.logicPath.style) {

      dispatch(changePath({changeElement: `style.${key}`, data: false}));
  
      };

      // highlite active button off
      dispatch(change({ operation: 'changeColorActive', data: ''}));

      dispatch(changePath({ changeElement: 'arts.lirics', data: true }));

      // reset another value
      dispatch(changePath({ changeElement: 'arts.music', data: false }));
      dispatch(changePath({ changeElement: 'arts.draw', data: false }));

    };
    // eslint-disable-next-line
  },[drawVisible, musicVisible, liricsVisible]);

  // handler arts button click
  const clickButtonArts = ({ currentTarget }) => {

    switch (currentTarget.name) {
      case 'Lirics':

        // visibility 'Lirics' on
        setLiricsVisible(true);

        // visibility ather reset
        setDrawVisible(false);
        setMusicVisible(false);
        
        break;
      case 'Music':

        // visibility 'Music' on
        setMusicVisible(true);

        // visibility ather reset
        setDrawVisible(false);
        setLiricsVisible(false);
        
        break;
      case 'Drawing':

        // visibility 'Drawing' on
        setDrawVisible(true);

        // visibility ather reset
        setMusicVisible(false);
        setLiricsVisible(false);

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
  
    if(selectorGallSlice.selectedItems !== undefined && location.pathname !== '/community') {

      dispatch(change({operation: 'changeSelectedItems', data: currentTarget.id}));
      
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
    if(selectorGallSlice.itemsBuffer.find(element => element.id === evt.currentTarget.id) !== undefined) {

      setCurrentItemURL(selectorGallSlice.itemsBuffer.find(element => element.id === evt.currentTarget.id).url);
      setCurrentItemType(selectorGallSlice.itemsBuffer.find(element => element.id === evt.currentTarget.id).type);

    }

    // // save current item id, when modalItemToggle - true and clear, when - false
    setCurrentItemId(evt.currentTarget.id);
   
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

  const changeBorderOver = (evt) => {

    if(selectorGallSlice.dayNight) evt.currentTarget.style.outline =  '2px solid lightgray';
    if(!selectorGallSlice.dayNight) evt.currentTarget.style.outline =  '2px solid #1C274C';

  };

  const changeBorderOut = (evt) => {

    if(selectorGallSlice.dayNight) evt.currentTarget.style.outline =  'none';
    if(!selectorGallSlice.dayNight) evt.currentTarget.style.outline =  'none';
    
  };

  const selectAllHandle = () => {

    if(selectorGallSlice.itemsBuffer.length !== 0) {

      setSelectAllMode(value => !value);

      let allId = [];

      if(!selectAllMode) {
        for(const a of selectorGallSlice.itemsBuffer) {
          allId.push(a.id)
        };
      };
      
      dispatch(change({operation: 'changeAllSelectedItems', mode: selectAllMode, data: allId}));
      
    }
    
  };

  return (
    <>
    {
      modalItemToggle && <ModalItem openClose={ModalItemToggleFunction}>
        <div className={ga.content} style={currentItemType !== 'text/plain' ? {width: '100%',} : {width: '100%',}}>

          {currentItemType === 'image/jpeg' ? <img src={currentItemURL} alt='Content' style={{width: '100%', objectFit: 'contain', margin:'10px 0',}}></img> 
          : currentItemType === 'text/plain' ? <iframe src={currentItemURL} title="textFrame" style={selectorGallSlice.dayNight ? {width: '100%', height: '300px', margin:'0', border: 'none', backgroundColor: 'rgb(122, 152, 206)',} 
          : {width: '100%', height: '300px', margin:'0', border: 'none', backgroundColor: '',}}></iframe>
          : currentItemType === 'audio/mpeg' ? <iframe src={currentItemURL} title="audioFrame" style={{width: '100%', height: '300px', margin:'0 auto', border: 'none'}}></iframe> : ''}
           

          <div className={ga.statitem}>
            <div className={ga.statpoint} id='hearts' onClick={heartsHandle}><HeartImg style={{width: '25px', height: '25px'}} />
            <p>{selectorGallSlice.settings.languageSelector === 'English' ? `Likes: ${heartsCount()}` : 
              selectorGallSlice.settings.languageSelector === 'Українська' ? `Вподобайки: ${heartsCount()}` : 
              selectorGallSlice.settings.languageSelector === 'Polska' ? `Lubi: ${heartsCount()}` : `Likes: ${heartsCount()}`}</p></div> 

            <div className={ga.statpoint}><LevelImg style={{width: '25px', height: '25px'}}/>
            <p>{selectorGallSlice.settings.languageSelector === 'English' ? `Level: ${selectorGallSlice.levelStatistic !== null ? selectorGallSlice.levelStatistic[selectorGallSlice.currentItemId] : ''}` : 
              selectorGallSlice.settings.languageSelector === 'Українська' ? `Рівень: ${selectorGallSlice.levelStatistic !== null ? selectorGallSlice.levelStatistic[selectorGallSlice.currentItemId] : ''}` : 
              selectorGallSlice.settings.languageSelector === 'Polska' ? `Poziom: ${selectorGallSlice.levelStatistic !== null ? selectorGallSlice.levelStatistic[selectorGallSlice.currentItemId] : ''}` : 
              `Level: ${selectorGallSlice.levelStatistic !== null ? selectorGallSlice.levelStatistic[selectorGallSlice.currentItemId] : ''}`}</p></div>

            <div className={ga.statpoint}><ViewsImg style={{width: '25px', height: '25px'}}/>
            <p>{selectorGallSlice.settings.languageSelector === 'English' ? `Views: ${selectorGallSlice.viewsStatistic !== null ? selectorGallSlice.viewsStatistic[selectorGallSlice.currentItemId] : ''}` : 
              selectorGallSlice.settings.languageSelector === 'Українська' ? `Перегляди: ${selectorGallSlice.viewsStatistic !== null ? selectorGallSlice.viewsStatistic[selectorGallSlice.currentItemId] : ''}` : 
              selectorGallSlice.settings.languageSelector === 'Polska' ? `Wyświetlenia: ${selectorGallSlice.viewsStatistic !== null ? selectorGallSlice.viewsStatistic[selectorGallSlice.currentItemId] : ''}` : 
              `Views: ${selectorGallSlice.viewsStatistic !== null ? selectorGallSlice.viewsStatistic[selectorGallSlice.currentItemId] : ''}`}</p></div>
          </div>
        </div>
      </ ModalItem>
    }
    <div className={ga.container} style={selectorGallSlice.dayNight ? {backgroundColor: '#384a83', } : {backgroundColor: ''}}>
      <div className={ga.arts} style={selectorGallSlice.dayNight ? {borderColor: 'lightgray', } : {borderColor: ''}}>
        <button 
          type="button"
          style={ selectorGallSlice.dayNight ?
            selectorUserPath.logicPath.arts.lirics
              ? { backgroundColor: 'rgba(194, 212, 31, 0.801)', boxShadow: 'inset 1px 1px 4px 3px rgba(16, 16, 24, 0.08)' }
              : { backgroundColor: 'rgb(122, 152, 206)' }
              :
            selectorUserPath.logicPath.arts.lirics
              ? { backgroundColor: 'rgba(194, 212, 31, 0.801)', boxShadow: 'inset 1px 1px 4px 3px rgba(16, 16, 24, 0.08)' }
              : { backgroundColor: 'rgba(209, 209, 209, 0.522)' }
          }
          name="Lirics"
          onClick={clickButtonArts}
        > 
          <div className={ga.artIcon}>
          {selectorGallSlice.settings.languageSelector === 'English' ? 'Writing' : 
            selectorGallSlice.settings.languageSelector === 'Українська' ? 'Письмо' : 
            selectorGallSlice.settings.languageSelector === 'Polska' ? 'Pismo' : 'Writing'} 
          <WriteImg style={
            { width: '20px', height: '20px', }
          }/></div>
          
        </button>
        <button
          type="button"
          style={
          selectorGallSlice.dayNight ?
            selectorUserPath.logicPath.arts.music
              ? { backgroundColor: 'rgba(194, 212, 31, 0.801)', borderLeft: '2px solid lightgray',
              borderRight: '2px solid lightgray', boxShadow: 'inset 1px 1px 4px 3px rgba(16, 16, 24, 0.08)'}
              : { backgroundColor: 'rgb(122, 152, 206)', borderLeft: '2px solid lightgray',
              borderRight: '2px solid lightgray', }
              :
            selectorUserPath.logicPath.arts.music
              ? { backgroundColor: 'rgba(194, 212, 31, 0.801)', borderLeft: '2px solid white',
              borderRight: '2px solid white', boxShadow: 'inset 1px 1px 4px 3px rgba(16, 16, 24, 0.08)'}
              : { backgroundColor: 'rgba(209, 209, 209, 0.522)', borderLeft: '2px solid white',
              borderRight: '2px solid white', }
          }
          name="Music"
          onClick={clickButtonArts}
        >
          <div className={ga.artIcon}> 
          {selectorGallSlice.settings.languageSelector === 'English' ? 'Music' : 
            selectorGallSlice.settings.languageSelector === 'Українська' ? 'Музика' : 
            selectorGallSlice.settings.languageSelector === 'Polska' ? 'Muzyka' : 'Music'}  
          <MusicImg style={
            { width: '20px', height: '20px',}
          }/></div>
        </button>
        <button
          type="button"
          style={
            selectorGallSlice.dayNight ?
            selectorUserPath.logicPath.arts.draw
              ? { backgroundColor: 'rgba(194, 212, 31, 0.801)', boxShadow: 'inset 1px 1px 4px 3px rgba(16, 16, 24, 0.08)'}
              : { backgroundColor: 'rgb(122, 152, 206)' }
              :
            selectorUserPath.logicPath.arts.draw
              ? { backgroundColor: 'rgba(194, 212, 31, 0.801)', boxShadow: 'inset 1px 1px 4px 3px rgba(16, 16, 24, 0.08)' }
              : { backgroundColor: 'rgba(209, 209, 209, 0.522)' }
          }
          name="Drawing"
          onClick={clickButtonArts}
        >
          <div className={ga.artIcon}>
          {selectorGallSlice.settings.languageSelector === 'English' ? 'Drawing' : 
            selectorGallSlice.settings.languageSelector === 'Українська' ? 'Живопис' : 
            selectorGallSlice.settings.languageSelector === 'Polska' ? 'Rysunek' : 'Drawing'} 
          <DrawImg style={
            { width: '20px', height: '20px', }
          }/></div>
        </button>
      </div>

      <div>
        <div>
          <p className={ga.title} style={selectorGallSlice.dayNight ? {color: 'rgb(122, 152, 206)',} : {backgroundColor: ''}}>
          {selectorGallSlice.settings.languageSelector === 'English' ? 'Styles' : 
            selectorGallSlice.settings.languageSelector === 'Українська' ? 'Стилі' : 
            selectorGallSlice.settings.languageSelector === 'Polska' ? 'Style' : 'Styles'}
          </p>
          <ul className={ga.style} style={selectorGallSlice.dayNight ? {borderColor: 'lightgray',} : {borderColor: ''}}>
            {selectorUserPath.logicPath.arts['draw'] 
              ? selectorGallSlice.users
                  .find(value => value.userName === selectorUserPath.logicPath.name)
                  .arts.draw.style.map(value => (
                    <li key={nanoid()}>
                      <button
                        type="button"
                        name={value}
                        style={
                          selectorGallSlice.dayNight ?
                          value.toLowerCase() === selectorGallSlice.colorActive
                            ? { backgroundColor: 'rgba(194, 212, 31, 0.801)' }
                            : { backgroundColor: 'rgb(122, 152, 206)' }
                            :
                          value.toLowerCase() === selectorGallSlice.colorActive
                            ? { backgroundColor: 'rgba(194, 212, 31, 0.801)' }
                            : { backgroundColor: 'var(--text-color)' }
                        }
                        onClick={clickButtonStyle}
                      >
                        {value === 'Oil' ? selectorGallSlice.settings.languageSelector === 'English' ? 'Oil' : 
                          selectorGallSlice.settings.languageSelector === 'Українська' ? 'Масло' : 
                          selectorGallSlice.settings.languageSelector === 'Polska' ? 'Masło' : '' : 
                        value === 'Watercolor' ? selectorGallSlice.settings.languageSelector === 'English' ? 'Watercolor': 
                          selectorGallSlice.settings.languageSelector === 'Українська' ? 'Акварель' : 
                          selectorGallSlice.settings.languageSelector === 'Polska' ? 'Akwarela' : '' : 
                        value === 'Digital' ? selectorGallSlice.settings.languageSelector === 'English' ? 'Digital': 
                          selectorGallSlice.settings.languageSelector === 'Українська' ? 'Цифровий' : 
                          selectorGallSlice.settings.languageSelector === 'Polska' ? 'Cyfrowy' : '' :
                        value === 'Mix' ? selectorGallSlice.settings.languageSelector === 'English' ? 'Mix': 
                          selectorGallSlice.settings.languageSelector === 'Українська' ? 'Змішаний' : 
                          selectorGallSlice.settings.languageSelector === 'Polska' ? 'Mieszany' : '' : value}
                      </button>
                    </li>
                  ))
              : ''}
            {selectorUserPath.logicPath.arts['music'] 
              ? selectorGallSlice.users
                  .find(value => value.userName === selectorUserPath.logicPath.name)
                  .arts.music.style.map(value => (
                    <li key={nanoid()}>
                      <button
                        type="button"
                        name={value}
                        style={
                          selectorGallSlice.dayNight ?
                          value.toLowerCase() === selectorGallSlice.colorActive
                            ? { backgroundColor: 'rgba(194, 212, 31, 0.801)' }
                            : { backgroundColor: 'rgb(122, 152, 206)' }
                            :
                          value.toLowerCase() === selectorGallSlice.colorActive
                            ? { backgroundColor: 'rgba(194, 212, 31, 0.801)' }
                            : { backgroundColor: 'var(--text-color)' }
                        }
                        onClick={clickButtonStyle}
                      >
                        {value === 'Classic' ? selectorGallSlice.settings.languageSelector === 'English' ? 'Classic' : 
                          selectorGallSlice.settings.languageSelector === 'Українська' ? 'Класика' : 
                          selectorGallSlice.settings.languageSelector === 'Polska' ? 'Klasyczny' : '' : 
                        value === 'Pop' ? selectorGallSlice.settings.languageSelector === 'English' ? 'Pop': 
                          selectorGallSlice.settings.languageSelector === 'Українська' ? 'Популярна' : 
                          selectorGallSlice.settings.languageSelector === 'Polska' ? 'Popularny' : '' : value}
                      </button>
                    </li>
                  ))
              : ''}

            {selectorUserPath.logicPath.arts['lirics'] 
              ? selectorGallSlice.users
                  .find(value => value.userName === selectorUserPath.logicPath.name)
                  .arts.lirics.style.map(value => (
                    <li key={nanoid()}>
                      <button
                        type="button"
                        name={value}
                        style={
                          selectorGallSlice.dayNight ?
                          value.toLowerCase() === selectorGallSlice.colorActive
                            ? { backgroundColor: 'rgba(194, 212, 31, 0.801)' }
                            : { backgroundColor: 'rgb(122, 152, 206)' }
                            :
                          value.toLowerCase() === selectorGallSlice.colorActive
                            ? { backgroundColor: 'rgba(194, 212, 31, 0.801)' }
                            : { backgroundColor: 'var(--text-color)' }  
                        }
                        onClick={clickButtonStyle}
                      >
                        {value === 'Poem' ? selectorGallSlice.settings.languageSelector === 'English' ? 'Poem' : 
                          selectorGallSlice.settings.languageSelector === 'Українська' ? 'Вірші' : 
                          selectorGallSlice.settings.languageSelector === 'Polska' ? 'Wiersz' : '' : 
                        value === 'Liric' ? selectorGallSlice.settings.languageSelector === 'English' ? 'Lyric': 
                          selectorGallSlice.settings.languageSelector === 'Українська' ? 'Лірика' : 
                          selectorGallSlice.settings.languageSelector === 'Polska' ? 'Liryczny' : '' : value}
                      </button>
                    </li>
                  ))
              : ''}
          </ul>
        </div>

        <div>
          <div className={ga.total}>

            <p className={ga.title} style={selectorGallSlice.dayNight ? {color: 'rgb(122, 152, 206)',} : {backgroundColor: ''}}>
            {selectorGallSlice.settings.languageSelector === 'English' ? 'Elements' : 
            selectorGallSlice.settings.languageSelector === 'Українська' ? 'Елементи' : 
            selectorGallSlice.settings.languageSelector === 'Polska' ? 'Elementy' : 'Elements'}
            </p>

            {location.pathname !== '/community' ? <div className={ga.selectall} onClick={selectAllHandle}>Select all</div> : ''}

            <p className={ga.title} style={selectorGallSlice.dayNight ? {color: 'rgb(122, 152, 206)',} : {backgroundColor: ''}}>{selectorGallSlice.itemsBuffer !== null && selectorGallSlice.itemsBuffer.length !== 0 ? 
              selectorGallSlice.settings.languageSelector === 'English' ? `total ${selectorGallSlice.itemsBuffer.length} pcs` : 
              selectorGallSlice.settings.languageSelector === 'Українська' ? `всього ${selectorGallSlice.itemsBuffer.length} шт` : 
              selectorGallSlice.settings.languageSelector === 'Polska' ? `razem ${selectorGallSlice.itemsBuffer.length} szt` : 'total'`${selectorGallSlice.itemsBuffer.length} pcs`:

              selectorGallSlice.settings.languageSelector === 'English' ? 'empty' : 
              selectorGallSlice.settings.languageSelector === 'Українська' ? `порожньо` : 
              selectorGallSlice.settings.languageSelector === 'Polska' ? `pusty` : 'empty'}</p>
            
          </div>
          
          <div className={ga.loadContainer}>
            {selectorGallSlice.load ? <Loader /> : ''}
          </div>
          <ul className={ga.listItems}>
            {selectorGallSlice.currentItemId === '' && selectorGallSlice.pageBuffer.length !== 0 && selectorGallSlice.itemsBuffer !== null ? (
              selectorGallSlice.pageBuffer[selectorGallSlice.pageQuantity.find(element => element.active === true).position].map(element => {
                return (
                  <li key={element.id} id={element.id} onMouseOver={changeBorderOver} onMouseOut={changeBorderOut} onClick={itemClickHandle} onDoubleClick={itemDoubleClickHandle} className={ga.item} style={selectorGallSlice.dayNight ? selectorGallSlice.selectedItems.includes(element.id) ? {boxShadow: 'inset 0 0 7px #b6b5b5, 0px 2px 1px rgba(16, 16, 24, 0.08), 0px 1px 1px rgba(46, 47, 66, 0.16), 0px 1px 3px 3px rgba(194, 212, 31, 0.8)', backgroundColor: 'rgb(122, 152, 206)'} 
                  : {boxShadow: 'inset 0 0 7px #b6b5b5, 0px 2px 1px rgba(16, 16, 24, 0.08), 0px 1px 1px rgba(46, 47, 66, 0.16), 0px 1px 6px rgba(46, 47, 66, 0.08)', backgroundColor: 'rgb(122, 152, 206)'}: selectorGallSlice.selectedItems.includes(element.id) ? {boxShadow: 'inset 0 0 7px #b6b5b5, 0px 2px 1px rgba(16, 16, 24, 0.08), 0px 1px 1px rgba(46, 47, 66, 0.16), 0px 1px 3px 3px rgba(194, 212, 31, 0.8)'} : {boxShadow: 'inset 0 0 7px #b6b5b5, 0px 2px 1px rgba(16, 16, 24, 0.08), 0px 1px 1px rgba(46, 47, 66, 0.16), 0px 1px 6px rgba(46, 47, 66, 0.08)'}} >
                    <Item data={element}/>
                  </li>
                );
              })
            ) : (
              <div className={ga.notResult}>
                <p>This section empty. Hurry up to load new elements!</p>{' '}
                <BlotImg className={ga.blotImg}/>
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