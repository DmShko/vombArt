import {React, useEffect }from 'react'
import { createPortal } from 'react-dom';

import mo from './Modal.module.scss'

const modalRoot = document.querySelector('#root-modal');

const ModalArt = ({ openClose, children }) => {

  // close modal window by 'Escape'
  const driveModal = evt => {
    if (evt.code === 'Escape') openClose();
  };

  const componentMount = () => {
    window.addEventListener('keydown', driveModal);
  };

  useEffect(() => {
    componentMount();
    return () => {
      window.removeEventListener('keydown', driveModal);
    };
   // eslint-disable-next-line
  }, []);

  // close modal window by click on backdrob
  const clickBackdrob = evt => {
    if (evt.target === evt.currentTarget) openClose(evt);
  };

  return createPortal(
    <div className={mo.backdrop} onClick={clickBackdrob}>
        <div className={mo.container}>
            {children}
        </div>
    </div>, modalRoot
  )
}

export default ModalArt