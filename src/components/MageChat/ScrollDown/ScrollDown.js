import { useSelector } from 'react-redux';
import { ReactComponent as AngelImgDown } from '../../../images/arrow-down-339-svgrepo-com.svg'

import sd from './ScrollDown.module.scss'

const ScrollDown = ({ data, scrollDownDetect, messageElement }) => {

  const selectorGallerySlice = useSelector(state => state.gallery);

  const scrollOn = () => {

    data();
  };

  return (
    <div className={sd.container} onClick={scrollOn} style={scrollDownDetect ? {backgroundColor: 'gray', animationIterationCount: 0}:messageElement.current !== null && messageElement.current !== undefined && selectorGallerySlice.messagesBuffer.length * messageElement.current.offsetHeight <= 200 ? {backgroundColor: 'gray', animationIterationCount: 0} : {backgroundColor: 'lightgreen'}}>
        <AngelImgDown style={{width:'30px', height:'30px'}}/>
    </div>
  )
}

export default ScrollDown