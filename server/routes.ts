import UserController from './controller/UserController';
import VolunteerController from './controller/VolunteerController';
import KingdomController from './controller/KingdomController';
import DepartmentController from './controller/DepartmentController';
import LocalGroupController from './controller/LocalGroupController';

/**
 * All application routes
 */
export const AppRoutes = [
  {
    path: '/getUsers',
    method: 'get',
    action: UserController.getUsers
  },
  {
    path: '/register/user',
    method: 'post',
    action: UserController.addUser
  },
  {
    path: '/deleteUser',
    method: 'delete',
    action: UserController.deleteUser
  },
  {
    path: '/getVolunteers',
    method: 'get',
    action: VolunteerController.getVolunteers
  },
  {
    path: '/getVolunteer',
    method: 'get',
    action: VolunteerController.getVolunteer
  },
  {
    path: '/addVolunteer',
    method: 'post',
    action: VolunteerController.addVolunteer
  },
  {
    path: '/updateVolunteer',
    method: 'put',
    action: VolunteerController.updateVolunteer
  },
  {
    path: '/deleteVolunteer',
    method: 'delete',
    action: VolunteerController.deleteVolunteer
  },
  {
    path: '/getKingdoms',
    method: 'get',
    action: KingdomController.getKingdoms
  },
  {
    path: '/addKingdom',
    method: 'post',
    action: KingdomController.addKingdom
  },
  {
    path: '/updateKingdom',
    method: 'put',
    action: KingdomController.updateKingdom
  },
  {
    path: '/deleteKingdom',
    method: 'delete',
    action: KingdomController.deleteKingdom
  },
  {
    path: '/getDepartments',
    method: 'get',
    action: DepartmentController.getDepartments
  },
  {
    path: '/addDepartment',
    method: 'post',
    action: DepartmentController.addDepartment
  },
  {
    path: '/updateDepartment',
    method: 'put',
    action: DepartmentController.updateDepartment
  },
  {
    path: '/deleteDepartment',
    method: 'delete',
    action: DepartmentController.deleteDepartment
  },
  {
    path: '/getLocalGroups',
    method: 'get',
    action: LocalGroupController.getLocalGroups
  },
  {
    path: '/addLocalGroup',
    method: 'post',
    action: LocalGroupController.addLocalGroup
  },
  {
    path: '/updateLocalGroup',
    method: 'put',
    action: LocalGroupController.updateLocalGroup
  },
  {
    path: '/deleteLocalGroup',
    method: 'delete',
    action: LocalGroupController.deleteLocalGroup
  }
];
