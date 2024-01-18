import { useSelector } from 'react-redux';

import fo from './Footer.module.scss'

const Footer = () => {

  const selectorGallSlice = useSelector(state => state.gallery);

  return (
    <div className={fo.container} style={selectorGallSlice.dayNight ? {backgroundColor: 'rgb(122, 152, 206)',} : {backgroundColor: '',}}>
      <p>&#169;Developed by Dmytro Shevchenko</p>
    </div>
  )
}

export default Footer