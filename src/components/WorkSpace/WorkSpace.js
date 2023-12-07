import { useSelector } from 'react-redux';

import Gallery from 'components/Gallery/Gallery';
import Menu from 'components/WorkSpace/Menu/Menu';
import Chat from 'components/MageChat/Chat';
import Pagination from '../Pagination/Pagination'

import ws from './WorkSpace.module.scss'

const WorkSpace = () => {

  const selectorGallSlice = useSelector(state => state.gallery);

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