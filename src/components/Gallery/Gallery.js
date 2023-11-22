import { useSelector } from 'react-redux'
import { nanoid } from 'nanoid';
import ga from './Gallery.module.scss'

const Gallery = () => {

  const selectorUserArt = useSelector(state => state.gallery);
  console.log(selectorUserArt);

  return (
    <div className={ga.comtainer}>
      
        <div className={ga.arts}>
            <button type='button'>Lirics</button>
            <button type='button'>Music</button>
            <button type='button'>Drawing</button>
        </div>
        
        <div>
          <div >
            <ul className={ga.style}>
              {
                selectorUserArt.users.find(value => value.name === 'Admin').arts.draw.style.map(value => 
                  <li key={nanoid()}><button type='button'>{value}</button></li> 
                ) 
              }
            </ul> 
          </div>
        </div>

    </div>
  )
}

export default Gallery