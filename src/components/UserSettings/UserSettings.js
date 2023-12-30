import { React, useState } from 'react';

import se from './UserSettings.module.scss';

const UserSettings = () => {

  const [ checkDesign, setCheckDesign ] = useState(false);
  const [ checkLanguage, setCheckLanguage ] = useState(false);
  const [ checkPhone, setCheckPhone ] = useState(false);

  const check = ({ target }) => {
    
    if (target.name === 'design') {

      setCheckDesign(value => !value);
    } 

    if (target.name === 'language') {
      setCheckLanguage(value => !value);
    } 

    if (target.name === 'phone') {
      setCheckPhone(value => !value);
    } 
  };

  return (
    <div className={se.container}>

      <div className={se.check}>
        <p>Design</p>
        <label>
          <input
            type="radio"
            name="design"
            checked={checkDesign}
            onClick={check}
          ></input>
        </label>
      </div> 
      <div className={se.check}>
        <p>Lenguage</p>
        <label>
          <input
            type="radio"
            name="language"
            checked={checkLanguage}
            onClick={check}
          ></input>
        </label>
      </div>
      <div className={se.check}>
        <p>Show/Hidden phone number</p>
        <label>
          <input
            type="radio"
            name="phone"
            checked={checkPhone}
            onClick={check}
          ></input>
        </label>
      </div>

    </div>
  )
}

export default UserSettings