import Landing from './components/Landing/Landing';
import UserLogin from './components/Login/UserLogin/UserLogin';
import AdminLogin from './components/Login/AdminLogin/AdminLogin';

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
  }
];

export default routes;
