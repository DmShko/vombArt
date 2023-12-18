import { useSelector, useDispatch } from 'react-redux'
import { useEffect, useState } from 'react';
import { nanoid } from 'nanoid';

import { onAuthStateChanged   } from "firebase/auth";
import { auth } from "../../../firebase";
import { change } from 'vomgallStore/gallerySlice';
import { changePath } from 'vomgallStore/pathSlice';
import Notiflix from 'notiflix';

// import getUserAPI from 'API/getUserAPI';

import us from './Users.module.scss'

import { ReactComponent as AngelImgRight } from '../../../images/arrow-right-333-svgrepo-com.svg'
import { ReactComponent as AngelImgDown } from '../../../images/arrow-down-339-svgrepo-com.svg'

const Users = () => {

  const dispatch = useDispatch();
  const selectorExistUsersList = useSelector(state => state.gallery);
  const selectorVisibilityLog = useSelector(state => state.singIn);

  const [usersOpen, setUsersOpen] = useState({});

  useEffect(() => {
    // generate 'menu' user click status array for drive angel mode and open user information menu
    selectorExistUsersList.users.forEach(element => {
      setUsersOpen({...usersOpen, [element.uid]: false});
    });
    
  },[selectorExistUsersList.users]);

  useEffect(() => {

    onAuthStateChanged(auth, (user) => { 
   
      if (user) {
        // add 
        dispatch(change({operation: 'changeUserStatus', data: {id: user.uid, status: true}}));
        
      } else {

        // clear 'online' status intro all users's objects
        dispatch(change({operation: 'changeAllUserStatus', data:{ id: selectorVisibilityLog.singInId, status: false,}})); 
      }

    
    });

    // selectorVisibilityLog - when singOut button click
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
      Notiflix.Notify.warning(`${whoIsTrue()} already open!`, {width: '450px', position: 'center-top', fontSize: '24px',});
    };

  };
 
  return (
    <div className={us.container}>
        <h1 className={us.userstitle}>USERS</h1>
        <ul className={us.userslist}>
         { selectorExistUsersList.users.map( value =>

            <li key={nanoid()} className={us.usersitem} id={value.uid} name={value.userName} onClick={clickUser} style={usersOpen[value.uid] ? {backgroundColor: 'rgba(194, 212, 31, 0.801)'} : {backgroundColor: 'none'}}><p>{value.userName}</p> {value.status? <p className={us.status}>online</p> : ''} 
            {usersOpen[value.uid] ? <AngelImgDown className={us.img}/> : <AngelImgRight className={us.img}/>}</li>
            
         )}
        </ul>
    </div>
  )
}

export default Users