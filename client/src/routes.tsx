import Landing from './components/Landing/Landing';
import UserLogin from './components/Login/UserLogin/UserLogin';
import AdminLogin from './components/Login/AdminLogin/AdminLogin';
import AddUser from './components/Register/AddUser/AddUser';
import AddVolunteer from './components/Register/AddVolunteer/AddVolunteer';

const routes = [
  {
    path: '/login/user',
    component: UserLogin
  },
  {
    path: '/login/admin',
    component: AdminLogin
  },
  {
    path: '/landing',
    component: Landing
  },
  {
    path: '/register/user',
    component: AddUser
  },
  {
    path: '/register/volunteer',
    component: AddVolunteer
  }
];

export default routes;
