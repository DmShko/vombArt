import { useState } from 'react';

import NewItem from './NewItem/NewItem';
import Style from './Style/Style';

import { ReactComponent as AngelImgRight } from '../../../images/arrow-right-333-svgrepo-com.svg'
import { ReactComponent as AngelImgDown } from '../../../images/arrow-down-339-svgrepo-com.svg'


import mn from './Menu.module.scss';

const Menu = () => {

  const [buttonStyleState, setbuttonStyleState] = useState(false);
  const [buttonItemState, setbuttonItemState] = useState(false);
  const [buttonAngelStyle, setbuttonAngelStyle] = useState(false);
  const [buttonAngelNewItem, setbuttonAngelNewItem] = useState(false);

  const buttonToggle = ({ currentTarget }) => {
    
    if (currentTarget.name === 'style') {
      setbuttonAngelStyle(!buttonAngelStyle);

      setbuttonStyleState(!buttonStyleState);
    }
    if (currentTarget.name === 'item') {
      setbuttonAngelNewItem(!buttonAngelNewItem);

      setbuttonItemState(!buttonItemState);
    }
  };

  return (
    
    <div className={mn.container}>

      <button type='button' name='style' style={{ borderRadius: '6px', border: 'none', padding: '5px', cursor: 'pointer',}} onClick={buttonToggle}><div className={mn.butCont}>Add/Del style {buttonAngelStyle ? <AngelImgDown className={mn.img}/> : <AngelImgRight className={mn.img}/>}</div></button>
      {buttonStyleState ? <Style /> : ''}
      <button type='button' name='item' style={{ borderRadius: '6px', border: 'none', padding: '5px', cursor: 'pointer',}} onClick={buttonToggle}><div className={mn.butCont}>Add element {buttonAngelNewItem ? <AngelImgDown className={mn.img}/> : <AngelImgRight className={mn.img}/>}</div></button>
      {buttonItemState ? <NewItem /> : ''}
      <button type='button' style={{ borderRadius: '6px', border: 'none', padding: '5px', cursor: 'pointer',}}>Edit</button>
      <button type='button' className={mn.delete} style={{ borderRadius: '6px', border: 'none', padding: '5px', cursor: 'pointer',}}>Delete</button>
      
    </div>
  )
}

export default Menu