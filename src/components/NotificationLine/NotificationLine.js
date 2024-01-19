import { useSelector } from 'react-redux';

import noti from './NotificationLine.module.scss';

import { ReactComponent as NotiImg } from '../../images/message-text-1-svgrepo-com.svg';
import { ReactComponent as NotiImgDarck } from '../../images/message-text-1-svgrepo-com-darck.svg';
import { ReactComponent as HeartiImg } from '../../images/noti-heart-svgrepo-com.svg';
import { ReactComponent as HeartiImgDarck } from '../../images/noti-heart-svgrepo-com-darck.svg';
import { ReactComponent as LevelImg } from '../../images/layer-svgrepo-com.svg';
import { ReactComponent as ErrorImg } from '../../images/error-svgrepo-com.svg';
import { ReactComponent as ErrorImgDarck } from '../../images/error-svgrepo-com-darck.svg';

const NotificationLine = () => {

  const selectorGallerySlice = useSelector(state => state.gallery);

  return (
    <div className={noti.container} style={selectorGallerySlice.dayNight ? {backgroundColor: '#384a83'} : {backgroundColor: 'lightgray'}}>
        {selectorGallerySlice.dayNight ? <NotiImgDarck className={noti.heartItem} style={selectorGallerySlice.messagesBuffer !== undefined && selectorGallerySlice.mesBuffLength !== selectorGallerySlice.messagesBuffer.length ? {fill: 'yellowgreen'} : {fill: 'lightgray'}}/>
        : <NotiImg className={noti.heartItem} style={selectorGallerySlice.messagesBuffer !== undefined && selectorGallerySlice.mesBuffLength !== selectorGallerySlice.messagesBuffer.length ? {fill: 'yellowgreen'} : {fill: 'lightgray'}}/>}
        {selectorGallerySlice.dayNight ? <HeartiImgDarck className={noti.notiItem}/> : <HeartiImg className={noti.notiItem}/>}
        <LevelImg className={noti.notiItem} style={selectorGallerySlice.dayNight ? {fill: 'rgb(122, 152, 206)'} : {fill: ''}}/>
        {selectorGallerySlice.dayNight ? <ErrorImgDarck className={noti.notiItem}/> : <ErrorImg className={noti.notiItem}/>}
    </div>
  )
}

export default NotificationLine