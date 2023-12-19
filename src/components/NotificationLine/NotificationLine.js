
import noti from './NotificationLine.module.scss';

import { ReactComponent as NotiImg } from '../../images/message-text-1-svgrepo-com.svg';
import { ReactComponent as HeartiImg } from '../../images/noti-heart-svgrepo-com.svg';
import { ReactComponent as LevelImg } from '../../images/layer-svgrepo-com.svg';
import { ReactComponent as ErrorImg } from '../../images/error-svgrepo-com.svg';

const NotificationLine = () => {
  return (
    <div className={noti.container}>
        <NotiImg style={{width: '25px', height: '25px'}}/>
        <HeartiImg style={{width: '25px', height: '25px', fill: 'white'}}/>
        <LevelImg style={{width: '25px', height: '25px', fill: 'white'}}/>
        <ErrorImg style={{width: '25px', height: '25px', fill: 'white'}}/>
    </div>
  )
}

export default NotificationLine