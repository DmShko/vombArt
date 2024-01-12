import { useSelector } from 'react-redux';

import it from './Item.module.scss'

import { ReactComponent as HeartImg } from '../../../images/heart-svgrepo-com.svg';
import { ReactComponent as LevelImg } from '../../../images/layer-svgrepo-com.svg';
import { ReactComponent as BlotImg } from '../../../images/paint-mark-1-svgrepo-com.svg';
import { ReactComponent as BookImg } from '../../../images/book-bookmark-svgrepo-com.svg';
import { ReactComponent as MusicImg } from '../../../images/music-note-svgrepo-com.svg';

const Item = (props) => {

  const selectorGallSlice = useSelector(state => state.gallery);

  const heartsCount = () => {

    let counter = 0;
  
    for(const key in selectorGallSlice.heartsStatistic) {
      if(selectorGallSlice.heartsStatistic[key].includes(props.data.id)) counter += 1;
    }
  
    return counter;
  };
   
  return (
    <div className={it.container}>

      <div className={it.topInfo}>
        <h2>{props.data.title}</h2>
        <p>{props.data.description}</p>
      </div>
      
      {props.data.url !== '' && props.data.type === 'image/jpeg' ? <img src={props.data.url} alt='Content' style={{width:'100%', height: '100px', objectFit: 'cover', margin:'10px 0'}}></img> 
      : props.data.url !== '' && props.data.type === 'text/plain' ? <pre style={{width:'100%', height: '100px', objectFit: 'cover', margin:'10px 0'}}><BookImg style={{width:'100%', height: '100px', objectFit: 'cover', margin:'10px 0'}}/></pre> 
      : props.data.url !== '' && props.data.type === 'audio/mpeg' ? <pre style={{width:'100%', height: '100px', objectFit: 'cover', margin:'10px 0'}}><MusicImg style={{width:'100%', height: '100px', objectFit: 'cover', margin:'10px 0'}}/></pre> : <BlotImg style={{width:'100%', height: '100px', objectFit: 'cover', margin:'10px 0'}}/>}
      
      <div className={it.info}>
        <div className={it.data}><HeartImg className={it.img}/><p>{`${heartsCount()}`}</p></div>
        <div className={it.data}><LevelImg className={it.img}/><p>{`${selectorGallSlice.levelStatistic !== null ? selectorGallSlice.levelStatistic[props.data.id] : ''}`}</p></div>
      </div>
    </div>
  );
}

export default Item