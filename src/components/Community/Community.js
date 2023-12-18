import getUserAPI from '../../API/getUserAPI'
import Gallery from 'components/Gallery/Gallery'
import Users from 'components/Community/Users/Users'

import { useEffect } from 'react'
import { useDispatch } from 'react-redux'

import { changeCommunity } from 'vomgallStore/pathSlice'

import co from './Community.module.scss'

const Community = () => {

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(changeCommunity({data: true}));
  },[]);

  return (
    <div className={co.container}>

      <Users />
      <div className={co.workcontainer}>
        <Gallery />
      </div>
      
    </div>
  )
}

export default Community