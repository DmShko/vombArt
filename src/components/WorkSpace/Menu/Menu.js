import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import NewItem from './NewItem/NewItem';
import Style from './Style/Style';
import Edit from './Edit/Edit';

import writeUserData from 'API/writerDB';
import deleteStorAPI from 'API/deleteStorageAPI';
import { change } from 'vomgallStore/gallerySlice';
import { changeDelete } from 'vomgallStore/deleteSlice';
import { changeItemsMetaData } from 'vomgallStore/getMetaSlice';
import { getDatabase, ref, onValue } from 'firebase/database';

import { ReactComponent as AngelImgRight } from '../../../images/arrow-right-333-svgrepo-com.svg'
import { ReactComponent as AngelImgDown } from '../../../images/arrow-down-339-svgrepo-com.svg'

import Notiflix from 'notiflix';
import pathCreator from '../../MageChat/pathCreator/pathCreator';

import mn from './Menu.module.scss';

const Menu = () => {

  const dispatch = useDispatch();

  const selectorGallSlice = useSelector(state => state.gallery);
  const selectorSingInSlice = useSelector(state => state.singIn);
  const pathSelector = useSelector(state => state.path.logicPath);
  const selectorItemsMetaFullPath = useSelector(state => state.getMeta);
  const selectorDeleteSlice = useSelector(state => state.deleteStorage);


  const [buttonStyleState, setButtonStyleState] = useState(false);
  const [buttonItemState, setButtonItemState] = useState(false);
  const [buttonAngelStyle, setButtonAngelStyle] = useState(false);
  const [buttonAngelNewItem, setButtonAngelNewItem] = useState(false);
  const [buttonEditState, setButtonEditState] = useState(false);
  const [buttonAngelEdit, setButtonAngelEdit] = useState(false);

  // first start update itemsMetaData from DB
  useEffect(() => {

    const path = selectorGallSlice.users.find(element => element.uid === selectorSingInSlice.singInId).userName

    const db = getDatabase();
    const starCountRef = ref(db, `${path}/FullPaths`);

      //firebase listener function
      onValue(starCountRef, snapshot => {
        // load data from database
        const data = snapshot.val();

        if(data !== null) dispatch(changeItemsMetaData({operation: 'updateMetaData', data: data}));
      });
  // eslint-disable-next-line    
  }, []);

  useEffect(() => {
    // update itemsMetaData in DB
    if(selectorItemsMetaFullPath.itemsMetaData !== undefined && selectorItemsMetaFullPath.itemsMetaData !== null) {
      // first start brauser memory is clined
      if(selectorItemsMetaFullPath.itemsMetaData.length !== 0) {
        const path = selectorGallSlice.users.find(element => element.uid === selectorSingInSlice.singInId).userName 
     
        writeUserData(
          `${path}/FullPaths`,
          selectorItemsMetaFullPath.itemsMetaData,
          null, true
        );
      }

      if(selectorItemsMetaFullPath.itemsMetaData.length === 0 && selectorDeleteSlice.ifDeleteAll) {
        const path = selectorGallSlice.users.find(element => element.uid === selectorSingInSlice.singInId).userName 
     
        writeUserData(
          `${path}/FullPaths`,
          selectorItemsMetaFullPath.itemsMetaData,
          null, true
        );

      }
      
    }
  // eslint-disable-next-line
  }, [selectorItemsMetaFullPath.itemsMetaData]);

  const buttonToggle = ({ currentTarget }) => {
    
    if (currentTarget.name === 'style') {
      setButtonAngelStyle(!buttonAngelStyle);

      setButtonStyleState(!buttonStyleState);
    }
    if (currentTarget.name === 'item') {
      setButtonAngelNewItem(!buttonAngelNewItem);

      setButtonItemState(!buttonItemState);
    }
    if (currentTarget.name === 'edit') {
      setButtonAngelEdit(!buttonAngelEdit);

      setButtonEditState(!buttonEditState);
    }
    
  };

  // retun true if element contain true
  const findProperty = data => {
    for (const key in data) {
      if (data[key] === true) {
        return true;
      }
    }
  };

  const deleteItems = () => {
    Notiflix.Confirm.show(
      'Confirm',
      'The files you selected will be deleted! Are you sure?',
      'Yes',
      'No',
      () => {

        // check selected arts and style
        if (findProperty(pathSelector.arts) && findProperty(pathSelector.style)) {
          // create items tree
          const path = pathCreator({
            pathSelector,
            section: 'items',
            contents: 'elements',
            write: false,
            users: selectorGallSlice.users,
            userIsSingInId: selectorSingInSlice.singInId
          });

          const pathMess = pathCreator({pathSelector, section: 'chats', contents: `elements/messages/`, write: false, users: selectorGallSlice.users, userIsSingInId: selectorSingInSlice.singInId});

          if(selectorGallSlice.selectedItems.length !== 0) {
          
            for(let s=0; s < selectorGallSlice.selectedItems.length; s += 1){

              // delete item from DB (write 'null')
              writeUserData(
                `${path}${selectorGallSlice.selectedItems[s]}`,
                null,
                selectorGallSlice.date, true
              );

              // clear itemsMesagesBuffer
              dispatch(change({ operation: 'changeItemsMessage', data: [] }));

              // delete all item messages from DB (write 'null')
              writeUserData(
                `${pathMess}/${selectorGallSlice.selectedItems[s]}`,
                null,
                selectorGallSlice.date, true
              );

              /* ****delete item statistic**** */

              // delete view statistic
              dispatch(change({operation: 'changeViewsStatistic', mode: 'deleteView',
              data: selectorGallSlice.selectedItems[s]}));

              // delete level statistic
              dispatch(change({operation: 'changeLevelStatistic', mode: 'deleteLevel',
              data: selectorGallSlice.selectedItems[s]}));

              // delete herats statistic
              dispatch(change({operation: 'changeHeartsStatistic', mode: 'deleteHeart',
              data: {item: selectorGallSlice.selectedItems[s], user: selectorSingInSlice.singInId}}));

              /* ****delete item statistic**** */  
              
              // delete file from storege
              dispatch(deleteStorAPI(`${path}${selectorGallSlice.selectedItems[s]}`));

              // clear element full path
              dispatch(changeItemsMetaData({operation: 'deleteElement', data: selectorGallSlice.selectedItems[s]}));

            }

            // clear 'ifDeleteAll'. Then success message will view once 
            dispatch(changeDelete({operation: 'setifDeleteAll', data: true}));

            // clear 'selectedItems'
            dispatch(change({operation: 'updateSelectedItems', data: []}));
          };
        
        };  

      },
      () => {
      
      },
      {
      },
      );
  };

  const changeBorderOver = (evt) => {
    
    if(evt.currentTarget.name === 'delete') {
      evt.currentTarget.style.backgroundColor =  'rgba(212, 99, 7, 0.801)';
    
    } else {
      evt.currentTarget.style.backgroundColor =  'rgba(194, 212, 31, 0.801)';
    } 

  };

  const changeBorderOut = (evt) => {

    if(selectorGallSlice.dayNight) evt.currentTarget.style.backgroundColor =  'rgb(122, 152, 206)';
    if(!selectorGallSlice.dayNight) evt.currentTarget.style.backgroundColor =  '';
    
  };

  return (
    
    <div className={mn.container} style={selectorGallSlice.dayNight ? {backgroundColor: 'rgb(72, 90, 148)'} : {backgroundColor: 'white'}}>
      <p style={selectorGallSlice.dayNight ? {fontSize: '30px', fontWeight: '600', fontFamily: 'Agbalumo', color: 'rgb(122, 152, 206)'} : {fontSize: '30px', fontWeight: '600', fontFamily: 'Agbalumo',}}>{selectorSingInSlice.singInId !== '' ? selectorGallSlice.users.find(element => element.uid === selectorSingInSlice.singInId).userName : ''}</p>
      <img src={`${selectorSingInSlice.isSingIn ? selectorGallSlice.users.find(element => element.uid === selectorSingInSlice.singInId).urlFoto : ''}`} style={{width: '80px', height: '80px', borderRadius: '50%'}} alt='current user foto'></img>
      <button type='button' name='style' onMouseOver={changeBorderOver} onMouseOut={changeBorderOut} style={selectorGallSlice.dayNight ? {backgroundColor: 'rgb(122, 152, 206)', borderRadius: '6px', border: 'none', padding: '5px', cursor: 'pointer',} 
      : { borderRadius: '6px', border: 'none', padding: '5px', cursor: 'pointer',}} onClick={buttonToggle}><div className={mn.butCont}>
       {selectorGallSlice.settings.languageSelector === 'English' ? <p>Add/Del style</p> : 
          selectorGallSlice.settings.languageSelector === 'Українська' ? <p>Дод./Вид. стиль</p> : 
          selectorGallSlice.settings.languageSelector === 'Polska' ? <p>Dod./Usuw. styl</p> : <p>Add/Del style</p>}
        {buttonAngelStyle ? <AngelImgDown className={mn.img}/> : <AngelImgRight className={mn.img}/>}</div></button>
      {buttonStyleState ? <Style /> : ''}

      <button type='button' name='item' onMouseOver={changeBorderOver} onMouseOut={changeBorderOut} style={selectorGallSlice.dayNight ? {backgroundColor: 'rgb(122, 152, 206)', borderRadius: '6px', border: 'none', padding: '5px', cursor: 'pointer',} 
      : {borderRadius: '6px', border: 'none', padding: '5px', cursor: 'pointer',}} onClick={buttonToggle}><div className={mn.butCont}>
        {selectorGallSlice.settings.languageSelector === 'English' ? <p>Add element </p> : 
          selectorGallSlice.settings.languageSelector === 'Українська' ? <p>Додати елемент</p> : 
          selectorGallSlice.settings.languageSelector === 'Polska' ? <p>Dodaj element</p> : <p>Add element </p>}
      {buttonAngelNewItem ? <AngelImgDown className={mn.img}/> : <AngelImgRight className={mn.img}/>}</div></button>
      {buttonItemState ? <NewItem /> : ''}

      {selectorGallSlice.selectedItems.length !== 0 && selectorGallSlice.selectedItems.length === 1 ? <button type='button' className={mn.edit} onMouseOver={changeBorderOver} onMouseOut={changeBorderOut} name='edit' style={selectorGallSlice.dayNight ? {backgroundColor: 'rgb(122, 152, 206)', borderRadius: '6px', border: 'none', padding: '5px', cursor: 'pointer',} 
      : { borderRadius: '6px', border: 'none', padding: '5px', cursor: 'pointer',}} onClick={buttonToggle}><div className={mn.butCont}>
        {selectorGallSlice.settings.languageSelector === 'English' ? <p>Edit </p> : 
          selectorGallSlice.settings.languageSelector === 'Українська' ? <p>Редагувати</p> : 
          selectorGallSlice.settings.languageSelector === 'Polska' ? <p>Edytować</p> : <p>Edit </p>}
      {buttonAngelEdit ? <AngelImgDown className={mn.img}/> : <AngelImgRight className={mn.img}/>}</div></button> : ''}
      {buttonEditState && selectorGallSlice.selectedItems.length === 1 ? <Edit /> : ''}
      {selectorGallSlice.selectedItems.length !== 0 ? <button type='button' className={mn.delete} onMouseOver={changeBorderOver} onMouseOut={changeBorderOut} name='delete' style={selectorGallSlice.dayNight ? {backgroundColor: 'rgb(122, 152, 206)', borderRadius: '6px', border: 'none', padding: '5px', cursor: 'pointer',} 
      : { borderRadius: '6px', border: 'none', padding: '5px', cursor: 'pointer',}} onClick={deleteItems}>
        {selectorGallSlice.settings.languageSelector === 'English' ? <p>Delete </p> : 
          selectorGallSlice.settings.languageSelector === 'Українська' ? <p>Видалити</p> : 
          selectorGallSlice.settings.languageSelector === 'Polska' ? <p>Usunąć</p> : <p>Delete </p>} 
      </button> : ''}
      
    </div>
  )
}

export default Menu