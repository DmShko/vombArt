import { React, useEffect }from 'react'
import { createPortal } from 'react-dom';

import Chat from 'components/MageChat/Chat';

import moit from './ModalItem.module.scss'

const modalRootItem = document.querySelector('#root-modal-item');

const ModalItem = ({ children, openClose }) => {

  // close modal window by 'Escape'
  const driveModal = evt => {
    if (evt.code === 'Escape') openClose();
  };

  const componentMount = () => {
    window.addEventListener('keydown', driveModal);
    document.body.style.overflow = 'hidden'
  };

  useEffect(() => {

    // add listener for close windows
    componentMount();
    return () => {
      window.removeEventListener('keydown', driveModal);
      document.body.style.overflow = 'scroll'
    };
   // eslint-disable-next-line
  }, []);

  // close modal window by click on backdrob
  const clickBackdrob = evt => {
    if (evt.target === evt.currentTarget) openClose();
  };

  return createPortal(
   
    <div className={moit.backdrop} onClick={clickBackdrob}>
        <div className={moit.container}>
            {children}
            <div className={moit.chatContainer}><Chat className={moit.chat}/></div> 
        </div>
    </div>, modalRootItem

  )
}

export default ModalItem