import { useSelector, useDispatch } from 'react-redux'
import { useEffect, useState } from 'react';
import { nanoid } from 'nanoid';

import { onAuthStateChanged   } from "firebase/auth";
import { auth } from "../../../firebase";
import { change } from 'vomgallStore/gallerySlice';
import { changePath } from 'vomgallStore/pathSlice';
import Notiflix from 'notiflix';

// import getUserAPI from 'API/getUserAPI';

import us from './Users.module.scss';

import ModalPersonal from 'components/ModalPersonal/ModalPersonal';

import { ReactComponent as AngelImgRight } from '../../../images/arrow-right-333-svgrepo-com.svg';
import { ReactComponent as AngelImgDown } from '../../../images/arrow-down-339-svgrepo-com.svg';
import { ReactComponent as UsersImg } from '../../../images/users-svgrepo-com.svg';
import { ReactComponent as UsersFoto } from '../../../images/user-avatar-svgrepo-com.svg';
import { ReactComponent as SearchImg } from '../../../images/search-alt-2-svgrepo-com.svg';
import {ReactComponent as OwnMessageImg} from '../../../images/message-svgrepo-com.svg';
import { ReactComponent as BirdsImg } from '../../../images/birds-svgrepo-com.svg';

const Users = () => {

  const dispatch = useDispatch();
  const selectorExistUsersList = useSelector(state => state.gallery);
  const selectorVisibilityLog = useSelector(state => state.singIn);
  const selectorUserPath = useSelector(state => state.path);
  const [search, setSearch] = useState('');

  const [usersOpen, setUsersOpen] = useState({});
  const [modalPersonalToggle, setModalPersonalToggle] = useState(false); 

  useEffect(() => {
   
    dispatch(change({operation: 'changeModalPersonalIsOpen', data: modalPersonalToggle}));
    // eslint-disable-next-line
  },[modalPersonalToggle]);

  useEffect(() => {
    // generate 'menu' user click status array for drive angel mode and open user information menu
    selectorExistUsersList.users.forEach(element => {
      setUsersOpen({...usersOpen, [element.uid]: false});
    });
    // eslint-disable-next-line
  },[selectorExistUsersList.users]);

  useEffect(() => {

    
      onAuthStateChanged(auth, (user) => { 
       
        if (user && user.uid === selectorVisibilityLog.singInId) {
        
          // add 
          dispatch(change({operation: 'changeUserStatus', data: {id: user.uid, status: true}}));
          
        } else {

          // if(selectorExistUsersList.users.find(element => element.uid === selectorVisibilityLog.singInId) !== undefined)
          // clear 'online' status intro all users's objects
          // dispatch(change({operation: 'changeAllUserStatus', data:{ id: selectorVisibilityLog.singInId, status: false,}})); 
          dispatch(change({operation: 'changeUserStatus', data:{ id: selectorVisibilityLog.singInId, status: false,}})); 
        }

      });
    

      // selectorVisibilityLog - when singOut button click
      // eslint-disable-next-line
  },[selectorVisibilityLog.isSingIn]) 
  
  // change 'usersOpen' if only all element false
  const checkOnTrue = (value) => {

    let clickStatus = false;

    for(const key in usersOpen){
 
      if(usersOpen[key] === true && key !== value) {
        clickStatus = true;
        break;
      }
    }

    return clickStatus;

  };

  // find tru element
  const whoIsTrue = () => {

    let isTrue = '';

    for(const key in usersOpen){
 
      if(usersOpen[key] === true) {
        isTrue = selectorExistUsersList.users.find(element => element.uid === key).userName;
        break;
      }
    }

    return isTrue;

  };

  // click on user in menu remode path to user name root and open user information menu
  const clickUser = (evt) => {

    // open user's menu
    if(usersOpen !== undefined && checkOnTrue(evt.currentTarget.id) === false) {
      setUsersOpen({...usersOpen, [evt.currentTarget.id]: !usersOpen[evt.currentTarget.id]});
      
      // path root begin with user name now
      dispatch(changePath({changeElement: 'name', data: selectorExistUsersList.users.find(value => value.uid === evt.currentTarget.id).userName}));
    } else {
      Notiflix.Notify.warning(`${whoIsTrue()} still open!`, {width: '450px', position: 'center-top', fontSize: '24px',});
    };

  };
 
  // who manu users online
  const isOnline = () => {

    let onlineCount = 0;

    selectorExistUsersList.users.forEach(element => {

      if(element.status === true) onlineCount += 1;
       
    });

    return onlineCount;
  };

  const styleLikes = () => {

    let total = 0;
    
    if(selectorExistUsersList.itemsBuffer !== null && selectorExistUsersList.itemsBuffer.length !== 0) {

      for(let v = 0; v < selectorExistUsersList.itemsBuffer.length; v += 1) {
        
        for(const key in selectorExistUsersList.heartsStatistic) {
          if(selectorExistUsersList.heartsStatistic[key].includes(selectorExistUsersList.itemsBuffer[v].id))
        total += 1;
        }
        
      }
    }

    if(total !== 0) {
      return total.toString();
    }else {
      return '';
    };
    
  };

  const styleView = () => {

    let total = 0;
    
    if(selectorExistUsersList.itemsBuffer !== null && selectorExistUsersList.itemsBuffer.length !== 0) {

      for(let v = 0; v < selectorExistUsersList.itemsBuffer.length; v += 1) {

        total += selectorExistUsersList.viewsStatistic[selectorExistUsersList.itemsBuffer[v].id];
       
      }
    }

    if(total !== 0) {
      return total.toString();
    }else {
      return '';
    };
    
  };

  const styleLevel = () => {

    let total = 0;

    if(selectorExistUsersList.itemsBuffer !== null && selectorExistUsersList.itemsBuffer.length !== 0) {

      for(let v = 0; v < selectorExistUsersList.itemsBuffer.length; v += 1) {
        
        total += selectorExistUsersList.levelStatistic[selectorExistUsersList.itemsBuffer[v].id];
       
      }

      if(total !== 0) {
        return (total / selectorExistUsersList.itemsBuffer.length).toString();
      }else {
       return '';
      };

    } 
  };

  const inputSearch = (evt) => {
    setSearch(evt.target.value);
  };

  const ModalPersonalToggle = () => {
    // open personal messages modal window
    setModalPersonalToggle(value => !value);
  };

  const personalMessageHandler = (evt) => {

    if(selectorVisibilityLog.isSingIn) {

      ModalPersonalToggle();

      // write selected person
      dispatch(change({operation: 'changeSelectedPerson', data: evt.currentTarget.id}));

    }

  };

  const changeBorderOver = (evt) => {

    if(selectorExistUsersList.settings.checkColorSchem){
      evt.currentTarget.style.backgroundColor = selectorExistUsersList.colorSchem;
    } else {
      evt.currentTarget.style.backgroundColor =  'rgba(194, 212, 31, 0.801)';
    }

  };

  const changeBorderOut = (evt) => {

    if(selectorExistUsersList.dayNight) evt.currentTarget.style.backgroundColor =  'rgb(122, 152, 206)';
    if(!selectorExistUsersList.dayNight) evt.currentTarget.style.backgroundColor =  '';
    
  };

  return (
    <div className={us.container} style={selectorExistUsersList.dayNight ? {backgroundColor: '#485a94',} : {backgroundColor: ''}}>

      <div className={us.usersicon} style={selectorExistUsersList.dayNight ? {width: '100%', borderBottom: '2px solid rgb(122, 152, 206)',} : {width: '100%', borderBottom: '2px solid lightgray',}}>{<UsersImg style={{width: '30px', height: '30px',}} />}</div>
      <div className={us.userstitle}>
        <div className={us.usercount}><p style={selectorExistUsersList.dayNight ? {color: '#1C274C',} : {color: ''}}>
        {selectorExistUsersList.settings.languageSelector === 'English' ? <span>Total:</span> : 
                      selectorExistUsersList.settings.languageSelector === 'Українська' ? <span>Всього:</span> : 
                      selectorExistUsersList.settings.languageSelector === 'Polska' ? <span>Razem:</span> : <span>Total:</span>}
        </p><p style={selectorExistUsersList.dayNight ? {color: 'rgb(122, 152, 206)',} : {color: ''}}>{selectorExistUsersList.users.length}</p></div>
        <div className={us.usercount}><p style={selectorExistUsersList.dayNight ? {color: '#1C274C',} : {color: ''}}>
        {selectorExistUsersList.settings.languageSelector === 'English' ? <span>Online:</span> : 
                      selectorExistUsersList.settings.languageSelector === 'Українська' ? <span>У мережі:</span> : 
                      selectorExistUsersList.settings.languageSelector === 'Polska' ? <span>W sieci:</span> : <span>Online:</span>}
        </p><p style={{color: 'rgba(194, 212, 31)'}}>{isOnline()}</p></div>
      </div>

      <label className={us.lab} style={selectorExistUsersList.dayNight ? { borderColor: 'rgb(122, 152, 206)' } : {borderColor: ''}}> <SearchImg style={{width: '25px', height: '25px',}}/>
        <input 
          style={selectorExistUsersList.dayNight ? { backgroundColor: 'rgb(122, 152, 206)' } : {backgroundColor: ''}}
           value={search}
           className={us.in}
           type="text"
           name='Search'              
           onChange={inputSearch}
           autoComplete='false'
           title="Search"
           placeholder={selectorExistUsersList.settings.languageSelector === 'English' ? "User name...": 
           selectorExistUsersList.settings.languageSelector === 'Українська' ? "Ім'я користувача...": 
           selectorExistUsersList.settings.languageSelector === 'Polska' ? "Nazwa użytkownika..." : "User name..."}
        ></input>
      </label>
        
        <ul className={us.userslist}>
         { selectorExistUsersList.users.map( value => 
            <div key={nanoid()}>
             {value.userName.toLowerCase().includes(search.toLowerCase()) ? <li key={nanoid()} className={us.usersitem} id={value.uid} name={value.userName} onClick={clickUser} onMouseOver={changeBorderOver} onMouseOut={changeBorderOut} 
                style={usersOpen[value.uid] ? {backgroundColor: 'rgba(194, 212, 31, 0.801)', borderRadius: '3px'} : {backgroundColor: 'none', borderRadius: '3px'}}><p style={{fontFamily: 'Courgette', color: 'rgb(122, 152, 206)',}}>{value.userName.slice(0, 8)}</p> 
                 {value.status? <p className={us.status} style={selectorExistUsersList.settings.checkColorSchem ? {color: 'rgba(194, 212, 31, 0.801)'} : {color: 'orange'}}>online</p> : ''} 
              {usersOpen[value.uid] ? <AngelImgDown className={us.img}/> : <AngelImgRight className={us.img} style={value.userName === selectorUserPath.logicPath.name ? {backgroundColor: 'rgba(194, 212, 31, 0.801)', borderRadius: '3px'} : {backgroundColor:'white', borderRadius: '3px'}}/>}</li> : ''}

              {usersOpen[value.uid] ?
                <div className={us.userdata} style={selectorExistUsersList.dayNight ? { borderBottom: '2px solid rgb(122, 152, 206)' } : {borderBottom: ''}}>
                  {selectorExistUsersList.users !== undefined && selectorExistUsersList.users.find(element => element.uid === value.uid).urlFoto === '' ? <UsersFoto style={{width: '50px', height: '50px',}} /> : 
                   <img src={`${selectorExistUsersList.users.find(element => element.uid === value.uid).urlFoto}`} alt='search user foto' style={{width: '80px', height: '80px', borderRadius: '50%'}}></img>}
                  <div className={us.userdescription}>
                    <div className={us.describe} style={{fontSize: '14px'}}><p style={{fontWeight: '600'}}>{selectorExistUsersList.settings.languageSelector === 'English' ? "Level:": 
                      selectorExistUsersList.settings.languageSelector === 'Українська' ? "Рівень:": 
                      selectorExistUsersList.settings.languageSelector === 'Polska' ? "Poziom:" : "Level:"}</p> <p>{Number.isNaN(styleLevel())}</p></div>
                    <div className={us.describe} style={{fontSize: '14px'}}><p style={{fontWeight: '600'}}>{selectorExistUsersList.settings.languageSelector === 'English' ? "Views:": 
                      selectorExistUsersList.settings.languageSelector === 'Українська' ? "Перегляди:": 
                      selectorExistUsersList.settings.languageSelector === 'Polska' ? "Wyświetlenia:" : "Views:"}</p> <p>{Number(styleView())}</p></div>
                    <div className={us.describe} style={{fontSize: '14px'}}><p style={{fontWeight: '600'}}>{selectorExistUsersList.settings.languageSelector === 'English' ? "Likes:": 
                      selectorExistUsersList.settings.languageSelector === 'Українська' ? "Вподобання:": 
                      selectorExistUsersList.settings.languageSelector === 'Polska' ? "Lubi:" : "Likes:"}</p> <p>{Number(styleLikes())}</p></div>
                    <div className={us.describe} style={{fontSize: '14px'}}><p style={{fontWeight: '600'}}>{selectorExistUsersList.settings.languageSelector === 'English' ? "Sex:": 
                      selectorExistUsersList.settings.languageSelector === 'Українська' ? "Стать:": 
                      selectorExistUsersList.settings.languageSelector === 'Polska' ? "Seks:" : "Sex:"}</p> <p>{selectorVisibilityLog.isSingIn ? selectorExistUsersList.personal.sex : ''}</p></div>
                    <div className={us.describe} style={{fontSize: '14px'}}><p style={{fontWeight: '600'}}>{selectorExistUsersList.settings.languageSelector === 'English' ? "Age:": 
                      selectorExistUsersList.settings.languageSelector === 'Українська' ? "Вік:": 
                      selectorExistUsersList.settings.languageSelector === 'Polska' ? "Wiek:" : "Age:"}</p> <p>{selectorVisibilityLog.isSingIn ? selectorExistUsersList.personal.age : ''}</p></div>
                    <div className={us.describe} style={{fontSize: '14px'}}><p style={{fontWeight: '600'}}>{selectorExistUsersList.settings.languageSelector === 'English' ? "Phone number:": 
                      selectorExistUsersList.settings.languageSelector === 'Українська' ? "Номер тел.:": 
                      selectorExistUsersList.settings.languageSelector === 'Polska' ? "Numer tel.:" : "Phone number:"}</p> <p>{selectorVisibilityLog.isSingIn && selectorExistUsersList.settings.checkPhone ? selectorExistUsersList.personal.phone : ''}</p></div>
                    <div className={us.describe} style={{fontSize: '14px'}}><p style={{fontWeight: '600'}}>{selectorExistUsersList.settings.languageSelector === 'English' ? "Email:": 
                      selectorExistUsersList.settings.languageSelector === 'Українська' ? "Ел. пошта:": 
                      selectorExistUsersList.settings.languageSelector === 'Polska' ? "E-mail:" : "Email:"}</p> <p>{selectorVisibilityLog.isSingIn && selectorExistUsersList.settings.checkEmail ? selectorExistUsersList.users.find(element => element.userName === whoIsTrue()).email : ''}</p></div>
                    <div className={us.describe} style={{fontSize: '14px'}}><p style={{fontWeight: '600'}}>{selectorExistUsersList.settings.languageSelector === 'English' ? "Here with:": 
                      selectorExistUsersList.settings.languageSelector === 'Українська' ? "Тут з:": 
                      selectorExistUsersList.settings.languageSelector === 'Polska' ? "Tutaj z:" : "Here with:"}</p></div>
                  </div>
        
                   { selectorVisibilityLog.singInId !== value.uid ? <OwnMessageImg style={{width: '40px', height: '40px', cursor: 'pointer', fill: 'lightgray'}} id={value.uid} name={'ownMessage'} onClick={personalMessageHandler}/> : ''}
                 
                </div> : ''}
            </div>
         )}
        </ul>
        <BirdsImg style={{width: '100px', height: '100px',}}/>
        {modalPersonalToggle && <ModalPersonal openClose={ModalPersonalToggle}>

        </ ModalPersonal>}

    </div>
  )
}

export default Users