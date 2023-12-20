import { React, useEffect, useRef }from 'react'
import { createPortal } from 'react-dom';

import moset from './ModalSettings.module.scss'

const modalRootSettings = document.querySelector('#root-modal-settings');

const ModalSettings = ({ children, data }) => {

  const modal = useRef();

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    
    const timer = setTimeout(() => {
      data ? modal.current.style.right = '35px' : modal.current.style.right = '0px';
    }, 100);

    return () => {
      document.body.style.overflow = 'scroll';
      clearTimeout(timer); 
    };
      // eslint-disable-next-line
  }, []);

  return createPortal(
   
    <div ref={modal}  className={moset.container}>
        {children}
    </div>

    , modalRootSettings
  )
}

export default ModalSettings