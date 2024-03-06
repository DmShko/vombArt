import { useSelector } from 'react-redux';

import { ReactComponent as FireBaseLogoBlack } from '../../images/logo-built_black.svg'
import { ReactComponent as FireBaseLogoWhite } from '../../images/logo-built_white.svg'

import fo from './Footer.module.scss'

const Footer = () => {

  const selectorGallSlice = useSelector(state => state.gallery);

  return (
    <>
      <div className={fo.source}>{selectorGallSlice.dayNight ? <FireBaseLogoBlack style={{width: '130px'}}/> : <FireBaseLogoWhite style={{width: '130px'}}/>}</div>
      <p className={fo.sound}>Sound Effect by <a href="https://pixabay.com/ru/users/universfield-28281460/?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=138807">UNIVERSFIELD</a> from <a href="https://pixabay.com/sound-effects//?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=138807">Pixabay</a></p>
      <p className={fo.sound}>
        {selectorGallSlice.settings.languageSelector === 'English' ? <span>Home photo by Viktor Hanacek</span> : 
          selectorGallSlice.settings.languageSelector === 'Українська' ? <span>Фото головної сторінки - Viktor Hanacek</span> : 
          selectorGallSlice.settings.languageSelector === 'Polska' ? <span>Zdjęcie domowe autorstwa Wiktora Hanacka</span> : <span>Home photo by Viktor Hanacek</span>}
      </p>
      <div className={fo.container} style={selectorGallSlice.dayNight ? {backgroundColor: 'rgb(122, 152, 206)',} : {backgroundColor: '',}}>
        {selectorGallSlice.settings.languageSelector === 'English' ? <p>&#169; Developed by Dmytro Shevchenko</p> : 
          selectorGallSlice.settings.languageSelector === 'Українська' ? <p>&#169; Розроблено Дмитром Шевченко</p> : 
          selectorGallSlice.settings.languageSelector === 'Polska' ? <p>&#169; Opracowany przez Dmytro Szewczenko</p> : <p>&#169; Developed by Dmytro Shevchenko</p>}
      </div>
    </>
  )
}

export default Footer