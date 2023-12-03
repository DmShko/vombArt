import me from './MessageItem.module.scss'

const MessageItem = ({ data }) => {
  return (
    <div className={me.container}>
      <div className={me.title}>
        <p>{data.name}</p>
        <p style={{ color: 'blue', fontSize: '14px',}}>{data.date}</p>
        <p style={{ color: 'blue',fontSize: '14px', }}>{data.time}</p>
      </div>
      <p>{data.message}</p>
    </div>
  );
};

export default MessageItem