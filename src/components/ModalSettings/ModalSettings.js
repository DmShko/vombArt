import { React, useEffect, useRef }from 'react'
import { createPortal } from 'react-dom';

import moset from './ModalSettings.module.scss'

const modalRootSettings = document.querySelector('#root-modal-settings');

const ModalSettings = ({ children }) => {

  const modal = useRef();

  useEffect(() => {
    document.body.style.overflow = 'hidden'

    modal.current.style.top = '70px';

    return () => {
      document.body.style.overflow = 'scroll';
          
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