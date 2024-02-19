import { NavLink, Outlet } from 'react-router-dom';
import { Suspense, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useSpring, animated } from '@react-spring/web'

import { getDatabase, ref, onValue } from 'firebase/database';
import readerStorAPI from '../../API/readerStorageAPI'

import ModalArt from 'components/ModalArt/ModalArt';
import ModalSettings from 'components/ModalSettings/ModalSettings';
import ModalPersonal from 'components/ModalPersonal/ModalPersonal';
import Footer from 'components/Footer/Footer';
import singUpAPI from '../../API/singUpAPI';
import singInAPI from '../../API/singInAPI';
import singOutAPI from '../../API/singOutAPI';
import writeUserData from 'API/writerDB';
import changeVeriAPI from 'API/emailVerifiAPI';
import forgottenPassAPI from 'API/forgottenPasswordAPI';

import { nanoid } from "nanoid";

import { change } from 'vomgallStore/gallerySlice';
import { changeSingOut } from 'vomgallStore/singOutSlice';
import { changePathName } from 'vomgallStore/pathSlice';
import { changeSingIn } from 'vomgallStore/singInSlice';
import { changeSingUp } from 'vomgallStore/singUpSlice';
import { changeDelAccount } from 'vomgallStore/deleteAccountSlice';
// import { auth } from "../../firebase";
// import { onAuthStateChanged   } from "firebase/auth";

import {ReactComponent as KeyImg} from '../../images/key-svgrepo-com.svg';
import {ReactComponent as EmailImg} from '../../images/email-8-svgrepo-com.svg';
import {ReactComponent as UserNameImg} from '../../images/user-id-svgrepo-com.svg';
import {ReactComponent as UserMenu} from '../../images/user-svgrepo-com.svg'; 
import {ReactComponent as UserMenuDarck} from '../../images/user-svgrepo-com-darck.svg'; 
import {ReactComponent as WarningImg} from '../../images/warning-1-svgrepo-com.svg';
import {ReactComponent as OwnMessageImg} from '../../images/message-svgrepo-com.svg';
import {ReactComponent as BurgerImg} from '../../images/hamburger-menu-svgrepo-com.svg';
import {ReactComponent as BurgerDarkImg} from '../../images/hamburger-menu-svgrepo-com-dark.svg';
import {ReactComponent as OpenMessageImg} from '../../images/message-open-svgrepo-com.svg';
import AdminFoto from '../../images/IMG_20190804_135033765.jpg';

import { ReactComponent as SettingsImg } from '../../images/settings-svgrepo-com.svg';
import { ReactComponent as LogoutImg } from '../../images/logout-svgrepo-com.svg';

import { ReactComponent as StatisticImg } from '../../images/statistics-presentation-svgrepo-com.svg';
import { ReactComponent as ContactsImg } from '../../images/contacts-svgrepo-com.svg';

import DayNight from '../DayNight/DayNight'

// component import
// import ModalArt from 'components/ModalArt/ModalArt';

// import css file
import sh from './SharedLayout.module.scss';

import { Loader } from '../Loader/Loader';

import Notiflix from 'notiflix';
Notiflix.Report.init({titleFontSize: '24px',});

// ********** HOW IT'S WORK **************

    // 1. Go to 296 row
    // At first, user signUp operation. There heppens read actual 'users' array from DB.
    // 2. When actual 'users' array is readed, go to 119 row. There heppens evaluation actual 'users' array:
    //   1) if data base ampty. Not exist anybody - go to 170 row and write new user object to 'users' array.
    //   2) Else (actual 'users' array and 'users' array in DB, in accordance), at first, write to 'users' array
    // actual 'users' and then write to 'users' array new user object. Goto 132 row.
    // Only ater this start auto login. When 'selectorUserExist' is true.

    // If user just exist and login simply. Go to 214 row. There heppens read actual 'users' array from DB too.
    // After this go to 121 row. There set actual path name and update 'users' array from DB. 
    // Rewrite 'users' array to DB, only if 'users' array length more, than 'selectorGallSlice.actualUserLength'.
    // Otherwise invalid value will write to DB.


    // NOTE: Any change automaticaly rewrite 'users' array in DB!!!
    // But 248 row code have to way update 'users' array in DB:
    //  1) When user login simply
    //  2) When user not login on signUp phase. 

// ***************************************

const SharedLayout = () => {

  const [ modalToggle, setModalToggle] = useState(false);
  const [ modalSettingsToggle, setModalSettingsToggle] = useState(false);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userName, setUserName] = useState('');
  const [errorDrive, setErrorDrive] = useState(false);
  const [forgotEmailSend, setForgotEmailSend] = useState('');
  const [forgotBlockToggle, setForgotBlockToggle] = useState(false);
  const [modalPersonalToggle, setModalPersonalToggle] = useState(false); 
  const [companionOpen, setCompamionOpen] = useState({});

  const { register, handleSubmit, formState:{errors}, reset} = useForm({mode: 'onBlur'});
  
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const selectorGallSlice = useSelector(state => state.gallery);
  const selectorSingIn = useSelector(state => state.singIn);
  const selectorTargetName = useSelector(state => state.gallery.buttonTargetName);
  const selectorVisibilityLog = useSelector(state => state.singIn.isSingIn);
  const selectorsingUpState = useSelector(state => state.singUp);
  const selectorUserExist = useSelector(state => state.singUp.userExist);
  const selectorItemsUrl = useSelector(state => state.readStorage);
  const selectorLogOut = useSelector(state => state.singOut);
  const selectorDelAccount = useSelector(state => state.deleteAccount);

  useEffect(() => {
    
    Object.keys(selectorGallSlice.personalMessagesBuffer).forEach(element => {
      setCompamionOpen({...companionOpen, [element]: false});
    });
    // eslint-disable-next-line
  },[selectorGallSlice.users]);

  // 'personalMessagesBuffer' loaded create personalNewMessagesBuffer
  useEffect(() => {

    let unreadMessages = {};
    let tempUnreadMessages = [];
    let unreadPerson = [];
    
    if(selectorSingIn.isSingIn && Object.keys(selectorGallSlice.personalMessagesBuffer).length !== 0) {
      for(const key in selectorGallSlice.personalMessagesBuffer) {

          tempUnreadMessages = [];

          for(let p = 0; p < selectorGallSlice.personalMessagesBuffer[key].length; p += 1) {
            
           
            if(selectorGallSlice.personalMessagesBuffer[key][p].name !== selectorGallSlice.users.find(element => element.uid === selectorSingIn.singInId).userName
              && selectorGallSlice.personalMessagesBuffer[key][p].unread === true ) {

              tempUnreadMessages.push(selectorGallSlice.personalMessagesBuffer[key][p].id);
              unreadPerson = [...unreadPerson, key]

            };
              
          };

          // only person with unread messages
          if(unreadPerson.includes(key)) unreadMessages = {...unreadMessages, [key]: tempUnreadMessages};
      };
    }

    dispatch(change({ operation: 'changePersonalNewMessagesBuffer', data: unreadMessages }));
  // eslint-disable-next-line  
  },[selectorGallSlice.personalMessagesBuffer]);

  useEffect(() => {

    if(selectorVisibilityLog) {
        
        const db = getDatabase();
        //firebase listener function
        onValue(ref(db, `${selectorGallSlice.users.find(element => element.uid === selectorSingIn.singInId).userName}/personalChat`), snapshot => {
            // load data from database
            const data = snapshot.val();

            let items = {};
            let buffer = [];
        
            if(data !== null) {

                for (const key in data) {

                    for (const childKey in data[key]) {

                        // convert data-object to array of objects 
                        buffer.push({...data[key][childKey], id: childKey});
                        
                    }
                   
                    items = {...items, [key]: buffer};
                    buffer = [];
                }
              
                dispatch(change({ operation: 'changePersonalMessagesBuffer', data: items }));

            }

        });

    }
  // eslint-disable-next-line
  },[selectorGallSlice.selectedPerson, companionOpen, modalPersonalToggle, selectorGallSlice.users]);

  // unselect person when modal window closed
  useEffect(() => {

    if(selectorGallSlice.selectedPerson === '') setCompamionOpen({}); 
    // eslint-disable-next-line
  },[selectorGallSlice.selectedPerson]);

  // add to users user account foto link for community section
  useEffect(() => {

    if(selectorGallSlice.account.url !== '' && selectorGallSlice.users !== undefined && selectorSingIn.isSingIn === true) {
        dispatch(change({operation: 'changeUserFotoURL', data:{id: selectorSingIn.singInId, value: selectorGallSlice.account.url}}));
    }
  // eslint-disable-next-line
  },[selectorGallSlice.account]);

  useEffect(() => {

    dispatch(change({operation: 'changeModalPersonalIsOpen', data: modalPersonalToggle}));
    // eslint-disable-next-line
  },[modalPersonalToggle]);

  // see account.js file, row 24
  useEffect(() => {

    // only if user loginned
    if(selectorGallSlice.users !== undefined && selectorSingIn.isSingIn === true) {

        // foto URL writing to selectorItemsUrl.itemsURL with souch id
        const userFotoId = selectorSingIn.singInId;
  
        // if foto exist in storage, otherwise will be go to readerStorAPI in loop
        if(selectorItemsUrl.errorElementId !== userFotoId && selectorGallSlice.users.length !== 0) {
            // write foto url to selectorItemsUrl.itemsURL only if selectorItemsUrl.itemsURL empty (first) start
            // or not but foto id no there otherwise selectorItemsUrl.itemsURL will be rewrite in loop and redux will be jump
            if(selectorItemsUrl.itemsURL.length === 0 || selectorItemsUrl.itemsURL.find(element => element.id === userFotoId) === undefined) {
             
                // path to foto in storage
                const userFotoPath = `${selectorGallSlice.users.find(element => element.uid === selectorSingIn.singInId).userName}/Account/Foto`;
                
                // get URL to foto in storage. Delay for storage be on time update
                setTimeout(() => 
                    dispatch(readerStorAPI({path: userFotoPath, elementId: userFotoId}))
                ,1000)
                
            }
        } 
    }

    // now foto url definitely exist
    // go to account.js file
    // eslint-disable-next-line
 },[selectorItemsUrl.itemsURL]);

  // off errors message, when inputs changenavigate('/home');
  useEffect(() => {

    setErrorDrive(false);

    const errorMessageOn = setTimeout(() => {
        setErrorDrive(true);
        clearTimeout(errorMessageOn);
    }, 2000);

  },[email, password, userName]);

  // when signOut happened
  useEffect(() => {

    if(selectorLogOut.isLogOut) {
      
        dispatch(changeSingUp({operation: 'changeUserExist', data: false}));
        dispatch(changeSingUp({operation: 'changeusersId', data: ''}));
        dispatch(changeSingUp({operation: 'changeUserName', data: ''}));
        dispatch(changeSingUp({operation: 'changeUserEmail', data: ''}));
        dispatch(changeSingUp({operation: 'changeUserToken', data: ''}));
        
        dispatch(changeSingIn({data: '', operation: 'changeToken'}));
        dispatch(changeSingIn({data: '', operation: 'changeSingInId'}));
        dispatch(changeSingIn({data: false, operation: 'changeisSingIn'}));

        dispatch(change({ operation: 'changePersonalMessagesBuffer', data: {} }));
       
        // dispatch(changePathName({data: ''})); 
        dispatch(changeSingOut({operation: 'changeisLogOut', data: false}));    
        // close modal settings
        setModalSettingsToggle(false);
    }
    // eslint-disable-next-line
  },[selectorLogOut.isLogOut]);

  useEffect(() => {

    if(!selectorSingIn.isSingIn) navigate('/');
    if(selectorSingIn.isSingIn) setModalToggle(false);
  // eslint-disable-next-line
  },[selectorSingIn.isSingIn]);

  // 2.###########################
  useEffect(() => {

    if(selectorSingIn.isSingIn) {
        // if(actualUsers.find(element => element.status === true) !== undefined || actualUsers.find(element => element.status === true) !== null) {
        if(selectorGallSlice.actualUsers.find(element => element.uid === selectorSingIn.singInId)) {
            dispatch(changePathName({data: selectorGallSlice.actualUsers.find(element => element.uid === selectorSingIn.singInId).userName}));
            
        } 

        dispatch(change({operation: 'updateUsersArray', data: selectorGallSlice.actualUsers}));
        dispatch(change({operation: 'updateActualUserLength', data: selectorGallSlice.actualUsers.length}));
    }
    
    if(selectorGallSlice.actualUsers !== null && selectorGallSlice.actualUsers !== undefined && selectorGallSlice.actualUsers.length !== 0) {
        
        if(!selectorSingIn.isSingIn && selectorsingUpState.usersId !== '' && selectorUserExist === false) {
            console.log("not empty")
            dispatch(change({operation: 'updateUsersArray', data: selectorGallSlice.actualUsers}));
            // add new user object but not add, when page reloader selectorUserExist change to false again in 'singUp'
            // when new user add do database
            // if(selectorsingUpState.email !== '' && selectorUserExist === false) {
                
                // add userName if singUp is OK
                dispatch(changeSingUp({operation: 'changeUserName', data: userName}));

                // add new user's default object to 'users' "gellarySlice's" array  
                dispatch(change({operation: 'changeUsers', data: 
                    {
                        userName: selectorsingUpState.userName,
                        email: selectorsingUpState.email,
                        arts:
                            {
                                lirics:{name: 'Lirics', style: ['Poem', 'Liric'] },
                                music:{name: 'Music', style: ['Classic', 'Pop'] },
                                draw: {name: 'Drawing', style: ['Oil', 'Watercolor', 'Digital', 'Mix']}
                            },
                        uid: selectorsingUpState.usersId,
                        status: true,
                        urlFoto: '',
                    }
                }));
                    
                // write that user exist afte add user to users array
                dispatch(changeSingUp({operation: 'changeUserExist', data: true}));
            
            // }

            dispatch(change({operation: 'updateActualUserLength', data: selectorGallSlice.actualUsers.length}));
        } 
        
    } else {
        
        if(selectorSingIn.isSingIn !== true && selectorsingUpState.usersId !== '' && selectorUserExist === false) {
            console.log("empty")
            // add userName if singUp is OK
            dispatch(changeSingUp({operation: 'changeUserName', data: userName}));

            // add new user's default object to 'users' "gellarySlice's" array  
            dispatch(change({operation: 'changeUsers', data: 
                {
                    userName: selectorsingUpState.userName,
                    email: selectorsingUpState.email,
                    arts:
                        {
                            lirics:{name: 'Lirics', style: ['Poem', 'Liric'] },
                            music:{name: 'Music', style: ['Classic', 'Pop'] },
                            draw: {name: 'Drawing', style: ['Oil', 'Watercolor', 'Digital', 'Mix']}
                        },
                    uid: selectorsingUpState.usersId,
                    status: true,
                    urlFoto: '',
                }
            
            }));

            // write that user exist afte add user to users array
            dispatch(changeSingUp({operation: 'changeUserExist', data: true}));

        } 
    }
  // eslint-disable-next-line
  },[selectorGallSlice.actualUsers]);

  // auto login after create new user
  useEffect(() => {
 
    if(selectorUserExist === true && selectorSingIn.isSingIn === false) { 
        
      dispatch(changeVeriAPI(email));  
      dispatch(singInAPI({email: email, password: password}));

    };
     // eslint-disable-next-line
  },[selectorUserExist]);


  // load actual users array to state from DB if isLogIn - true
  useEffect(() => {

    if(selectorSingIn.isSingIn === true) {
        
       // listenUserData(path);
       const db = getDatabase();
       const starCountRef = ref(db, 'users');
 
       //firebase listener function
       onValue(starCountRef, snapshot => {
         // load data from database
         const actualUsers = snapshot.val();
 
         dispatch(change({operation: 'tempActualUsers', data: actualUsers}));
  
       });
 
     };  
  // eslint-disable-next-line
  },[selectorSingIn.isSingIn]);
  
  useEffect(() => {

    if(selectorsingUpState.userName !== '') {

       // change userName in array Users (gallerySlice)
       dispatch(change({operation: 'changeUserName', data: {userName: selectorsingUpState.userName, email: selectorsingUpState.email}}));

    };  
  // eslint-disable-next-line
  },[selectorsingUpState.userName]);

  // rewrite user array to DB, when he was changed
  useEffect(() => {
    
    // add user array to database if are not empty [] and his length more than 'selectorGallSlice.actualUserLength'
    if(selectorSingIn.isSingIn === true && selectorGallSlice.users.length >= selectorGallSlice.actualUserLength) {
        if(selectorGallSlice.users.length !== 0 && selectorGallSlice.users !== null && selectorGallSlice.users !== undefined) {
       
            writeUserData(
                'users',
                selectorGallSlice.users,
                null, true
            );
        } 
    }

    if(selectorSingIn.isSingIn === false && selectorGallSlice.users.length > selectorGallSlice.actualUserLength) {
        if(selectorGallSlice.users.length !== 0 && selectorGallSlice.users !== null && selectorGallSlice.users !== undefined) {
    
            writeUserData(
                'users',
                selectorGallSlice.users,
                null, true
            );
        } 
    }
    
    // only for delete account
    if(selectorSingIn.isSingIn === false && selectorDelAccount.accountIsDeleted === true) {
        if(selectorGallSlice.users.length !== 0 && selectorGallSlice.users !== null && selectorGallSlice.users !== undefined) {
           
            writeUserData(
                'users',
                selectorGallSlice.users,
                null, true
            );
            
            dispatch(changeDelAccount({operation: 'changeAccountIsDeleted', data: false}));
            
        } 
    }
    // eslint-disable-next-line
  },[selectorGallSlice.users, selectorGallSlice.actualUserLength]);

  // 1.###########################
  // singUp 
  useEffect(() => {

    // only if no current logIn users and modal window is closed
    if(selectorsingUpState.usersId !== '' && modalToggle === true) {

       // listenUserData(path);
       const db = getDatabase();
       const starCountRef = ref(db, 'users');
 
       //firebase listener function
       onValue(starCountRef, snapshot => {
         // load data from database
         const actualUsers = snapshot.val();
 
         dispatch(change({operation: 'tempActualUsers', data: actualUsers}));
  
       });
 
    } 
    // eslint-disable-next-line
  },[selectorsingUpState.usersId]);
 
  const toggleModal = (evt) => {
    
    dispatch(change({data: evt?.currentTarget.id, operation: 'changeButtonTargetName',}));
    setModalToggle(value => !value);
  
  };

  const toggleModalSettings = () => {
   
    setModalSettingsToggle(value => !value);

  };

  const stateChange = data => {

    const { name, value } = data;

    // change 'name' and 'number' without use previous value
    switch(name) {
       
        case 'Email':
            setEmail(value)
            break;
        case 'Password':
            setPassword(value)
            break;
        case 'UserName':
            setUserName(value)
            break;
        case 'SendToEmail':
            setForgotEmailSend(value)
            break;
        default: break;
    }

  };

  const inputChange = evt => {
    
    // change 'name','email', 'password'
    stateChange(evt.target);

  };

  const addUser = (_, evt) => {
   
    evt.preventDefault();
    if(selectorTargetName === 'singUp') {
  
      dispatch(singUpAPI({email: email, password: password}));    

    };
   

    if(selectorTargetName === 'singIn') {
        
       dispatch(singInAPI({email: email, password: password})); 

    }

    reset({email: '', password: '', userName: ''});
   
  };

  const userLogOut = (evt) => {

    evt.preventDefault();
    if(evt.currentTarget.id === 'singOut') {
        Notiflix.Confirm.show(
            'Confirm',
            'Do you really want to log out?',
            'Yes',
            'No',
            () => {
                // before singOutAPI function. We need time for write data to DB
                dispatch(change({operation: 'changeUserStatus', data: {id: selectorSingIn.singInId, status: false}}));
            
                dispatch(singOutAPI());
                
                // close modal settings
                setModalSettingsToggle(false);
            
        },
        () => {

        },
        {
        },);
    };
  };

  const changeSingMode = (evt) => {
   
    dispatch(change({data: evt?.currentTarget.id, operation: 'changeButtonTargetName',}));

  };

  // report if no singin user
  const navClick = () => {

    if(!selectorSingIn.isSingIn) Notiflix.Report.info('Please, SingIn or SingUp');

  };

  const settingsHandle = () => {
    navigate('/usersettings')
    // close modal settings
    setModalSettingsToggle(false);
  };

  const statisticHandle = () => {
    navigate('/guide')
    // close modal settings
    setModalSettingsToggle(false);
  };

  const accountHandle = () => {
    navigate('/account')
    // close modal settings
    setModalSettingsToggle(false);
  };

  const forgotHandler = () => {

    setForgotBlockToggle(value => !value)

  };

  const sendToHandler = () => {

    if(selectorGallSlice.users.find(element => element.email === forgotEmailSend) && !errors?.SendToEmail) {
        dispatch(forgottenPassAPI(forgotEmailSend));
        setForgotBlockToggle(false)
    } else {
        Notiflix.Notify.warning('There is no such mail in our database', {width: '450px', position: 'center-top', fontSize: '24px',});
    };
    reset({SendToEmail: ''});
  };

  const changeBorderOver = (evt) => {
    
    if(evt.currentTarget.name === 'delete') {
      evt.currentTarget.style.backgroundColor =  'goldenrod';
    
    } else {
      evt.currentTarget.style.backgroundColor =  'goldenrod';
    } 

  };

  const changeBorderOut = (evt) => {
    
    if(selectorGallSlice.dayNight && evt.currentTarget.name === 'settings'){
      evt.currentTarget.style.backgroundColor =  '#485a94';  
    }else {
      evt.currentTarget.style.backgroundColor =  'rgb(122, 152, 206)'; 
    };

    if(!selectorGallSlice.dayNight) evt.currentTarget.style.backgroundColor =  '';
    
  };

  const changeCompanionOver = (evt) => {
    
    evt.currentTarget.style.backgroundColor =  'rgba(194, 212, 31, 0.801)';

  };

  const changeCompanionOut = (evt) => {
    
    if(selectorGallSlice.dayNight) {

      if(companionOpen[evt.currentTarget.id]) {
        evt.currentTarget.style.backgroundColor =  '#384a83';
      }else {
        evt.currentTarget.style.backgroundColor =  'rgb(122, 152, 206)';
      };
      
    }else {
      if(companionOpen[evt.currentTarget.id]) {
        evt.currentTarget.style.backgroundColor =  'lightgray';
      }else {
        evt.currentTarget.style.backgroundColor =  'white';
      };
    };
    
    
  };

  const ModalPersonalToggle = () => {
    // open personal messages modal window
    setModalPersonalToggle(value => !value);
    
  };

  const personalMessageHandler = () => {
    
    if(selectorVisibilityLog) {

      ModalPersonalToggle();

    }

  };

  const togglePersoneBlock = (evt) => {

    // clear newMessages flag
    if(Object.keys(selectorGallSlice.personalNewMessagesBuffer.length !== 0) && Object.keys(selectorGallSlice.personalMessagesBuffer).length !== 0) {
      
      for(const key in selectorGallSlice.personalNewMessagesBuffer) {

          for(let p = 0; p < selectorGallSlice.personalNewMessagesBuffer[key].length; p += 1) {

            writeUserData(
              `${selectorGallSlice.users.find(element => element.uid === selectorSingIn.singInId).userName}/personalChat/${key}/${selectorGallSlice.personalNewMessagesBuffer[key][p]}`,
              {...selectorGallSlice.personalMessagesBuffer[key].find(element => element.id === selectorGallSlice.personalNewMessagesBuffer[key][p]), unread: false,},
              null, true
            );
                
          };

      };

    }

    // clear newMessages array
    dispatch(change({ operation: 'changePersonalNewMessagesBuffer', data: {} }));

    Object.keys(companionOpen).forEach(element => {

      if(companionOpen[element]) companionOpen[element] = false;
     
    });

    setCompamionOpen({...companionOpen, [evt.currentTarget.id]: !companionOpen[evt.currentTarget.id]});
    // write selected person
    dispatch(change({operation: 'changeSelectedPerson', data: evt.currentTarget.id}));

  };

  const spring = useSpring({

    loop: true,
    from: { transform: 'perspective(70px) rotateY(45deg)',},
    to: [{ transform: 'perspective(70px) rotateY(-45deg)',}, 
     { transform: 'perspective(70px) rotateY(45deg)',},],
    config: {duration : 1000, friction: 300,},

  });

  return (
    <>
            <header className={sh.header}>
               <nav className={sh.pageNav}>
                        <NavLink className={`${sh.link} ${sh.home}`} to="/">
                        VombArt
                        </NavLink>
                    <ul className={sh.list}>
                        <li className={`${sh.navOneItem} ${sh.link}`}>
                            
                            <NavLink className={sh.linkNav} style={selectorGallSlice.dayNight ? {color: 'rgb(183, 208, 255)'} : {color: ''}} onClick={navClick} to={selectorSingIn.isSingIn ? "/lirics" : "/"}>
                            {selectorGallSlice.settings.languageSelector === 'English' ? <p>Writing</p> : 
                            selectorGallSlice.settings.languageSelector === 'Українська' ? <p>Письмо</p> : 
                            selectorGallSlice.settings.languageSelector === 'Polska' ? <p>Pismo</p> : <p>Lyrics</p>}
                            </NavLink>
                           
                        </li>

                        <li className={`${sh.navOneItem} ${sh.link}`}>

                            <NavLink className={sh.linkNav} style={selectorGallSlice.dayNight ? {color: 'rgb(183, 208, 255)'} : {color: ''}} onClick={navClick} to={selectorSingIn.isSingIn ?"/music" : "/"}>
                            {selectorGallSlice.settings.languageSelector === 'English' ? <p>Music</p> : 
                            selectorGallSlice.settings.languageSelector === 'Українська' ? <p>Музика</p> : 
                            selectorGallSlice.settings.languageSelector === 'Polska' ? <p>Muzyka</p> : <p>Muzyka</p>}
                            </NavLink>
                           
                        </li>

                        <li className={`${sh.navOneItem} ${sh.link}`}>

                            <NavLink className={sh.linkNav} style={selectorGallSlice.dayNight ? {color: 'rgb(183, 208, 255)'} : {color: ''}} onClick={navClick} to={selectorSingIn.isSingIn ? "/drawing" : "/"}>
                            {selectorGallSlice.settings.languageSelector === 'English' ? <p>Painting</p> : 
                            selectorGallSlice.settings.languageSelector === 'Українська' ? <p>Живопис</p> : 
                            selectorGallSlice.settings.languageSelector === 'Polska' ? <p>Obraz</p> : <p>Drawing</p>}
                            </NavLink>
                           
                        </li>

                        <li className={`${sh.navOneItem} ${sh.link}`}>

                            <NavLink className={sh.linkNav} style={selectorGallSlice.dayNight ? {color: 'rgb(183, 208, 255)'} : {color: ''}} onClick={navClick} to={selectorSingIn.isSingIn ? "/community" : "/"}>
                            {selectorGallSlice.settings.languageSelector === 'English' ? <p>Community</p> : 
                            selectorGallSlice.settings.languageSelector === 'Українська' ? <p>Громада</p> : 
                            selectorGallSlice.settings.languageSelector === 'Polska' ? <p>Wspólnota</p> : <p>Community</p>}
                            </NavLink>
                           
                        </li>
                    </ul>

                    <ul className={sh.list}>
                        <li className={sh.link}>

                           <p className={sh.linkNav} style={selectorGallSlice.dayNight ? {color: 'rgb(183, 208, 255)'} : {color: ''}} onClick={toggleModal} id='about'>
                           {selectorGallSlice.settings.languageSelector === 'English' ? <p>About</p> : 
                            selectorGallSlice.settings.languageSelector === 'Українська' ? <p>Про сайт</p> : 
                            selectorGallSlice.settings.languageSelector === 'Polska' ? <p>O witrynie</p> : <p>About</p>}
                           </p>
                            
                        </li>
                        <li className={sh.link}>

                          <p className={sh.linkNav} style={selectorGallSlice.dayNight ? {color: 'rgb(183, 208, 255)'} : {color: ''}} onClick={toggleModal} id='contacts'>
                          {selectorGallSlice.settings.languageSelector === 'English' ? <p>Contacts</p> : 
                            selectorGallSlice.settings.languageSelector === 'Українська' ? <p>Контакти</p> : 
                            selectorGallSlice.settings.languageSelector === 'Polska' ? <p>Łączność</p> : <p>About</p>}
                          </p>
                             
                        </li>
                    </ul>
                
                   <DayNight />
                   
                   {selectorVisibilityLog ? Object.keys(selectorGallSlice.personalNewMessagesBuffer).length === 0 ?
                    <OwnMessageImg  onClick={personalMessageHandler} style={{width: '35px', height: '35px', fill: 'lightgray', cursor: 'pointer',}}/> :
                    
                     <animated.div style={spring}>
                      <OwnMessageImg onClick={personalMessageHandler} style={{width: '35px', height: '35px', fill: 'goldenrod', cursor: 'pointer',}}/>
                     </animated.div>   
                    : ''
                    
                   }

                   {selectorVisibilityLog === false ? 
                      <ul className={sh.authList}>
                        <li className={`${sh.navOneItem} ${sh.link}`}>

                            <p className={sh.linkNav} style={selectorGallSlice.dayNight ? {color: 'rgb(183, 208, 255)'} : {color: ''}} onClick={toggleModal} id='singUp'>
                            {selectorGallSlice.settings.languageSelector === 'English' ? <p>SignUp</p> : 
                            selectorGallSlice.settings.languageSelector === 'Українська' ? <p>Створити</p> : 
                            selectorGallSlice.settings.languageSelector === 'Polska' ? <p>Zapisać się</p> : <p>SignUp</p>}
                            </p>
                            
                        </li>
                        <li className={`${sh.navOneItem} ${sh.link}`}>
                            
                            <p className={sh.linkNav} style={selectorGallSlice.dayNight ? {color: 'rgb(183, 208, 255)'} : {color: ''}} onClick={toggleModal} id='singIn'>
                            {selectorGallSlice.settings.languageSelector === 'English' ? <p>SignIn</p> : 
                            selectorGallSlice.settings.languageSelector === 'Українська' ? <p>Увійти</p> : 
                            selectorGallSlice.settings.languageSelector === 'Polska' ? <p>zalogować się</p> : <p>SignIn</p>}
                            </p>
                           
                        </li>
                    </ul> : 
                      <>
                        <button name={'settings'} onMouseOver={changeBorderOver} onMouseOut={changeBorderOut} style={selectorGallSlice.dayNight ? {backgroundColor: '#485a94', color: 'rgb(122, 152, 206)', } : {backgroundColor: ''}} className={sh.button} onClick={toggleModalSettings} type='button'>
                          {selectorGallSlice.users.find(element => element.uid === selectorSingIn.singInId) !== undefined ||
                        selectorGallSlice.users.length !== 0 
                        ? <div className={sh.userMenu}>{selectorGallSlice.dayNight ? <UserMenuDarck style={{width: '20px', height: '20px', fill: 'rgb(122, 152, 206)'}}/> : 
                        <UserMenu style={{width: '20px', height: '20px', fill: 'white'}}/>} <p className={sh.title}>{selectorGallSlice.users.find(element => element.uid === selectorSingIn.singInId).userName}</p></div> : ''}</button>
                        
                        <button name={'burgerSettings'} onMouseOver={changeBorderOver} onMouseOut={changeBorderOut} style={selectorGallSlice.dayNight ? {backgroundColor: '#485a94', color: 'rgb(122, 152, 206)', } : {backgroundColor: 'lightgray'}} className={sh.burgerButton} onClick={toggleModalSettings} type='button'>
                          {selectorGallSlice.users.find(element => element.uid === selectorSingIn.singInId) !== undefined ||
                        selectorGallSlice.users.length !== 0 
                        ? <div className={sh.userMenu}>{selectorGallSlice.dayNight ? <BurgerDarkImg style={{width: '30px', height: '30px', fill: 'rgb(122, 152, 206)'}}/> : 
                        <BurgerImg style={{width: '30px', height: '30px', fill: 'white'}}/>}</div> : ''}</button>
                      </>
                    }
 
                </nav>  
            </header>

            {modalPersonalToggle && <ModalPersonal openClose={ModalPersonalToggle}>

              <div className={sh.personcont}>
                <ul className={sh.personlist}>
                    {
                      Object.keys(selectorGallSlice.personalMessagesBuffer).map(value => {
                        return <li key={nanoid()}>
                          <div className={sh.personblock} id={value} onMouseOver={changeCompanionOver} onMouseOut={changeCompanionOut} style={selectorGallSlice.dayNight ? companionOpen[value] ? 
                          {backgroundColor: '#384a83', color: 'rgb(122, 152, 206)', border: 'none',} : {backgroundColor: 'rgb(122, 152, 206)', color: '#384a83',} :
                           companionOpen[value] ? {backgroundColor: 'lightgray', color: 'white', border: 'none',} : {backgroundColor: 'white', color: '#384a83',}} onClick={togglePersoneBlock}>
                            <img src={selectorGallSlice.users.find(element => element.uid === value).urlFoto} style={{width: '40px', height: '40px', borderRadius: '50px',}} alt='user foto'></img>
                            <p>{selectorGallSlice.users.find(element => element.uid === value).userName}</p>
                            {Object.keys(selectorGallSlice.personalNewMessagesBuffer).includes(value) ? <OwnMessageImg style={{width: '30px', height: '30px', fill: 'goldenrod'}}/>
                            : <OpenMessageImg style={{width: '30px', height: '30px',}}/>}
                          </div>
                         </li>
                      }) 
                    }
                </ul>
              </div>          
            </ ModalPersonal>}

            {
                modalSettingsToggle && <ModalSettings data={modalSettingsToggle}>
                  
                  <div className={sh.settingContainer}>

                    <div className={sh.settingModalBurger}>

                      <nav className={sh.pageNavBurger}>
                          
                        <ul className={sh.listBurger}>
                            <li className={`${sh.navOneItem} ${sh.linkBurger}`}>
                                
                                <NavLink className={sh.linkNavBurger} style={selectorGallSlice.dayNight ? {color: 'rgb(183, 208, 255)'} : {color: ''}} onClick={navClick} to={selectorSingIn.isSingIn ? "/lirics" : "/"}>
                                {selectorGallSlice.settings.languageSelector === 'English' ? <p>Writing</p> : 
                                selectorGallSlice.settings.languageSelector === 'Українська' ? <p>Письмо</p> : 
                                selectorGallSlice.settings.languageSelector === 'Polska' ? <p>Pismo</p> : <p>Lyrics</p>}
                                </NavLink>
                              
                            </li>

                            <li className={`${sh.navOneItem} ${sh.linkBurger}`}>

                                <NavLink className={sh.linkNavBurger} style={selectorGallSlice.dayNight ? {color: 'rgb(183, 208, 255)'} : {color: ''}} onClick={navClick} to={selectorSingIn.isSingIn ?"/music" : "/"}>
                                {selectorGallSlice.settings.languageSelector === 'English' ? <p>Music</p> : 
                                selectorGallSlice.settings.languageSelector === 'Українська' ? <p>Музика</p> : 
                                selectorGallSlice.settings.languageSelector === 'Polska' ? <p>Muzyka</p> : <p>Muzyka</p>}
                                </NavLink>
                              
                            </li>

                            <li className={`${sh.navOneItem} ${sh.linkBurger}`}>

                                <NavLink className={sh.linkNavBurger} style={selectorGallSlice.dayNight ? {color: 'rgb(183, 208, 255)'} : {color: ''}} onClick={navClick} to={selectorSingIn.isSingIn ? "/drawing" : "/"}>
                                {selectorGallSlice.settings.languageSelector === 'English' ? <p>Painting</p> : 
                                selectorGallSlice.settings.languageSelector === 'Українська' ? <p>Живопис</p> : 
                                selectorGallSlice.settings.languageSelector === 'Polska' ? <p>Obraz</p> : <p>Drawing</p>}
                                </NavLink>
                              
                            </li>

                            <li className={`${sh.navOneItem} ${sh.linkBurger}`}>

                                <NavLink className={sh.linkNavBurger} style={selectorGallSlice.dayNight ? {color: 'rgb(183, 208, 255)'} : {color: ''}} onClick={navClick} to={selectorSingIn.isSingIn ? "/community" : "/"}>
                                {selectorGallSlice.settings.languageSelector === 'English' ? <p>Community</p> : 
                                selectorGallSlice.settings.languageSelector === 'Українська' ? <p>Громада</p> : 
                                selectorGallSlice.settings.languageSelector === 'Polska' ? <p>Wspólnota</p> : <p>Community</p>}
                                </NavLink>
                              
                            </li>
                        </ul>

                        <ul className={sh.listBurger}>
                            <li className={sh.linkBurger}>

                              <p className={sh.linkNavBurger} style={selectorGallSlice.dayNight ? {color: 'rgb(183, 208, 255)'} : {color: ''}} onClick={toggleModal} id='about'>
                              {selectorGallSlice.settings.languageSelector === 'English' ? <p>About</p> : 
                                selectorGallSlice.settings.languageSelector === 'Українська' ? <p>Про сайт</p> : 
                                selectorGallSlice.settings.languageSelector === 'Polska' ? <p>O witrynie</p> : <p>About</p>}
                              </p>
                                
                            </li>
                            <li className={sh.linkBurger}>

                              <p className={sh.linkNavBurger} style={selectorGallSlice.dayNight ? {color: 'rgb(183, 208, 255)'} : {color: ''}} onClick={toggleModal} id='contacts'>
                              {selectorGallSlice.settings.languageSelector === 'English' ? <p>Contacts</p> : 
                                selectorGallSlice.settings.languageSelector === 'Українська' ? <p>Контакти</p> : 
                                selectorGallSlice.settings.languageSelector === 'Polska' ? <p>Łączność</p> : <p>About</p>}
                              </p>
                                
                            </li>
                        </ul>
                      </nav>
                    </div>

                    <div className={sh.settingModalButtonContainer}>
                        <div className={sh.settingModalButton} onMouseOver={changeBorderOver} onMouseOut={changeBorderOut} style={selectorGallSlice.dayNight ? {backgroundColor: 'rgb(122, 152, 206)'} : {backgroundColor: ''}} onClick={settingsHandle}><SettingsImg style={{width: '25px', height: '25px'}} /><p>
                        {selectorGallSlice.settings.languageSelector === 'English' ? <p>Settings</p> : 
                            selectorGallSlice.settings.languageSelector === 'Українська' ? <p>Налаштування</p> : 
                            selectorGallSlice.settings.languageSelector === 'Polska' ? <p>Ustawienia</p> : <p>Settings</p>}
                        </p></div>
                        <div className={sh.settingModalButton} onMouseOver={changeBorderOver} onMouseOut={changeBorderOut} style={selectorGallSlice.dayNight ? {backgroundColor: 'rgb(122, 152, 206)'} : {backgroundColor: ''}} onClick={statisticHandle}><StatisticImg style={{width: '25px', height: '25px'}} /><p>
                        {selectorGallSlice.settings.languageSelector === 'English' ? <p>Giud</p> : 
                            selectorGallSlice.settings.languageSelector === 'Українська' ? <p>Інструкція</p> : 
                            selectorGallSlice.settings.languageSelector === 'Polska' ? <p>Instrukcja</p> : <p>Giud</p>}
                        </p></div>
                        <div className={sh.settingModalButton} onMouseOver={changeBorderOver} onMouseOut={changeBorderOut} style={selectorGallSlice.dayNight ? {backgroundColor: 'rgb(122, 152, 206)'} : {backgroundColor: ''}} onClick={accountHandle}><ContactsImg style={{width: '25px', height: '25px'}} /><p>
                            {selectorGallSlice.settings.languageSelector === 'English' ? <p>Account</p> : 
                            selectorGallSlice.settings.languageSelector === 'Українська' ? <p>Профіль</p> : 
                            selectorGallSlice.settings.languageSelector === 'Polska' ? <p>Profil</p> : <p>Account</p>}
                        </p></div>
                        <div className={sh.settingModalButton} onMouseOver={changeBorderOver} onMouseOut={changeBorderOut} style={selectorGallSlice.dayNight ? {backgroundColor: 'rgb(122, 152, 206)'} : {backgroundColor: ''}} id='singOut' onClick={userLogOut}><LogoutImg style={{width: '25px', height: '25px'}} /><p></p>
                        {selectorGallSlice.settings.languageSelector === 'English' ? <p>Logout</p> : 
                            selectorGallSlice.settings.languageSelector === 'Українська' ? <p>Вийти</p> : 
                            selectorGallSlice.settings.languageSelector === 'Polska' ? <p>Wychodzić</p> : <p>Logout</p>}
                        </div>
                    </div>

                  </div> 
                </ ModalSettings>
            }
            
            {modalToggle && <ModalArt openClose={toggleModal}>
               
                {selectorTargetName === 'singIn' || selectorTargetName === 'singUp' ? 
                <div className={sh.toggleSingMode}>
                    <button onClick={changeSingMode} id='singIn' style={selectorTargetName === 'singIn' ? {backgroundColor: 'lightblue', color: 'white',  borderRight: 'solid 2px white', fontSize: '16px'} 
                    : {backgroundColor: 'lightgray', borderBottom: 'solid 2px white',}}><p>
                         {selectorGallSlice.settings.languageSelector === 'English' ? <p>SingIn</p> : 
                            selectorGallSlice.settings.languageSelector === 'Українська' ? <p>Увійти</p> : 
                            selectorGallSlice.settings.languageSelector === 'Polska' ? <p>zalogować się</p> : <p>SingIn</p>}
                    </p></button>
                    <button onClick={changeSingMode} id='singUp' style={selectorTargetName === 'singUp' ? {backgroundColor: 'lightblue', color: 'white',  borderLeft: 'solid 2px white' , fontSize: '16px'}
                    : {backgroundColor: 'lightgray', borderBottom: 'solid 2px white',}}><p>
                         {selectorGallSlice.settings.languageSelector === 'English' ? <p>SignUp</p> : 
                            selectorGallSlice.settings.languageSelector === 'Українська' ? <p>Створити</p> : 
                            selectorGallSlice.settings.languageSelector === 'Polska' ? <p>Zapisać się</p> : <p>SignUp</p>}
                    </p></button>
                </div> : ''}
             
                {selectorTargetName === 'about'? 
                <div className={sh.about}>
                    <img src={AdminFoto} alt='Developer foto' style={{width: '150px', }}></img>
                    <h2 style={{color: 'black'}}>
                    {selectorGallSlice.settings.languageSelector === 'English' ? <p>About VomBart and me.</p> : 
                            selectorGallSlice.settings.languageSelector === 'Українська' ? <p>Про VomBart та про мене.</p> : 
                            selectorGallSlice.settings.languageSelector === 'Polska' ? <p>O VomBart i o mnie</p> : <p>About VomBart and me.</p>}
                    </h2>
                    <p>
                    {selectorGallSlice.settings.languageSelector === 'English' ? <p>Hello! My name is Dmitry Shevchenko. I have many hobbies, including painting. 
                            Since childhood, I dreamed of learning to draw professionally, because
                             I knew that then I would be happy. That's exactly what happens. 
                             I could not become an artist at the level of famous masters. 
                             However, I am happy when I do it again and again. 
                             I sincerely thank the artist Olga Vlasova, who at a certain stage helped to improve my technical level.</p> : 
                            selectorGallSlice.settings.languageSelector === 'Українська' ? <p>
                            Привіт! Мене звати Дмитро Шевченко. Маю багато захоплень, зокрема малювання.
                            З дитинства я мріяв навчитися професійно малювати, т.к
                            я знав, що тоді я буду щасливий. 
                            Саме так і відбувається.
                            Я не міг стати художником рівня відомих майстрів.
                            Проте я щасливий, коли роблю це знову і знову.
                            Щиро дякую художнику Ользі Власовій, яка на певному етапі допомогла підвищити мій технічний рівень.</p> : 
                            selectorGallSlice.settings.languageSelector === 'Polska' ? <p>
                            Cześć! Nazywam się Dmitrij Szewczenko. Mam wiele zainteresowań, w tym malowanie.
                            Od dzieciństwa marzyłam o tym, żeby nauczyć się rysować zawodowo, bo
                              Wiedziałem, że wtedy będę szczęśliwy. Dokładnie tak się dzieje.
                              Nie mogłem zostać artystą na poziomie znanych mistrzów.
                              Jednak jestem szczęśliwy, gdy robię to po raz kolejny.
                              Serdecznie dziękuję artystce Oldze Własowej, która na pewnym etapie pomogła podnieść mój poziom techniczny.    
                            </p> : <p>About VomBart and me.</p>}
                        
                    </p>
                </div> : ''}
              
                {selectorTargetName === 'contacts' ? 
                <div className={sh.cont}>
                    <div className={sh.contacts}>
                        <div className={sh.linkedIn}><p style={{color: 'black'}}> LinkedIn: </p><a href='http://www.linkedin.com/in/dmitry-shevchenko-aa884613b'>Follow the link</a></div>
                        <p style={{color: 'black'}}> Email: <span>dmitry.schevchenko.work@gmail.com</span></p>
                    </div>
                </div> : ''}

                {selectorTargetName === 'singUp' ? 
                <div className={sh.sing}>
                    <form className={sh.fise} onSubmit={handleSubmit(addUser)}>
                        <fieldset>
                        <legend>
                        {selectorGallSlice.settings.languageSelector === 'English' ? <p>SignUp</p> : 
                            selectorGallSlice.settings.languageSelector === 'Українська' ? <p>Створити</p> : 
                            selectorGallSlice.settings.languageSelector === 'Polska' ? <p>Zapisać się</p> : <p>SignUp</p>}
                        </legend>

                            <div className={sh.field}>
                            
                            <label className={sh.lab}> <EmailImg style={{width: '25px', height: '25px',}}/>
                               
                                <input {...register('Email', {required: 'Please fill the Email field!', 
            
                                value: email, pattern: {value: /\w{0}[a-zA-Zа-яА-Я]+@\w{0}[a-zA-Zа-яА-Я]+\.\w{0}[a-zA-Zа-яА-Я]/, message: 'Invalid Email!'}})} 
                                className={sh.in} 
                                type="text"
                                autoComplete='false'
                                onChange={inputChange}
                                title="Email"
                                placeholder=
                                {selectorGallSlice.settings.languageSelector === 'English' ? "Enter email...": 
                                selectorGallSlice.settings.languageSelector === 'Українська' ? "Введіть email...": 
                                selectorGallSlice.settings.languageSelector === 'Polska' ? "Wpisz email" : "Enter email..."}>
                                </input>
                            </label>
                           
                            <label className={sh.lab}> <KeyImg style={{width: '25px', height: '25px',}} />
                                <input 
                                className={sh.in} {...register('Password', {required: 'Please fill the Password field!', 
            
                                minLength: {value:8, message: 'Invalid length! (8 liters min)'},  value: password,})} 
                                type="password"
                                autoComplete='false'
                                onChange={inputChange}
                                title="Password"
                                placeholder=
                                {selectorGallSlice.settings.languageSelector === 'English' ? "Enter password...": 
                                selectorGallSlice.settings.languageSelector === 'Українська' ? "Введіть пароль...": 
                                selectorGallSlice.settings.languageSelector === 'Polska' ? "Wpisz hasło" : "Enter password..."}></input>
                            </label>
                           
                            <label className={sh.lab}> <UserNameImg style={{width: '25px', height: '25px',}}/>
                                <input 
                                className={sh.in} {...register('UserName', {required: 'Please fill the User name field!', 
            
                               maxLength: {value:16, message: 'Invalid length! (16 liters max)'},  value: userName,})} 
                                type="text"
                                autoComplete='false'
                                onChange={inputChange}
                                title="UserName"
                                placeholder=
                                {selectorGallSlice.settings.languageSelector === 'English' ? "Enter User name...": 
                                selectorGallSlice.settings.languageSelector === 'Українська' ? "Введіть ім'я користувача...": 
                                selectorGallSlice.settings.languageSelector === 'Polska' ? "Wpisz nazwę użytkownika" : "Enter User name..."}></input>
                            </label>

                            <button className={sh.button}>
                            {selectorGallSlice.settings.languageSelector === 'English' ? <p>SignUp</p> : 
                            selectorGallSlice.settings.languageSelector === 'Українська' ? <p>Створити</p> : 
                            selectorGallSlice.settings.languageSelector === 'Polska' ? <p>Zapisać się</p> : <p>SignUp</p>}
                            </button>
                            </div>
                        
                        </fieldset>
                    </form>
                </div> : ''}

                {selectorTargetName === 'singIn' ? 
                <div className={sh.sing}>
                    <form className={sh.fise} onSubmit={handleSubmit(addUser)}>
                        <fieldset >
                        <legend >
                        {selectorGallSlice.settings.languageSelector === 'English' ? <p>SingIn</p> : 
                            selectorGallSlice.settings.languageSelector === 'Українська' ? <p>Увійти</p> : 
                            selectorGallSlice.settings.languageSelector === 'Polska' ? <p>Zalogować się</p> : <p>SingIn</p>}
                        </legend>
                           
                            <div className={sh.field}>
                            <label className={sh.lab}> <EmailImg style={{width: '25px', height: '25px',}}/>
                                <input {...register('Email', {required: 'Please fill the Email field!', 
            
                                value:email, pattern: {value: /\w{0}[a-zA-Zа-яА-Я]+@\w{0}[a-zA-Zа-яА-Я]+\.\w{0}[a-zA-Zа-яА-Я]/, message: 'Invalid Email!'}})}

                                className={sh.in} 
                                type="text"
                                autoComplete='false'
                                onChange={inputChange}
                                title="Email"
                                placeholder=
                                {selectorGallSlice.settings.languageSelector === 'English' ? "Enter email...": 
                                selectorGallSlice.settings.languageSelector === 'Українська' ? "Введіть email...": 
                                selectorGallSlice.settings.languageSelector === 'Polska' ? "Wpisz email" : "Enter email..."}>

                                </input>
                            </label>
                           
                            <label className={sh.lab}> <KeyImg style={{width: '25px', height: '25px',}} />
                            <input {...register('Password', {required: 'Please fill the Password field!', 
            
                            minLength: {value:8, message: 'Invalid length! (8 liters min)'},  value:password,})}

                            className={sh.in}
                            type="password"
                          
                            onChange={inputChange}
                            autoComplete='false'
                            title="Password"
                            placeholder=
                            {selectorGallSlice.settings.languageSelector === 'English' ? "Enter password...": 
                                selectorGallSlice.settings.languageSelector === 'Українська' ? "Введіть пароль...": 
                                selectorGallSlice.settings.languageSelector === 'Polska' ? "Wpisz hasło" : "Enter password..."}></input>
                            </label>

                            <button className={sh.button}>
                            {selectorGallSlice.settings.languageSelector === 'English' ? <p>SingIn</p> : 
                            selectorGallSlice.settings.languageSelector === 'Українська' ? <p>Увійти</p> : 
                            selectorGallSlice.settings.languageSelector === 'Polska' ? <p>Zalogować się</p> : <p>SingIn</p>}
                            </button>
                        </div>
                        
                        </fieldset>
                    </form>
                   
                </div> : ''}
                
                    { errorDrive ? errors?.Email ? <div className={sh.error}><WarningImg style={{width: '20px', height: '20px'}}/><p style={{color: 'orange', fontSize: '14px', fontWeight: '600',}}>{errors?.Email?.message}</p></div> : 
                    errors?.Password ? <div className={sh.error}><WarningImg style={{width: '20px', height: '20px'}}/><p style={{color: 'orange', fontSize: '14px', fontWeight: '600',}}>{errors?.Password?.message}</p></div> :
                    errors?.UserName ? <div className={sh.error}><WarningImg style={{width: '20px', height: '20px'}}/><p style={{color: 'orange', fontSize: '14px', fontWeight: '600',}}>{errors?.UserName?.message}</p></div> : '' : ''}

                {selectorTargetName === 'singUp' ? <a href='https://dmshko.github.io/password_generator/' style={{textAlign: 'center', width: '90%', marginBottom: '10px'}} target="_blank" rel="noopener noreferrer">
                {selectorGallSlice.settings.languageSelector === 'English' ? <p>Try using a special resource to create a password.</p> : 
                            selectorGallSlice.settings.languageSelector === 'Українська' ? <p>Спробуйте скористатися спеціальним ресурсом для створення пароля.</p> : 
                            selectorGallSlice.settings.languageSelector === 'Polska' ? <p>Spróbuj użyć specjalnego zasobu, aby utworzyć hasło.
                </p> : <p>Try using a special resource to create a password.</p>}
                </a> : ''}
                {selectorTargetName === 'singIn' ? <p className={sh.forgot} onClick={forgotHandler}>
                {selectorGallSlice.settings.languageSelector === 'English' ? <p>I forgot my password. Will restore via mailbox.</p> : 
                            selectorGallSlice.settings.languageSelector === 'Українська' ? <p>Я забув свій пароль. Буде відновлено через поштову скриньку.</p> : 
                            selectorGallSlice.settings.languageSelector === 'Polska' ? <p>Zapomniałem hasła. Przywrócę przez skrzynkę pocztową.
                </p> : <p>I forgot my password. Will restore via mailbox.</p>}
                </p> :
                 ''}

                {forgotBlockToggle ?

                    <div className={sh.forgotCont} >
                        <p>
                        {selectorGallSlice.settings.languageSelector === 'English' ? <p>Enter existing account email</p> : 
                            selectorGallSlice.settings.languageSelector === 'Українська' ? <p>Введіть існуючу електронну адресу облікового запису</p> : 
                            selectorGallSlice.settings.languageSelector === 'Polska' ? <p>Wprowadź adres e-mail istniejącego konta
                </p> : <p>Enter existing account email</p>}
                        </p>
                        <label className={sh.forgotLab}> <EmailImg style={{width: '25px', height: '25px',}}/>
                        <input {...register('SendToEmail', {required: 'Please fill the Email field!', 
                            value:email, pattern: {value: /\w{0}[a-zA-Zа-яА-Я]+@\w{0}[a-zA-Zа-яА-Я]+\.\w{0}[a-zA-Zа-яА-Я]/, message: 'Invalid Email!'}})}

                            className={sh.forgotIn} 
                            type="text"
                            autoComplete='false'
                            onChange={inputChange}
                            title="SendToEmail"
                            placeholder={selectorGallSlice.settings.languageSelector === 'English' ? "Enter email...": 
                            selectorGallSlice.settings.languageSelector === 'Українська' ? "Введіть email...": 
                            selectorGallSlice.settings.languageSelector === 'Polska' ? "Wpisz email" : "Enter email..."}></input>
                        </label> 

                        {errors?.SendToEmail ? <p style={{color: 'orange', fontSize: '14px', fontWeight: '600',}}>{errors?.SendToEmail?.message}</p> : ''}

                        <button className={sh.button} onClick={sendToHandler}>
                        {selectorGallSlice.settings.languageSelector === 'English' ? <p>Send</p> : 
                            selectorGallSlice.settings.languageSelector === 'Українська' ? <p>Надіслати</p> : 
                            selectorGallSlice.settings.languageSelector === 'Polska' ? <p>wysłać
                        </p> : <p>Send</p>}
                        </button>
                    </div> : ''
                }

                {selectorTargetName === 'singUp'  ?
                    <div className={sh.verifiInfo}>
                        
                    {selectorGallSlice.settings.languageSelector === 'English' ? <p>A confirmation email will be sent to your email address. Follow the link in the letter and after the information that you are verified, continue using the site. Login is automatic. If the letter does not arrive, you can confirm your e-mail from your personal account.</p> : 
                      selectorGallSlice.settings.languageSelector === 'Українська' ? <p>На вашу пошту буде надіслано лист із підтвердженням. Перейдіть за посиланням у листі та після інформації, що ви перевірені подовжуйте користуватися сайтом. Вхід здійснюється автоматично. Якщо лист не приходить, ви можете підтвердити свою електронну пошту з особистого кабінету.</p> : 
                      selectorGallSlice.settings.languageSelector === 'Polska' ? <p>Na Twój adres e-mail zostanie wysłana wiadomość e-mail z potwierdzeniem. Kliknij link zawarty w piśmie i po zweryfikowaniu informacji kontynuuj korzystanie z witryny. Logowanie odbywa się automatycznie. Jeśli list nie dotrze, możesz potwierdzić swój adres e-mail ze swojego konta osobistego.</p> : <p>A confirmation email will be sent to your email address. Follow the link in the letter and after the information that you are verified, continue using the site. Login is automatic. If the letter does not arrive, you can confirm your e-mail from your personal account.</p>}
                        
                    </div>
                 :''}

            </ModalArt>}

            <div style={selectorGallSlice.dayNight ? {backgroundColor: '#485a94'} : {backgroundColor: ''}}>   
                <section className={sh.section} style={selectorGallSlice.dayNight ? {backgroundColor: '#485a94'} : {backgroundColor: ''}}>
                    <main className={sh.container} style={selectorGallSlice.dayNight ? {backgroundColor: '#485a94'} : {backgroundColor: ''}}>
                        <Suspense fallback={<Loader/>}>
                            <Outlet />
                        </Suspense>

                        <footer><Footer /></footer>
                    </main>
                </section>
            </div> 
    </>
  )
}

export default SharedLayout