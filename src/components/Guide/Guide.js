import { useEffect } from "react";
import { useSelector } from "react-redux"; 

import { ReactComponent as WarnImg} from '../../images/warning-1-svgrepo-com.svg';

import gu from './Guide.module.scss'

const Guide = () => {

  const selectorGallSlice = useSelector(state => state.gallery);

  useEffect(() => {
    //scroll to top on page load
    window.scrollTo({top: 0, left: 0, behavior: 'smooth'});
  }, []);

  return (
    <div className={gu.container}>

      <div className={gu.warnBlock}>
        <WarnImg className={gu.warnImg}/>
        <p className={gu.guideInfo} style={selectorGallSlice.dayNight ? {color: 'rgb(122, 152, 206)',} : {backgroundColor: '', color: '#1C274C', fontSize: '14px'}}>
                  {selectorGallSlice.settings.languageSelector === 'English' ? 'Pay attention! By registering on this resource, you acknowledge that your works may be copied by other registered people. This resource is demonstrative and experimental nature, but it can also be a full-fledged social network. So, if you notice that someone is passing off your work as their own, write to my mail (section "contacts").': 
                  selectorGallSlice.settings.languageSelector === 'Українська' ? 'Зверніть увагу! Зареєструвавшись на цьому ресурсі, ви визнаєте те, що ваші роботи можуть бути скопійовані іншими зареєстрованими людьми. Данний ресурс має демонстративний та експериментальний характер, проте може бути й повноцінною соціальною мережею. Отже, якщо помітите, що хтось видає ваші роботи за звої - пишіть на мою пошту (розділ "контакти").': 
                  selectorGallSlice.settings.languageSelector === 'Polska' ? 'Zwróć uwagę! Rejestrując się w tym zasobie, potwierdzasz, że Twoje prace mogą być kopiowane przez inne zarejestrowane osoby. Zasób ten ma charakter demonstracyjny i eksperymentalny natura, ale może być również pełnoprawną siecią społecznościową. Jeśli więc zauważysz, że ktoś podaje Twoją pracę jako swoją, napisz na moją pocztę (sekcja „kontakty”).' : 'Pay attention! By registering on this resource, you acknowledge that your works may be copied by other registered people. This resource is demonstrative and experimental, but it can also be a full-fledged social network. So, if you notice that someone is passing off your work as their own, write to my mail (section "contacts").'}
        </p>
      </div>

      <p className={gu.guideInfo} style={selectorGallSlice.dayNight ? {color: 'rgb(122, 152, 206)',} : {backgroundColor: '', color: '#1C274C', fontSize: '14px'}}>
                {selectorGallSlice.settings.languageSelector === 'English' ? 'The site has two main sections: workspace, community.': 
                selectorGallSlice.settings.languageSelector === 'Українська' ? 'Сайт має два основних розділи: робочий простір, спільнота.': 
                selectorGallSlice.settings.languageSelector === 'Polska' ? 'Witryna składa się z dwóch głównych sekcji: obszar roboczy i społeczność.' : 'The site has two main sections: workspace, community.'}
      </p>

      <p className={gu.guideInfo} style={selectorGallSlice.dayNight ? {color: 'rgb(122, 152, 206)',} : {backgroundColor: '', color: '#1C274C', fontSize: '14px'}}>
                {selectorGallSlice.settings.languageSelector === 'English' ? '1. Working space. Here you can add new genres to three main sections: writing, music, drawing, inside which you can add cards with your creativity. Tools for adding, editing, and deleting are available in the left panel.': 
                selectorGallSlice.settings.languageSelector === 'Українська' ? '1. Робочий простір. Тут ви можете додати нові жанри до трьох основних розділів: письмо, музика, малювання, всередині яких ви можете додати картки з вашою творчістю. Інструменти для додавання, редагування та видалення доступні на лівій панелі. ': 
                selectorGallSlice.settings.languageSelector === 'Polska' ? '1. Przestrzeń robocza. Tutaj możesz dodać nowe gatunki do trzech głównych sekcji: pisanie, muzyka, rysunek, w których możesz dodawać karty ze swoją kreatywnością. Narzędzia do dodawania, edytowania i usuwania są dostępne w lewym panelu.' : '1. Working space. Here you can add new genres to three main sections: writing, music, drawing, inside which you can add cards with your creativity. Tools for adding, editing, and deleting are available in the left panel.'}
      </p>

      <p className={gu.guideInfo} style={selectorGallSlice.dayNight ? {color: 'rgb(122, 152, 206)',} : {backgroundColor: '', color: '#1C274C', fontSize: '14px'}}>
                {selectorGallSlice.settings.languageSelector === 'English' ? '2. Community. Here you can select any of the registered users and view his gallery of works. You can like it or express your impressions in the comments. You can also write a personal message. A commenting system is available in every section and on every card. Use it with pleasure! I am waiting for comments and feedback)': 
                selectorGallSlice.settings.languageSelector === 'Українська' ? '2. Громада. Тут ви можете вибрати будь-якого із зареєстрованих користувачів і переглянути його галерею робіт. Ви можете поставити лайк або висловити свої враження в коментарях. Ви також можете написати особисте повідомлення. Система коментарів доступна в кожному розділі та на кожній картці. Користуйтеся ним із задоволенням! Чекаю коментарів та відгуків)': 
                selectorGallSlice.settings.languageSelector === 'Polska' ? '2. Społeczność. Tutaj możesz wybrać dowolnego zarejestrowanego użytkownika i obejrzeć jego galerię prac. Możesz dać lajka lub wyrazić swoje wrażenia za pomocą komentarza. Możesz także napisać wiadomość prywatną. System komentarzy dostępny jest w każdym dziale i na każdej karcie. Ciesz się z niego! Czekam na komentarze i opinie).' : 'Pay attention! By registering on this resource, you acknowledge that your works may be copied by other registered people. This resource is demonstrative and experimental, but it can also be a full-fledged social network. So, if you notice that someone is passing off your work as their own, write to my mail (section "contacts").'}
      </p>

    </div>
  )
}

export default Guide