import { useSelector } from 'react-redux';
import { ReactComponent as LetterDown } from '../../../images/mail-svgrepo-com.svg'

import sd from './ScrollDown.module.scss'

const ScrollDown = ({ data, scrollDownDetect }) => {

  const selectorGallerySlice = useSelector(state => state.gallery);

  const scrollOn = () => {
    data();
  };

  return (
    <div className={sd.container} onClick={scrollOn} style={scrollDownDetect ? {backgroundColor: 'lightgray', animationIterationCount: 0, visibility: 'hidden'}: selectorGallerySlice.messagesBuffer !== undefined && selectorGallerySlice.mesBuffLength === selectorGallerySlice.messagesBuffer.length ? {backgroundColor: 'lightgray', animationIterationCount: 0, visibility: 'visible'} : {backgroundColor: 'rgba(194, 212, 31, 0.801)'}}>
        <LetterDown style={{width:'35px', height:'35px'}}/>
    </div>
  )
}

export default ScrollDown