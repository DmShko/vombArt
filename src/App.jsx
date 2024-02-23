import { Route, Routes } from 'react-router-dom';
// import { useSelector } from 'react-redux';
import { nanoid } from 'nanoid';
import React from 'react'

// import component pages
import SharedLayout from './components/SharedLayout/SharedLayout'
import CommunityPanel from './pages/CommunityPanel/CommunityPanel';
import NotFound from './components/NotFound/NotFound';
import Home from 'pages/Home/Home';
import WorkSpace from './components/WorkSpace/WorkSpace';
import UserSettings from './components/UserSettings/UserSettings';
import Guide from './components/Guide/Guide';
import Account from './components/Account/Account';

const WORKSPACE = '/workspace';
const COMMUNITY = '/community';
const NOTFOUND = '/*';
const USERSETTINGS = '/usersettings';
const GUIDE = '/Guide';
const ACCOUNT = '/account';

const App = () => {

// Routes
const appRoutes = [
  
  {path: WORKSPACE, element: <WorkSpace />,}, 
  {path: COMMUNITY, element: <CommunityPanel />,}, 
  {path: USERSETTINGS, element: <UserSettings />,},
  {path: GUIDE, element: <Guide />,},
  {path: ACCOUNT, element: <Account />,},
  {path: NOTFOUND, element: <NotFound />,},
  
];

  return (
    <>
      <Routes>
        <Route path="/" element={<SharedLayout />}>
          <Route index
            element={<Home/>}
          />

          {appRoutes.map(({ path, element }) => 
          {return <Route key={nanoid()} path= {path} element={element}/>})}
          
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </>
  )
}

export default App