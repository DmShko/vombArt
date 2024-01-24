import { React, useEffect }from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { createPortal } from 'react-dom';

import Chat from 'components/MageChat/Chat';

import { change } from 'vomgallStore/gallerySlice';

import mope from './ModalPersonal.module.scss'

const modalRootPersonal = document.querySelector('#root-modal-personal');

const ModalPersonal = ({ children, openClose }) => {

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

      // clear selected person
      dispatch(change({operation: 'changeSelectedPerson', data: ''}));

      //close modal window
      openClose();
    } 
  };

  return createPortal(
   
    <div className={mope.backdrop} style={{top: `${window.scrollY}px`,}} onClick={clickBackdrob}>
        <div className={mope.container} style={selectorGallSlice.dayNight ? {backgroundColor: '#485a94',} : {backgroundColor: '',}}>
            {children}
            <div className={mope.chatContainer}>
              <Chat className={mope.chat}/>
            </div> 
        </div>
    </div>, modalRootPersonal

  )
}

export default ModalPersonal