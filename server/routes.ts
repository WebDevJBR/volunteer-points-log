import { UserController, VolunteerController, ImportController } from './controller';

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
    path: '/register/user',
    method: 'post',
    action: UserController.addUser
  },
  {
    path: '/volunteers',
    method: 'get',
    action: VolunteerController.getVolunteers
  },
  {
    path: '/import/kingdomsAndGroups',
    method: 'post',
    action: ImportController.importKingdomsAndGroups
  },
  {
    path: '/import/volunteers',
    method: 'post',
    action: ImportController.importVolunteers
  },
  {
    path: '/import/departments',
    method: 'post',
    action: ImportController.importDepartments
  }
];
