import it from './Item.module.scss'

const Item = (props) => {

  return (
    <div className={it.container}>
      <h2>{props.data.title}</h2>
      <p>{props.data.description}</p>
      <div className={it.info}>
        <div>Likes:</div>
        <div>Shows:</div>
      </div>
    </div>
  );
}

export default Item