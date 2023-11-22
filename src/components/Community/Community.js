import getUserAPI from '../../API/getUserAPI'
import Gallery from 'components/Gallery/Gallery'
import Users from 'components/Community/Users/Users'

import co from './Community.module.scss'

const Community = () => {
  return (
    <div className={co.container}>

      <Users />
      <Gallery />

    </div>
  )
}

export default Community