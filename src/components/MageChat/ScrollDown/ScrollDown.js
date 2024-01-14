import { useSelector } from 'react-redux';
import { ReactComponent as AngelImgDown } from '../../../images/arrow-down-339-svgrepo-com.svg'

import sd from './ScrollDown.module.scss'

const ScrollDown = ({ data, scrollDownDetect }) => {

  const selectorGallerySlice = useSelector(state => state.gallery);

  const scrollOn = () => {
    data();
  };

  return (
    <div className={sd.container} onClick={scrollOn} style={scrollDownDetect ? {backgroundColor: 'gray', animationIterationCount: 0, visibility: 'hidden'}: selectorGallerySlice.messagesBuffer !== undefined && selectorGallerySlice.mesBuffLength === selectorGallerySlice.messagesBuffer.length ? {backgroundColor: 'gray', animationIterationCount: 0, visibility: 'visible'} : {backgroundColor: 'rgba(194, 212, 31, 0.801)'}}>
        <AngelImgDown style={{width:'30px', height:'30px'}}/>
    </div>
  )
}

export default ScrollDown