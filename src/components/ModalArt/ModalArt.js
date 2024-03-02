import {React, useEffect }from 'react'
import { createPortal } from 'react-dom';

import { ReactComponent as CloseImg } from '../../images/close-circle-svgrepo-com.svg';

import mo from './Modal.module.scss'

const modalRoot = document.querySelector('#root-modal');

const ModalArt = ({ openClose, children }) => {

  // close modal window by 'Escape'
  const driveModal = evt => {
    if (evt.code === 'Escape') openClose();
  };

  const componentMount = () => {
    window.addEventListener('keydown', driveModal);
    document.body.style.overflow = 'hidden'
  };

  useEffect(() => {
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

  // close modal window by click on closeButton
  const clickCloseButton = evt => {
    openClose();
  };

  return createPortal(
    <div className={mo.backdrop} style={{top: `${window.scrollY}px`}} onClick={clickBackdrob}>
        <div className={mo.container}>
            <div style={{display: 'flex', width: '90%', justifyContent: 'flex-end', alignItems: 'center',}}>
              <CloseImg style={{width: '25px', height: '25px', margin: '5px 0', cursor: 'pointer'}} onClick={clickCloseButton}/></div>
            {children}
        </div>
    </div>, modalRoot
  )
}

export default ModalArt