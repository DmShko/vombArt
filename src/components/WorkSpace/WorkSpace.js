import Gallery from 'components/Gallery/Gallery';
import Menu from 'components/WorkSpace/Menu/Menu';
import Chat from 'components/MageChat/Chat';

import ws from './WorkSpace.module.scss'

const WorkSpace = () => {
  return (
    <div className={ws.container}>
        <Menu className={ws.menu} />
        <div className={ws.workContainer}>
          <Gallery className={ws.gallery} />
          <Chat className={ws.chat}/>
        </div>
    </div>
  )
}

export default WorkSpace