import getUserAPI from '../../API/getUserAPI'
import Gallery from 'components/Gallery/Gallery'
import Users from 'components/Community/Users/Users'
import Chat from 'components/MageChat/Chat';
import Pagination from '../Pagination/Pagination';

import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { changeCommunity } from 'vomgallStore/pathSlice'

import co from './Community.module.scss'

const Community = () => {

  const selectorGallSlice = useSelector(state => state.gallery);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(changeCommunity({data: true}));
  },[]);

  return (
    <div className={co.container}>

      <Users />
      <div className={co.workcontainer}>
        <Gallery />
        {selectorGallSlice.itemsBuffer !== null ? <Pagination /> : ''}
          <Chat className={co.chat}/>
      </div>
      
    </div>
  )
}

export default Community