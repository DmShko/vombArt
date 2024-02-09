import { React, useEffect, useRef}from 'react'
import { useSelector } from 'react-redux';
import { createPortal } from 'react-dom';

import moset from './ModalSettings.module.scss'

const modalRootSettings = document.querySelector('#root-modal-settings');

const ModalSettings = ({ children, data }) => {

  const selectorGallSlice = useSelector(state => state.gallery);

  const modal = useRef();

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    
    const timer = setTimeout(() => {
      data ? modal.current.style.right = '5px' : modal.current.style.right = '0';
    }, 100);

    return () => {
      document.body.style.overflow = 'scroll';
      clearTimeout(timer); 
    };
      // eslint-disable-next-line
  }, []);

  return createPortal(
   
    <div ref={modal}  className={moset.container} style={selectorGallSlice.dayNight ? {backgroundColor: '#485a94'} : {backgroundColor: ''}}>
        {children}
    </div>

    , modalRootSettings
  )
}

export default ModalSettings