import NewForm from './NewForm/NewForm'
import Direction from './Direction/Direction'

import mn from './Menu.module.scss'

const Menu = () => {
  return (
    <div className={mn.container}>
        <button type='button' style={{borderRadius: '6px', border: 'none', padding: '5px', cursor: 'pointer', width: '50%',}}>New element</button>
        <NewForm/>
        <button type='button' style={{borderRadius: '6px', border: 'none', padding: '5px', cursor: 'pointer', width: '50%',}}>Edit</button>
        <button type='button' style={{borderRadius: '6px', border: 'none', padding: '5px', cursor: 'pointer', width: '50%',}}>Delete</button>
        <Direction/>
    </div>
  )
}

export default Menu