import { useSelector } from 'react-redux';

import it from './Item.module.scss'

import { ReactComponent as HeartImg } from '../../../images/heart-svgrepo-com.svg';
import { ReactComponent as LevelImg } from '../../../images/layer-svgrepo-com.svg';

const Item = (props) => {

  const readStorageSlice = useSelector(state => state.readStorage);
   
  return (
    <div className={it.container}>
      <h2>{props.data.title}</h2>
      <p>{props.data.description}</p>
      {/* <img src={readStorageSlice.itemsURL !== undefined && readStorageSlice.itemsURL.length !== 0 ? readStorageSlice.itemsURL.find(value => value.id === props.data.id).url: 'No image'} ></img> */}
      <div className={it.info}>
        <div className={it.data}><HeartImg className={it.img}/>Likes:</div>
        <div className={it.data}><LevelImg className={it.img}/>Level:</div>
      </div>
    </div>
  );
}

export default Item