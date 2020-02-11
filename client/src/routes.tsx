import Landing from './components/Landing/Landing';
import UserLogin from './components/Login/UserLogin/UserLogin';
import AdminLogin from './components/Login/AdminLogin/AdminLogin';
import AddUser from './components/Register/AddUser/AddUser';
import Volunteer from './components/Edit/Volunteer/Volunteer';

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
    path: ['/edit/volunteer/:id', '/edit/volunteer'],
    component: Volunteer
  }
];

export default routes;
