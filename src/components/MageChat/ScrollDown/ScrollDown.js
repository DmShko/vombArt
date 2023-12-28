import { ReactComponent as AngelImgDown } from '../../../images/arrow-down-339-svgrepo-com.svg'

import sd from './ScrollDown.module.scss'

const ScrollDown = ({ data, scrollDownDetect }) => {

  const scrollOn = () => {
    data();
  };

  return (
    <div className={sd.container} onClick={scrollOn} style={scrollDownDetect ? {backgroundColor: 'gray'} : {backgroundColor: 'lightgreen'}}>
        <AngelImgDown style={{width:'30px', height:'30px'}}/>
    </div>
  )
}

export default ScrollDown