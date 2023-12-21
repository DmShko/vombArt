import { useState } from 'react';
import { useSelector } from 'react-redux';

import NewItem from './NewItem/NewItem';
import Style from './Style/Style';
import Edit from './Edit/Edit';

import { ReactComponent as AngelImgRight } from '../../../images/arrow-right-333-svgrepo-com.svg'
import { ReactComponent as AngelImgDown } from '../../../images/arrow-down-339-svgrepo-com.svg'

import Notiflix from 'notiflix';

import mn from './Menu.module.scss';

const Menu = () => {

  const selectorGallSlice = useSelector(state => state.gallery);

  const [buttonStyleState, setButtonStyleState] = useState(false);
  const [buttonItemState, setButtonItemState] = useState(false);
  const [buttonAngelStyle, setButtonAngelStyle] = useState(false);
  const [buttonAngelNewItem, setButtonAngelNewItem] = useState(false);
  const [buttonEditState, setButtonEditState] = useState(false);
  const [buttonAngelEdit, setButtonAngelEdit] = useState(false);



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

  const deleteItems = () => {
    Notiflix.Confirm.show(
      'Confirm',
      'The files you selected will be deleted! Are you sure?',
      'Yes',
      'No',
      () => {
      alert('Thank you.');
      },
      () => {
      alert('If you say so...');
      },
      {
      },
      );
  };

  return (
    
    <div className={mn.container}>

      <button type='button' name='style' style={{ borderRadius: '6px', border: 'none', padding: '5px', cursor: 'pointer',}} onClick={buttonToggle}><div className={mn.butCont}>Add/Del style {buttonAngelStyle ? <AngelImgDown className={mn.img}/> : <AngelImgRight className={mn.img}/>}</div></button>
      {buttonStyleState ? <Style /> : ''}
      <button type='button' name='item' style={{ borderRadius: '6px', border: 'none', padding: '5px', cursor: 'pointer',}} onClick={buttonToggle}><div className={mn.butCont}>Add element {buttonAngelNewItem ? <AngelImgDown className={mn.img}/> : <AngelImgRight className={mn.img}/>}</div></button>
      {buttonItemState ? <NewItem /> : ''}
      {selectorGallSlice.selectedItems.length !== 0 && selectorGallSlice.selectedItems.length === 1 ? <button type='button' className={mn.edit} name='edit' style={{ borderRadius: '6px', border: 'none', padding: '5px', cursor: 'pointer',}} onClick={buttonToggle}><div className={mn.butCont}>Edit {buttonAngelEdit ? <AngelImgDown className={mn.img}/> : <AngelImgRight className={mn.img}/>}</div></button> : ''}
      {buttonEditState && selectorGallSlice.selectedItems.length === 1 ? <Edit /> : ''}
      {selectorGallSlice.selectedItems.length !== 0 ? <button type='button' className={mn.delete} name='delete' style={{ borderRadius: '6px', border: 'none', padding: '5px', cursor: 'pointer',}} onClick={deleteItems}>Delete </button> : ''}
      
    </div>
  )
}

export default Menu