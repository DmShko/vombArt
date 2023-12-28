import { useDispatch } from 'react-redux';

import { ReactComponent as BackImg } from '../../../images/back-square-svgrepo-com.svg';

import me from './MessageItem.module.scss'

import { change } from 'vomgallStore/gallerySlice';

const MessageItem = ({ data }) => {

  const dispatch = useDispatch();

  const answer = data.answerStatus;

  const answerButtonHandle = () => {

    dispatch(change({ operation: 'updateAnswerId', data: data.id }));

  };

  return (
     
      <div className={me.container}>
        {!answer ? 
        <>
          <div className={me.title}>
            
            <div className={me.stamp}>
              <p>{data.name}</p>
              <p style={{ color: 'blue', fontSize: '14px',}}>{data.date}</p>
              <p style={{ color: 'blue',fontSize: '14px', }}>{`${data.time}:${data.second}`}</p>
            </div>
            <BackImg className={me.svg} style={{width: '25px', height: '25px',}} onClick={answerButtonHandle}/>
          </div>
          <p>{data.message}</p>
        </> : 
        <>
          <div className={me.title}>
            <div className={me.stamp}>
              <p>{data.name}</p>
              <p style={{ color: 'blue', fontSize: '14px',}}>{data.date}</p>
              <p style={{ color: 'blue',fontSize: '14px', }}>{`${data.time}:${data.second}`}</p>
            </div>
            <BackImg className={me.svg} style={{width: '25px', height: '25px',}} onClick={answerButtonHandle}/>
          </div>
         
          <div className={me.answerStamp}>
            <p className={me.answerStyle}>{data.nameAnswer}</p>
            <p className={me.answerStyle}>{data.dateAnswer}</p>
            <div className={me.time}>
              <p className={me.answerStyle}>{data.timeAnswer}</p>
              <p className={me.answerStyle}>:{data.secondsAnswer}</p>
            </div>
          </div>
          <p className={me.answer}>...{data.messageAnswer}</p>
          <p className={me.newMessage}>{data.message}</p>
        </>}
      </div>
    
  );
};

export default MessageItem