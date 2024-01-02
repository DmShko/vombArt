import { useSelector } from 'react-redux';

import noti from './NotificationLine.module.scss';

import { ReactComponent as NotiImg } from '../../images/message-text-1-svgrepo-com.svg';
import { ReactComponent as HeartiImg } from '../../images/noti-heart-svgrepo-com.svg';
import { ReactComponent as LevelImg } from '../../images/layer-svgrepo-com.svg';
import { ReactComponent as ErrorImg } from '../../images/error-svgrepo-com.svg';

const NotificationLine = () => {

  const selectorGallerySlice = useSelector(state => state.gallery);

  return (
    <div className={noti.container}>
        <NotiImg className={noti.heartItem} style={selectorGallerySlice.messagesBuffer !== undefined && selectorGallerySlice.mesBuffLength !== selectorGallerySlice.messagesBuffer.length ? {fill: 'yellowgreen'} : {fill: 'lightgray'}}/>
        <HeartiImg className={noti.notiItem}/>
        <LevelImg className={noti.notiItem}/>
        <ErrorImg className={noti.notiItem}/>
    </div>
  )
}

export default NotificationLine