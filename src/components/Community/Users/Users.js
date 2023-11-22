import { useSelector, useDispatch } from 'react-redux'
import { useEffect } from 'react';
import { nanoid } from 'nanoid';

import getUserAPI from 'API/getUserAPI';

import us from './Users.module.scss'

const Users = () => {

  const dispatch = useDispatch();
  const selectorExistUsersList = useSelector(state => state.gallery);


  useEffect(() => {
    console.log(getUserAPI())
    if(selectorExistUsersList === getUserAPI()) dispatch({operation: 'changeUserStatus', data: true});
  },[])

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