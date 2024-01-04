import { NavLink, Outlet } from 'react-router-dom';
import { Suspense, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';

import { getDatabase, ref, onValue } from 'firebase/database';
import readerStorAPI from '../../API/readerStorageAPI'

import ModalArt from 'components/ModalArt/ModalArt';
import ModalSettings from 'components/ModalSettings/ModalSettings';
import singUpAPI from '../../API/singUpAPI';
import singInAPI from '../../API/singInAPI';
import singOutAPI from '../../API/singOutAPI';
import writeUserData from 'API/writerDB';
import changeVeriAPI from 'API/emailVerifiAPI';
import { change } from 'vomgallStore/gallerySlice';
import { changePathName } from 'vomgallStore/pathSlice';
import { changeSingIn } from 'vomgallStore/singInSlice';
import { changeSingUp } from 'vomgallStore/singUpSlice';
// import { auth } from "../../firebase";
// import { onAuthStateChanged   } from "firebase/auth";

import {ReactComponent as KeyImg} from '../../images/key-svgrepo-com.svg';
import {ReactComponent as EmailImg} from '../../images/email-8-svgrepo-com.svg';
import {ReactComponent as UserNameImg} from '../../images/user-id-svgrepo-com.svg';
import {ReactComponent as UserMenu} from '../../images/user-svgrepo-com.svg'; 
import AdminFoto from '../../images/IMG_20190804_135033765.jpg';

import { ReactComponent as SettingsImg } from '../../images/settings-svgrepo-com.svg'
import { ReactComponent as LogoutImg } from '../../images/logout-svgrepo-com.svg'

import { ReactComponent as StatisticImg } from '../../images/statistics-presentation-svgrepo-com.svg'
import { ReactComponent as ContactsImg } from '../../images/contacts-svgrepo-com.svg'

// component import
// import ModalArt from 'components/ModalArt/ModalArt';

// import css file
import sh from './SharedLayout.module.scss';

import { Loader } from '../Loader/Loader';

import Notiflix from 'notiflix';
Notiflix.Report.init({titleFontSize: '24px',});

const SharedLayout = () => {

  const [ modalToggle, setModalToggle] = useState(false);
  const [ modalSettingsToggle, setModalSettingsToggle] = useState(false);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userName, setUserName] = useState('');
  const [errorDrive, setErrorDrive] = useState(false);

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
 },[selectorItemsUrl.itemsURL]);

  // off errors message, when inputs changenavigate('/home');
  useEffect(() => {

    setErrorDrive(false);

    const errorMessageOn = setTimeout(() => {
        setErrorDrive(true);
        clearTimeout(errorMessageOn);
    }, 2000);

  },[email, password, userName]);

  useEffect(() => {

    if(!selectorSingIn.isSingIn) navigate('/');

  },[selectorSingIn.isSingIn]);

  useEffect(() => {

    if(selectorGallSlice.tempActualUsers !== null && selectorGallSlice.tempActualUsers !== undefined) {
        // if(actualUsers.find(element => element.status === true) !== undefined || actualUsers.find(element => element.status === true) !== null) {
        if(selectorGallSlice.tempActualUsers.find(element => element.uid === selectorSingIn.singInId)) {
            dispatch(changePathName({data: selectorGallSlice.tempActualUsers.find(element => element.uid === selectorSingIn.singInId).userName}));
            dispatch(change({operation: 'updateUsersArray', data: selectorGallSlice.tempActualUsers}));
        }

        dispatch(change({operation: 'updateActualUserLength', data: selectorGallSlice.tempActualUsers.length}));
    }

  },[selectorGallSlice.tempActualUsers]);

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

  },[selectorSingIn.isSingIn]);
  
  useEffect(() => {

    if(selectorsingUpState.userName !== '') {

       // change userName in array Users (gallerySlice)
       dispatch(change({operation: 'changeUserName', data: {userName: selectorsingUpState.userName, email: selectorsingUpState.email}}));

    };  

  },[selectorsingUpState.userName]);

  // rewrite user array to DB, when he was changed
  useEffect(() => {

    // add user array to database if are not empty [] and his length more than 'selectorGallSlice.actualUserLength'
    if(selectorSingIn.isSingIn === true && selectorGallSlice.users.length > selectorGallSlice.actualUserLength) {
        if(selectorGallSlice.users.length !== 0 && selectorGallSlice.users !== null && selectorGallSlice.users !== undefined) {
    
            writeUserData(
                'users',
                selectorGallSlice.users,
                null, true
            );
        } 
    }

    // NOTE !!!!!!!!!!!!!!!!!! HOW IT'S WORK
    // When user login, first time, even 'users' array just change, but 'selectorGallSlice.actualUserLength' stiil 0.
    // Because neсessary waiting 'selectorGallSlice.actualUserLength' changes.
    // For it use '[...selectorGallSlice.actualUserLength,]' below.
    // Users array can changed befor change 'selectorSingIn.isSingIn' too.
    // Because '[...selectorSingIn.isSingIn,]' below used for await his changed event.
    // Rewrite 'users' array to DB, only if 'users' array length more, than 'selectorGallSlice.actualUserLength'.
    // Otherwise invalid value will write to DB.

    // Infirst must update data with 'users' DB, then new user add to 'users'.
    // Change of 'users' go to rewrite 'users' in DB (add new user or anather change of 'users') see 160 row.
    // actualUserLength it's actual 'users' array in DB.
    
  },[selectorGallSlice.users, selectorGallSlice.actualUserLength]);


  useEffect(() => {
   
    // add new user object but not add, when page reloader selectorUserExist change to false again in 'singUp'
    // when new user add do database
    if(selectorsingUpState.email !== '' && selectorUserExist === false) {
            
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
            }
        }));
            
        // write that user exist afte add user to users array
        dispatch(changeSingUp({operation: 'changeUserExist', data: true}));
       
    }
     
     
  },[selectorsingUpState.email]);

  // singIn after singUp at same time
  useEffect(() => {

    // only if no current logIn users and modal window is closed
    if(selectorsingUpState.usersId !== '' && modalToggle === true) {
      dispatch(changeVeriAPI(email));  
      dispatch(singInAPI({email: email, password: password}));
    } 

  },[selectorsingUpState.usersId]);
 
  const toggleModal = (evt) => {
    
    dispatch(change({data: evt?.target.id, operation: 'changeButtonTargetName',}));
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
            console.log(value)
            setUserName(value)
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
        dispatch(singOutAPI());
        dispatch(changeSingIn({data: false, operation: 'changeisSingIn'}));
        dispatch(changeSingIn({data: '', operation: 'changeToken'}));
        dispatch(change({operation: 'changeUserStatus', data: {id: selectorSingIn.singInId, status: false}}));
        dispatch(changeSingIn({data: false, operation: 'changeSingInId'}));
        // dispatch(changePathName({data: ''}));
        
        // close modal settings
        setModalSettingsToggle(false);
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
  };

  const statisticHandle = () => {
    navigate('/statistic')
  };

  const accountHandle = () => {
    navigate('/account')
  };

  return (
    <>
            <header className={sh.header}>
               <nav className={sh.pageNav}>
                        <NavLink className={`${sh.link} ${sh.home}`} to="/">
                        VombArt
                        </NavLink>
                    <ul className={sh.list}>
                        <li className={`${sh.navOneItem} ${sh.link}`}>
                            
                            <NavLink className={sh.linkNav} onClick={navClick} to={selectorSingIn.isSingIn ? "/lirics" : "/"}>
                            Lirics
                            </NavLink>
                           
                        </li>

                        <li className={`${sh.navOneItem} ${sh.link}`}>

                            <NavLink className={sh.linkNav} onClick={navClick} to={selectorSingIn.isSingIn ?"/music" : "/"}>
                            Music
                            </NavLink>
                           
                        </li>

                        <li className={`${sh.navOneItem} ${sh.link}`}>

                            <NavLink className={sh.linkNav} onClick={navClick} to={selectorSingIn.isSingIn ? "/drawing" : "/"}>
                            Drawing
                            </NavLink>
                           
                        </li>

                        <li className={`${sh.navOneItem} ${sh.link}`}>

                            <NavLink className={sh.linkNav} onClick={navClick} to={selectorSingIn.isSingIn ? "/community" : "/"}>
                            Community
                            </NavLink>
                           
                        </li>
                    </ul>

                    <ul className={sh.list}>
                        <li className={sh.link}>

                           <p className={sh.linkNav} onClick={toggleModal} id='about'>About</p>
                            
                        </li>
                        <li className={sh.link}>

                          <p className={sh.linkNav} onClick={toggleModal} id='contacts'>Contacts</p>
                             
                        </li>
                    </ul>

                   {selectorVisibilityLog === false ? <ul className={sh.list}>
                        <li className={`${sh.navOneItem} ${sh.link}`}>

                            <p className={sh.linkNav} onClick={toggleModal} id='singUp'>SingUp</p>
                            
                        </li>
                        <li className={`${sh.navOneItem} ${sh.link}`}>
                            
                            <p className={sh.linkNav} onClick={toggleModal} id='singIn'>SingIn</p>
                           
                        </li>
                    </ul> : <button className={sh.button} onClick={toggleModalSettings} type='button'>{selectorGallSlice.users.find(element => element.uid === selectorSingIn.singInId) !== undefined ||
                    selectorGallSlice.users.length !== 0 
                    ? <div className={sh.userMenu}><UserMenu style={{width: '20px', height: '20px', stroke: 'white'}}/> {selectorGallSlice.users.find(element => element.uid === selectorSingIn.singInId).userName}</div> : ''}</button>}

                </nav>  
            </header>

            {
                modalSettingsToggle && <ModalSettings data={modalSettingsToggle}>
                    <div className={sh.settingModalButtonContainer}>
                        <div className={sh.settingModalButton} onClick={settingsHandle}><SettingsImg style={{width: '25px', height: '25px'}} /><p>Settings</p></div>
                        <div className={sh.settingModalButton} onClick={statisticHandle}><StatisticImg style={{width: '25px', height: '25px'}} /><p>Statistic</p></div>
                        <div className={sh.settingModalButton} onClick={accountHandle}><ContactsImg style={{width: '25px', height: '25px'}} /><p>Account</p></div>
                        <div className={sh.settingModalButton} id='singOut' onClick={userLogOut}><LogoutImg style={{width: '25px', height: '25px'}} /><p></p>Logout</div>
                    </div>
                </ ModalSettings>
            }
            
        
            {modalToggle && <ModalArt openClose={toggleModal}>
               
                {selectorTargetName === 'singIn' || selectorTargetName === 'singUp' ? 
                <div className={sh.toggleSingMode}>
                    <button onClick={changeSingMode} id='singIn' style={selectorTargetName === 'singIn' ? {backgroundColor: 'lightblue', color: 'white',  borderRight: 'solid 2px white', fontSize: '16px'} 
                    : {backgroundColor: 'lightgray', borderBottom: 'solid 2px white',}}><p>SingIn</p></button>
                    <button onClick={changeSingMode} id='singUp' style={selectorTargetName === 'singUp' ? {backgroundColor: 'lightblue', color: 'white',  borderLeft: 'solid 2px white' , fontSize: '16px'}
                    : {backgroundColor: 'lightgray', borderBottom: 'solid 2px white',}}><p>SingUp</p></button>
                </div> : ''}
             
                {selectorTargetName === 'about'? 
                <div className={sh.about}>
                    <img src={AdminFoto} alt='Developer foto' style={{width: '150px', }}></img>
                    <h2 style={{color: 'black'}}>About VomBart and me.</h2>
                    <p>Hello! My name is Dmitry Shevchenko. I have many hobbies, including painting. 
                            Since childhood, I dreamed of learning to draw professionally, because
                             I knew that then I would be happy. That's exactly what happens. 
                             I could not become an artist at the level of famous masters. 
                             However, I am happy when I do it again and again. 
                             I sincerely thank the artist Olga Vlasova, who at a certain stage helped to improve my technical level.
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
                        <legend>SingUp</legend>

                            <div className={sh.field}>
                            
                            <label className={sh.lab}> <EmailImg style={{width: '25px', height: '25px',}}/>
                               
                                <input {...register('Email', {required: 'Please fill the Email field!', 
            
                                value: email, pattern: {value: /\w{0}[a-zA-Zа-яА-Я]+\@\w{0}[a-zA-Zа-яА-Я]+\.\w{0}[a-zA-Zа-яА-Я]/, message: 'Invalid Email!'}})} 
                                className={sh.in} 
                                type="text"
                                autoComplete='false'
                                onChange={inputChange}
                                title="Email"
                                placeholder="Enter email..."></input>
                            </label>
                           
                            <label className={sh.lab}> <KeyImg style={{width: '25px', height: '25px',}} />
                                <input 
                                className={sh.in} {...register('Password', {required: 'Please fill the Password field!', 
            
                                minLength: {value:8, message: 'Invalid length! (8 liters min)'},  value: password,})} 
                                type="password"
                                autoComplete='false'
                                onChange={inputChange}
                                title="Password"
                                placeholder="Enter password..."></input>
                            </label>
                           
                            <label className={sh.lab}> <UserNameImg style={{width: '25px', height: '25px',}}/>
                                <input 
                                className={sh.in} {...register('UserName', {required: 'Please fill the User name field!', 
            
                               maxLength: {value:16, message: 'Invalid length! (16 liters max)'},  value: userName,})} 
                                type="text"
                                autoComplete='false'
                                onChange={inputChange}
                                title="UserName"
                                placeholder="Enter User name..."></input>
                            </label>

                            <button className={sh.button}>SingUp</button>
                            </div>
                        
                        </fieldset>
                    </form>
                </div> : ''}

                {selectorTargetName === 'singIn' ? 
                <div className={sh.sing}>
                    <form className={sh.fise} onSubmit={handleSubmit(addUser)}>
                        <fieldset >
                        <legend >SingIn</legend>
                           
                            <div className={sh.field}>
                            <label className={sh.lab}> <EmailImg style={{width: '25px', height: '25px',}}/>
                                <input {...register('Email', {required: 'Please fill the Email field!', 
            
                                value:email, pattern: {value: /\w{0}[a-zA-Zа-яА-Я]+\@\w{0}[a-zA-Zа-яА-Я]+\.\w{0}[a-zA-Zа-яА-Я]/, message: 'Invalid Email!'}})}

                                className={sh.in} 
                                type="text"
                                autoComplete='false'
                                onChange={inputChange}
                                title="Email"
                                placeholder="Enter email..."></input>
                            </label>
                           
                            <label className={sh.lab}> <KeyImg style={{width: '25px', height: '25px',}} />
                            <input {...register('Password', {required: 'Please fill the Password field!', 
            
                            minLength: {value:8, message: 'Invalid length! (8 liters min)'},  value:password,})}

                            className={sh.in}
                            type="password"
                          
                            onChange={inputChange}
                            autoComplete='false'
                            title="Password"
                            placeholder="Enter password..."></input>
                            </label>

                            <button className={sh.button}>SingIn</button>
                        </div>
                        
                        </fieldset>
                    </form>
                   
                </div> : ''}
                
                    { errorDrive ? errors?.Email ? <p style={{color: 'orange', fontSize: '14px', fontWeight: '600',}}>{errors?.Email?.message}</p> : 
                    errors?.Password ? <p style={{color: 'orange', fontSize: '14px', fontWeight: '600',}}>{errors?.Password?.message}</p> :
                    errors?.UserName ? <p style={{color: 'orange', fontSize: '14px', fontWeight: '600',}}>{errors?.UserName?.message}</p> : '' : ''}

                {selectorTargetName === 'singUp' ? <a href='https://dmshko.github.io/password_generator/' target="_blank">Try using a special resource to create a password.</a> :
                 <a href='' target="_blank">I forgot my password. Will restore via mailbox.</a>}

                {selectorsingUpState.usersId && selectorTargetName === 'singUp' ?
                    <div className={sh.verifiInfo}>
                        <p>A mail verification letter has been sent to your mail. Follow the link in the letter and after the information that you have been verified. Login is performed automatically. If the letter does not come. You can verify your e-mail from your personal account.</p>
                    </div>
                 :''}

            </ModalArt>}

            <section className={sh.section} style={selectorGallSlice.currentItemId !== '' || modalSettingsToggle ? {marginRight: `${(window.innerWidth - document.body.offsetWidth)+35}px`} : {width: '95%'}}>
                <main className={sh.container}>
                    <Suspense fallback={<Loader/>}>
                        <Outlet />
                    </Suspense>
                </main>
            </section>
        
    </>
  )
}

export default SharedLayout