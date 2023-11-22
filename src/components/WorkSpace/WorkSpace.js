import Gallery from 'components/Gallery/Gallery';
import Menu from 'components/WorkSpace/Menu/Menu';

import ws from './WorkSpace.module.scss'

const WorkSpace = () => {
  return (
    <div className={ws.container}>
        <Menu/>
        <Gallery/>
    </div>
  )
}

export default WorkSpace