import { React, useEffect }from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { createPortal } from 'react-dom';

import Chat from 'components/MageChat/Chat';

import { change } from 'vomgallStore/gallerySlice';

import moit from './ModalItem.module.scss'

const modalRootItem = document.querySelector('#root-modal-item');

const ModalItem = ({ children, openClose }) => {

  const selectorGallSlice = useSelector(state => state.gallery);

  const dispatch = useDispatch();
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

    if (evt.target === evt.currentTarget){
      dispatch(change({ operation: 'updateAnswerId', data: '' }));
      openClose();
    } 
  };

  return createPortal(
   
    <div className={moit.backdrop} style={{top: `${window.scrollY}px`,}} onClick={clickBackdrob}>
        <div className={moit.container} style={selectorGallSlice.dayNight ? {backgroundColor: '#485a94',} : {backgroundColor: '',}}>
            {children}
            <div className={moit.chatContainer}>
              <Chat className={moit.chat}/>
            </div> 
        </div>
    </div>, modalRootItem

  )
}

export default ModalItem