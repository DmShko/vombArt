import { useState } from 'react';

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
        <img style={{width: '350px', height: '90%', borderRadius: '8px', opacity: '70%',
          boxShadow: '1px 1px 4px 3px rgb(84, 92, 138)'}} src={motion} alt='write messages'/>
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