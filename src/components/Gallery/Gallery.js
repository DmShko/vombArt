import { useSelector, useDispatch } from 'react-redux'
import { useState } from 'react';
import { nanoid } from 'nanoid';
import ga from './Gallery.module.scss'

import { changePath } from 'vomgallStore/pathSlice';

const Gallery = () => {

  const dispatch = useDispatch();
  const selectorUserArt = useSelector(state => state.gallery);
  const selectorUserPath = useSelector(state => state.path);

  const [drawVisible, setDrawVisible] = useState(true);
  const [musicVisible, setMusicVisible] = useState(false);
  const [liricsVisible, setLiricsVisible] = useState(false);

  // handler arts button click
  const clickButtonArts = ({ target }) => {
   
    switch(target.name) {
      case 'Lirics': 
        // visibility 'Lirics' on
        setLiricsVisible(true);

        // visibility ather reset
        setDrawVisible(false);
        setMusicVisible(false);

        dispatch(changePath({changeElement: 'arts.lirics', data: true}));

        // reset another value
        dispatch(changePath({changeElement: 'arts.music', data: false}));
        dispatch(changePath({changeElement: 'arts.drawing', data: false}));
        break;
      case 'Music': 

        // visibility 'Music' on
        setMusicVisible(true);

        // visibility ather reset
        setDrawVisible(false);
        setLiricsVisible(false);

        dispatch(changePath({changeElement: 'arts.music', data: true}));

        // reset another value
        dispatch(changePath({changeElement: 'arts.lirics', data: false}));
        dispatch(changePath({changeElement: 'arts.drawing', data: false}));
        break;
      case 'Drawing': 

        // visibility 'Drawing' on
        setDrawVisible(true);

        // visibility ather reset
        setMusicVisible(false);
        setLiricsVisible(false);

        dispatch(changePath({changeElement: 'arts.drawing', data: true}));

        // reset another value
        dispatch(changePath({changeElement: 'arts.lirics', data: false}));
        dispatch(changePath({changeElement: 'arts.music', data: false}));
        break;
      default: break;
    };
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
    <div className={ga.comtainer}>
      
        <div className={ga.arts}>
            <button type='button' style={selectorUserPath.logicPath.arts.lirics ? {backgroundColor: 'rgba(194, 212, 31, 0.801)'} : {backgroundColor: 'rgba(209, 209, 209, 0.522)'}} name='Lirics' onClick={clickButtonArts}>Lirics</button>
            <button type='button' style={selectorUserPath.logicPath.arts.music ? {backgroundColor: 'rgba(194, 212, 31, 0.801)'} : {backgroundColor: 'rgba(209, 209, 209, 0.522)'}} name='Music' onClick={clickButtonArts}>Music</button>
            <button type='button' style={selectorUserPath.logicPath.arts.drawing ? {backgroundColor: 'rgba(194, 212, 31, 0.801)'} : {backgroundColor: 'rgba(209, 209, 209, 0.522)'}} name='Drawing' onClick={clickButtonArts}>Drawing</button>
        </div>
        
        <div>
          <div >
            <ul className={ga.style}>
              {

                drawVisible ? selectorUserArt.users.find(value => value.name === 'Admin').arts.draw.style.map(value => 
                  <li key={nanoid()}><button type='button' name={value} onClick={clickButtonStyle}>{value}</button></li> 
                ) : ''} 
              {
                musicVisible ? selectorUserArt.users.find(value => value.name === 'Admin').arts.music.style.map(value => 
                  <li key={nanoid()}><button type='button' name={value} onClick={clickButtonStyle}>{value}</button></li> 
                ) : ''} 

              { liricsVisible ? selectorUserArt.users.find(value => value.name === 'Admin').arts.lirics.style.map(value => 
                  <li key={nanoid()}><button type='button' name={value} onClick={clickButtonStyle}>{value}</button></li> 
                ) : ''
              }
            </ul> 
          </div>
        </div>

    </div>
  )
}

export default Gallery