import { useSelector } from 'react-redux';

import it from './Item.module.scss'

import { ReactComponent as HeartImg } from '../../../images/heart-svgrepo-com.svg';
import { ReactComponent as LevelImg } from '../../../images/layer-svgrepo-com.svg';
import { ReactComponent as BlotImg } from '../../../images/paint-mark-1-svgrepo-com.svg';

const Item = (props) => {
   
  return (
    <div className={it.container}>
      <h2>{props.data.title}</h2>
      <p>{props.data.description}</p>
      {props.data.url !== '' ? <img src={props.data.url} style={{width:'100%', height: '100px', objectFit: 'cover', margin:'10px 0'}}></img> 
      : <BlotImg style={{width:'100%', height: '100px', objectFit: 'cover', margin:'10px 0'}}/>}
      <div className={it.info}>
        <div className={it.data}><HeartImg className={it.img}/>Likes:</div>
        <div className={it.data}><LevelImg className={it.img}/>Level:</div>
      </div>
    </div>
  );
}

export default Item