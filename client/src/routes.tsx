import Login from './components/Login/Login';
import UserLogin from './components/Login/UserLogin/UserLogin';
import AdminLogin from './components/Login/AdminLogin/AdminLogin';
import AddUser from './components/Register/AddUser/AddUser';
import Volunteer from './components/Edit/Volunteer/Volunteer';
import AdminLanding from './components/Landing/AdminLanding/AdminLanding';

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
    path: '/login',
    component: Login
  },
  {
    path: '/register/user',
    component: AddUser
  },
  {
    path: '/landing/admin',
    component: AdminLanding
  },
  {
    path: ['/edit/volunteer/:id', '/edit/volunteer'],
    component: Volunteer
  }
];

export default routes;
