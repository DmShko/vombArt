import DateTime from '../DateTime/DateTime'

import hm from './HomeComp.module.scss'

const HomeComp = () => {
  
  return (

  <>

    <div className={hm.container}>

      <div className={hm.time}>

      <DateTime />

      </div>

      <div className={hm.hero}>

        <p> Welcome to WOMBART</p> 
        <p> Share your creativity in the artistic community </p> 
      
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