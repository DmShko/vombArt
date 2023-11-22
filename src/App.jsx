import { Route, Routes } from 'react-router-dom';
import { nanoid } from 'nanoid';
import React from 'react'

// import component pages
import SharedLayout from './components/SharedLayout/SharedLayout'
import Community from './components/Community/Community';
import NotFound from './components/NotFound/NotFound';
import Home from 'pages/Home/Home';
import WorkSpace from 'components/WorkSpace/WorkSpace';

const LIRICS = '/lirics';
const MUSIC = '/music';
const DRAWING = '/drawing';
const COMMUNITY = '/community';
const NOTFOUND = '/*';

const App = () => {

// Routes
const appRoutes = [
  
  {path: LIRICS, element: <WorkSpace />,},
  {path: MUSIC, element: <WorkSpace />,},
  {path: DRAWING, element: <WorkSpace />,},  
  {path: COMMUNITY, element: <Community />,}, 
  {path: NOTFOUND, element: <NotFound />,}
];

  return (
    <>
      <Routes>
        <Route path="/" element={<SharedLayout />}>
          <Route index
            element={<Home/>}
          />

          {appRoutes.map(({ path, element }) => 
          {return <Route key={nanoid()} path={path} element={element}/>})}

        </Route>
      </Routes>
    </>
  )
}

export default App