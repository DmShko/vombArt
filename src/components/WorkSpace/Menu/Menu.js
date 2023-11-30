import { useState } from 'react';

import NewItem from './NewItem/NewItem';
import Style from './Style/Style';

import mn from './Menu.module.scss';

const Menu = () => {

  const [buttonStyleState, setbuttonStyleState] = useState(false);
  const [buttonItemState, setbuttonItemState] = useState(false);

  const buttonToggle = ({ target }) => {

    target.name === 'style' ? setbuttonStyleState(!buttonStyleState) : setbuttonItemState(!buttonItemState);
  };

  return (
    
    <div className={mn.container}>

      <button type='button' name='style' style={{ borderRadius: '6px', border: 'none', padding: '5px', cursor: 'pointer',}} onClick={buttonToggle}>Add/Del style</button>
      {buttonStyleState ? <Style /> : ''}
      <button type='button' name='item' style={{ borderRadius: '6px', border: 'none', padding: '5px', cursor: 'pointer',}} onClick={buttonToggle}>Add item</button>
      {buttonItemState ? <NewItem /> : ''}
      <button type='button' style={{ borderRadius: '6px', border: 'none', padding: '5px', cursor: 'pointer',}}>Edit</button>
      <button type='button' className={mn.delete} style={{ borderRadius: '6px', border: 'none', padding: '5px', cursor: 'pointer',}}>Delete</button>
      
    </div>
  )
}

export default Menu