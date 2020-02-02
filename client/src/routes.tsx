import Landing from './components/Landing/Landing';
import UserLogin from './components/Login/UserLogin/UserLogin';
import AdminLogin from './components/Login/AdminLogin/AdminLogin';
import AddUser from './components/Register/AddUser/AddUser';

const routes = [
  {
    path: '/landing',
    component: Landing
  },
  {
    path: '/login/user',
    component: UserLogin
  },
  {
    path: '/login/admin',
    component: AdminLogin
  },
  {
    path: '/register/user',
    component: AddUser
  }
];

export default routes;
