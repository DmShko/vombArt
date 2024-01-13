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

          if(selectorGallSlice.selectedItems.length !== 0) {
          
            for(let s=0; s < selectorGallSlice.selectedItems.length; s += 1){

              // delete item from DB (write 'null')
              writeUserData(
                `${path}${selectorGallSlice.selectedItems[s]}`,
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

  return (
    
    <div className={mn.container}>
      <p style={{fontSize: '20px', fontWeight: '600',}}>{selectorSingInSlice.singInId !== '' ? selectorGallSlice.users.find(element => element.uid === selectorSingInSlice.singInId).userName : ''}</p>
      <img src={`${selectorSingInSlice.isSingIn ? selectorGallSlice.users.find(element => element.uid === selectorSingInSlice.singInId).urlFoto : ''}`} style={{width: '80px', height: '80px', borderRadius: '50%'}} alt='current user foto'></img>
      <button type='button' name='style' style={{ borderRadius: '6px', border: 'none', padding: '5px', cursor: 'pointer',}} onClick={buttonToggle}><div className={mn.butCont}>Add/Del style {buttonAngelStyle ? <AngelImgDown className={mn.img}/> : <AngelImgRight className={mn.img}/>}</div></button>
      {buttonStyleState ? <Style /> : ''}
      <button type='button' name='item' style={{ borderRadius: '6px', border: 'none', padding: '5px', cursor: 'pointer',}} onClick={buttonToggle}><div className={mn.butCont}>Add element {buttonAngelNewItem ? <AngelImgDown className={mn.img}/> : <AngelImgRight className={mn.img}/>}</div></button>
      {buttonItemState ? <NewItem /> : ''}
      {selectorGallSlice.selectedItems.length !== 0 && selectorGallSlice.selectedItems.length === 1 ? <button type='button' className={mn.edit} name='edit' style={{ borderRadius: '6px', border: 'none', padding: '5px', cursor: 'pointer',}} onClick={buttonToggle}><div className={mn.butCont}>Edit {buttonAngelEdit ? <AngelImgDown className={mn.img}/> : <AngelImgRight className={mn.img}/>}</div></button> : ''}
      {buttonEditState && selectorGallSlice.selectedItems.length === 1 ? <Edit /> : ''}
      {selectorGallSlice.selectedItems.length !== 0 ? <button type='button' className={mn.delete} name='delete'style={{ borderRadius: '6px', border: 'none', padding: '5px', cursor: 'pointer',}} onClick={deleteItems}>Delete </button> : ''}
      
    </div>
  )
}

export default Menu