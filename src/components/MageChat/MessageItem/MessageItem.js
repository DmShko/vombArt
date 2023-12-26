import { ReactComponent as BackImg } from '../../../images/back-square-svgrepo-com.svg';

import me from './MessageItem.module.scss'

const MessageItem = ({ data }) => {
  return (
    <div className={me.container}>
      <div className={me.title}>
        <div className={me.stamp}>
          <p>{data.name}</p>
          <p style={{ color: 'blue', fontSize: '14px',}}>{data.date}</p>
          <p style={{ color: 'blue',fontSize: '14px', }}>{data.time}</p>
        </div>
        <BackImg className={me.svg}style={{width: '20px', height: '20px',}} />
      </div>
      <p>{data.message}</p>
    </div>
  );
};

export default MessageItem