import { useSelector } from 'react-redux';

import fo from './Footer.module.scss'

const Footer = () => {

  const selectorGallSlice = useSelector(state => state.gallery);

  return (
    <div className={fo.container} style={selectorGallSlice.dayNight ? {backgroundColor: 'rgb(122, 152, 206)',} : {backgroundColor: '',}}>
      {selectorGallSlice.settings.languageSelector === 'English' ? <p>&#169; Developed by Dmytro Shevchenko</p> : 
        selectorGallSlice.settings.languageSelector === 'Українська' ? <p>&#169; Розроблено Дмитром Шевченко</p> : 
        selectorGallSlice.settings.languageSelector === 'Polska' ? <p>&#169; Opracowany przez Dmytro Szewczenko</p> : <p>&#169; Developed by Dmytro Shevchenko</p>}
    </div>
  )
}

export default Footer