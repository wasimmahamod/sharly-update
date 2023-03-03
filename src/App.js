import React from 'react'
import {
  createBrowserRouter,
  RouterProvider,
  Route,
  Link,
} from "react-router-dom";
import Login from './pages/login/Login';
import Singup from './pages/singup/Singup';
import Home from './pages/home/Home';
import Profile from './pages/profile/Profile';
import Chat from './pages/chat/Chat';
import Form from './components/Form'
import store from './store'
import { Provider } from 'react-redux'
import Logout from './pages/logout/Logout';
import Forgetpassword from './pages/forgetpass/index';
import Setting from './pages/setting/Setting';

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <Singup/>
    ),
  },
  {
    path: "/login",
    element: (
      <Login/>
    ),
  },
  {
    path: "/home",
    element: (
      <Home/>
    ),
  },
  {
    path: "/profile",
    element: (
      <Profile/>
    ),
  },
  {
    path: "/chat",
    element: (
      <Chat/>
    ),
  },
  {
    path: "/form",
    element: (
      <Form/>
    ),
  },
  {
    path: "/logout",
    element: (
      <Logout/>
    ),
  },
  {
    path: "/forgetpassword",
    element: (
      <Forgetpassword/>
    ),
  },
  {
    path: "/setting",
    element: (
      <Setting/>
    ),
  },

]);

const App = () => {
  return (
    <Provider store={store}>
    <RouterProvider router={router} />
    </Provider>
  )
}

export default App