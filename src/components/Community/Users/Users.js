import { useSelector, useDispatch } from 'react-redux'
import { useEffect } from 'react';
import { nanoid } from 'nanoid';

import { onAuthStateChanged   } from "firebase/auth";
import { auth } from "../../../firebase";
import { change } from 'vomgallStore/gallerySlice';

// import getUserAPI from 'API/getUserAPI';

import us from './Users.module.scss'

const Users = () => {

  const dispatch = useDispatch();
  const selectorExistUsersList = useSelector(state => state.gallery);
  const selectorVisibilityLog = useSelector(state => state.singIn.isSingIn);

  useEffect(() => {

    onAuthStateChanged(auth, (user) => { 
   
      if (user) {
        // add 
        dispatch(change({operation: 'changeUserStatus', data: {id: user.uid, status: true}}));
        
      } else {

        // clear 'online' status intro all users's objects
        dispatch(change({operation: 'changeAllUserStatus', data: false})); 
      }

    
    });

    // selectorVisibilityLog - when singOut button click
  },[selectorVisibilityLog]) 

  return (
    <div className={us.container}>
        <h1 className={us.userstitle}>USERS</h1>
        <ul className={us.userslist}>
         { selectorExistUsersList.users.map( value =>

            <li key={nanoid()} className={us.usersitem}><p>{value.name}</p> {value.status? <p className={us.status}>online</p> : ''} </li>
            
         )}
        </ul>
    </div>
  )
}

export default Users