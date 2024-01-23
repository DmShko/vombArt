import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import noti from './NotificationLine.module.scss';

import { ReactComponent as NotiImg } from '../../images/message-text-1-svgrepo-com.svg';
import { ReactComponent as NotiImgDarck } from '../../images/message-text-1-svgrepo-com-darck.svg';
import { ReactComponent as HeartiImg } from '../../images/noti-heart-svgrepo-com.svg';
import { ReactComponent as HeartiImgDarck } from '../../images/noti-heart-svgrepo-com-darck.svg';
import { ReactComponent as HeartiImgLight } from '../../images/noti-heart-svgrepo-com-light.svg';
import { ReactComponent as LevelImg } from '../../images/layer-svgrepo-com.svg';
import { ReactComponent as ErrorImg } from '../../images/error-svgrepo-com.svg';
import { ReactComponent as ErrorImgDarck } from '../../images/error-svgrepo-com-darck.svg';

const NotificationLine = () => {

  const selectorGallerySlice = useSelector(state => state.gallery);

  const [newHeart, setNewHeart] = useState(false);
  const [newLevel, setNewLevel] = useState(false);

  useEffect(() => {

    setNewHeart(true);

    const heartBlink = setTimeout(() => {
      setNewHeart(false);
    }, 300);

    return () => clearTimeout(heartBlink);

  },[selectorGallerySlice.heartsStatistic]);

  useEffect(() => {

    setNewLevel(true);

    const levelBlink = setTimeout(() => {
      setNewLevel(false);
    }, 300);

    return () => clearTimeout(levelBlink);

  },[selectorGallerySlice.levelStatistic]);

  return (
    <div className={noti.container} style={selectorGallerySlice.dayNight ? {backgroundColor: '#384a83'} : {backgroundColor: 'lightgray'}}>
        {selectorGallerySlice.dayNight ? <NotiImgDarck className={noti.heartItem} style={selectorGallerySlice.messagesBuffer !== undefined && selectorGallerySlice.mesBuffLength !== selectorGallerySlice.messagesBuffer.length ? {fill: 'yellowgreen'} : {fill: 'lightgray'}}/>
        : <NotiImg className={noti.heartItem} style={selectorGallerySlice.messagesBuffer !== undefined && selectorGallerySlice.mesBuffLength !== selectorGallerySlice.messagesBuffer.length ? {fill: 'yellowgreen'} : {fill: 'lightgray'}}/>}
        {selectorGallerySlice.dayNight ? newHeart ? <HeartiImgLight className={noti.notiItem}/> : <HeartiImgDarck className={noti.notiItem}/>: newHeart ? <HeartiImgLight className={noti.notiItem}/> : <HeartiImg className={noti.notiItem}/>}
        <LevelImg className={noti.notiItem} style={selectorGallerySlice.dayNight ? newLevel ? {fill: 'goldenrod'} : {fill: 'rgb(122, 152, 206)'} : newLevel ? {fill: 'goldenrod'} : {fill: ''}}/>
        {selectorGallerySlice.dayNight ? <ErrorImgDarck className={noti.notiItem}/> : <ErrorImg className={noti.notiItem}/>}
    </div>
  )
}

export default NotificationLine