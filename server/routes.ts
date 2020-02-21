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
    path: '/users',
    method: 'get',
    action: UserController.getUsers
  },
  {
    path: '/users',
    method: 'post',
    action: UserController.addUser
  },
  {
    path: '/users',
    method: 'delete',
    action: UserController.deleteUser
  },
  {
    path: '/volunteers',
    method: 'get',
    action: VolunteerController.getVolunteers
  },
  {
    path: '/volunteers/:id',
    method: 'get',
    action: VolunteerController.getVolunteer
  },
  {
    path: '/volunteers',
    method: 'post',
    action: VolunteerController.addVolunteer
  },
  {
    path: '/volunteers',
    method: 'put',
    action: VolunteerController.updateVolunteer
  },
  {
    path: '/volunteers',
    method: 'delete',
    action: VolunteerController.deleteVolunteer
  },
  {
    path: '/kingdoms',
    method: 'get',
    action: KingdomController.getKingdoms
  },
  {
    path: '/kingdoms',
    method: 'post',
    action: KingdomController.addKingdom
  },
  {
    path: '/kingdoms',
    method: 'put',
    action: KingdomController.updateKingdom
  },
  {
    path: '/kingdoms',
    method: 'delete',
    action: KingdomController.deleteKingdom
  },
  {
    path: '/departments',
    method: 'get',
    action: DepartmentController.getDepartments
  },
  {
    path: '/departments',
    method: 'post',
    action: DepartmentController.addDepartment
  },
  {
    path: '/departments',
    method: 'put',
    action: DepartmentController.updateDepartment
  },
  {
    path: '/departments',
    method: 'delete',
    action: DepartmentController.deleteDepartment
  },
  {
    path: '/local-groups',
    method: 'get',
    action: LocalGroupController.getLocalGroups
  },
  {
    path: '/local-groups',
    method: 'post',
    action: LocalGroupController.addLocalGroup
  },
  {
    path: '/local-groups',
    method: 'put',
    action: LocalGroupController.updateLocalGroup
  },
  {
    path: '/local-groups',
    method: 'delete',
    action: LocalGroupController.deleteLocalGroup
  }
];
