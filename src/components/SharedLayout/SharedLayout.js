import { NavLink, Outlet } from 'react-router-dom';
import { Suspense, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';

import { getDatabase, ref, onValue } from 'firebase/database';

import ModalArt from 'components/ModalArt/ModalArt';
import ModalSettings from 'components/ModalSettings/ModalSettings';
import singUpAPI from '../../API/singUpAPI';
import singInAPI from '../../API/singInAPI';
import singOutAPI from '../../API/singOutAPI';
import writeUserData from 'API/writerDB';
import { change } from 'vomgallStore/gallerySlice';
import { changePathName } from 'vomgallStore/pathSlice';
import { changeSingIn } from 'vomgallStore/singInSlice';
import { changeSingUp } from 'vomgallStore/singUpSlice';

import {ReactComponent as KeyImg} from '../../images/key-svgrepo-com.svg';
import {ReactComponent as EmailImg} from '../../images/email-8-svgrepo-com.svg';
import {ReactComponent as UserNameImg} from '../../images/user-id-svgrepo-com.svg';
import {ReactComponent as UserMenu} from '../../images/user-svgrepo-com.svg';

import { ReactComponent as SettingsImg } from '../../images/settings-svgrepo-com.svg'
import { ReactComponent as LogoutImg } from '../../images/logout-svgrepo-com.svg'

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

  const { register, handleSubmit, formState:{errors}, reset} = useForm({mode: 'onBlur'});
  
  const dispatch = useDispatch();

  const selectorGallSlice = useSelector(state => state.gallery);
  const selectorSingIn = useSelector(state => state.singIn);
  const selectorTargetName = useSelector(state => state.gallery.buttonTargetName);
  const selectorVisibilityLog = useSelector(state => state.singIn.isSingIn);
  const selectorsingUpState = useSelector(state => state.singUp);
  const selectorUserExist = useSelector(state => state.singUp.userExist);

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
        console.log(actualUsers);
        // if(actualUsers.find(element => element.status === true) !== undefined || actualUsers.find(element => element.status === true) !== null) {
            console.log(actualUsers.find(element => element.status === true).userName);
            dispatch(changePathName({data: actualUsers.find(element => element.status === true).userName}));
            dispatch(change({operation: 'updateUsersArray', data: actualUsers}));
        // }
      });

    };  

  },[selectorSingIn.isSingIn]);
  
  useEffect(() => {

    if(selectorsingUpState.userName !== '') {

       // change userName in array Users (gallerySlice)
       dispatch(change({operation: 'changeUserName', data: {userName: selectorsingUpState.userName, email: selectorsingUpState.email}}));

    };  

  },[selectorsingUpState.userName]);

  // add user array to DB, when he was changed
  useEffect(() => {
    // add user array to database if are not empty []
    if(selectorSingIn.isSingIn === true) {
        if(selectorGallSlice.users.length !== 0 && selectorGallSlice.users !== null && selectorGallSlice.users !== undefined) {
          
           console.log(selectorGallSlice.users)
            writeUserData(
                'users',
                selectorGallSlice.users,
                null, true
            );
        } 
    }
    

  },[selectorGallSlice.users, selectorSingIn.isSingIn]);

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
            
        // write that user exist
        dispatch(changeSingUp({operation: 'changeUserExist', data: true}));
        
    }
     
     
  },[selectorsingUpState.email]);

  // singIn after singUp at same time

  useEffect(() => {

    // only if no current logIn users and modal window is closed
    if(selectorsingUpState.usersId !== '' && modalToggle === true) dispatch(singInAPI({email: email, password: password}));

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
        // dispatch(change({operation: 'changeUserStatus', data: {id: selectorSingIn.singInId, status: false}}));
        dispatch(changeSingIn({data: '', operation: 'changeSingInId'}));
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

  return (
    <>
        
            <header className={sh.header}>
               <nav className={sh.pageNav}>
                        <NavLink className={sh.link} to="/">
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
                        <div className={sh.settingModalButton}><SettingsImg style={{width: '25px', height: '25px'}} /><p>Settings</p></div>
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
                    <h2 style={{color: 'black'}}>About VomBart and me.</h2>
                    <p>Hello! My name is Dmitry. I have many hobbies, including painting. 
                            Since childhood, I dreamed of learning to draw professionally, because
                             I knew that then I would be happy. That's exactly what happens. 
                             I could not become an artist at the level of famous masters. 
                             However, I am happy when I do it again and again. 
                             I sincerely thank the artist Olga Vlasova, who at a certain stage helped to improve my technical level.
                             </p>
                </div> : ''}
              
                {selectorTargetName === 'contacts' ? 
                <div className={sh.contacts}>
                    <p style={{color: 'black'}}> LinkedIn: </p>
                    <p style={{color: 'black'}}> Email: </p>
                </div> : ''}

                {selectorTargetName === 'singUp' ? 
                <div className={sh.sing}>
                    <form className={sh.fise} onSubmit={handleSubmit(addUser)}>
                        <fieldset>
                        <legend>SingUp</legend>

                            <div className={sh.field}>
                            
                            <label className={sh.lab}> <EmailImg style={{width: '25px', height: '25px',}}/>
                               
                                <input {...register('Email', {required: 'Please fill the Email field!', 
            
                                maxLength: {value:16, message: 'Invalid length!'},  value: email, pattern: {value: /\w{0}[a-zA-Zа-яА-Я]+\@\w{0}[a-zA-Zа-яА-Я]+\.\w{0}[a-zA-Zа-яА-Я]/, message: 'Invalid Email!'}})} 
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
            
                                maxLength: {value:16, message: 'Invalid length! '},  value:email, pattern: {value: /\w{0}[a-zA-Zа-яА-Я]+\@\w{0}[a-zA-Zа-яА-Я]+\.\w{0}[a-zA-Zа-яА-Я]/, message: 'Invalid Email!'}})}

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
                
                    {errors?.Email ? <p style={{color: 'orange', fontSize: '14px', fontWeight: '600',}}>{errors?.Email?.message}</p> : 
                    errors?.Password ? <p style={{color: 'orange', fontSize: '14px', fontWeight: '600',}}>{errors?.Password?.message}</p> :
                    errors?.UserName ? <p style={{color: 'orange', fontSize: '14px', fontWeight: '600',}}>{errors?.UserName?.message}</p> : ''}

            </ModalArt>}

            <section className={sh.section}>
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