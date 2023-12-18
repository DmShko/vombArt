import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';

import Gallery from 'components/Gallery/Gallery';
import Menu from 'components/WorkSpace/Menu/Menu';
import Chat from 'components/MageChat/Chat';
import Pagination from '../Pagination/Pagination';

import { changeCommunity } from 'vomgallStore/pathSlice';
import { changePath } from 'vomgallStore/pathSlice';
import { auth } from "../../firebase";

import ws from './WorkSpace.module.scss';

const WorkSpace = () => {

  const selectorGallSlice = useSelector(state => state.gallery);
  const selectorSingInSlice = useSelector(state => state.singIn);

  const dispatch = useDispatch();

  useEffect(() => {

    dispatch(changeCommunity({data: false}));

    if(auth.currentUser !== null) {
      // path root begin with user name now
      dispatch(changePath({changeElement: 'name', data: selectorGallSlice.users.find(value => value.uid === auth.currentUser.uid).userName}));
    } else {
       // path root begin with user name now
       dispatch(changePath({changeElement: 'name', data: selectorGallSlice.users.find(value => value.uid === selectorSingInSlice.singInId).userName}));
    }
    

  },[]);
  
  return (
    <div className={ws.container}>
        <Menu className={ws.menu} />
        <div className={ws.workContainer}>
          <Gallery className={ws.gallery} />
          {selectorGallSlice.itemsBuffer !== null ? <Pagination /> : ''}
          <Chat className={ws.chat}/>
        </div>
    </div>
  )
}

export default WorkSpace