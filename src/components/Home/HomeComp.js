
import DateTime from '../DateTime/DateTime'

import motion from '../../images/Write Messages.gif';

import hm from './HomeComp.module.scss'

const HomeComp = () => {

  return (

  <>

    <div className={hm.container}>

      <div className={hm.time}>

      <DateTime />

      </div>

      <div className={hm.hero}>
        <div className={hm.leftblock}>
          
          <p> Welcome to WOMBART</p> 
          <p> Share your creativity in the artistic community </p> 
          
        </div>  
        <img src={motion} alt='write messages'/>
      </div>

      <div className={`${hm.hero} ${hm.heroCommunity}`}>

        <p> Community</p> 
        <p> Share your creativity in the artistic community </p> 
      
      </div>
      
    </div>
   
  </>
    
  )
}

export default HomeComp