import { UserController } from './controller/UserController';
import { VolunteerController } from './controller/VolunteerController';
import { ImportController } from './controller/ImportController';
import { ExportController } from './controller/ExportController';
import { KingdomController } from './controller/KingdomController';  
import { DepartmentController } from './controller/DepartmentController';
import { LocalGroupController } from './controller/LocalGroupController';
import { DateRangeController } from './controller/DateRangeController';
import { VolunteerTimeEntryController } from './controller/VolunteerTimeEntryController';
import { ToReceiveFundsTypeController } from './controller/toReceiveFundsTypeController';


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
    path: '/users',
    method: 'put',
    action: UserController.updateUser
  },
  {
    path: '/volunteers/time-entry',
    method: 'post',
    action: VolunteerTimeEntryController.addTimeEntry
  },
  {
    path: '/volunteers/time-entry',
    method: 'get',
    action: VolunteerTimeEntryController.getTimeEntries
  },
  {
    path: '/volunteers/time-entry',
    method: 'put',
    action: VolunteerTimeEntryController.updateTimeEntry
  },
  {
    path: '/volunteers/time-entry',
    method: 'delete',
    action: VolunteerTimeEntryController.deleteTimeEntry
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
  },
  {
    path: '/date-range',
    method: 'get',
    action: DateRangeController.getDateRange
  },
  {
    path: '/date-range',
    method: 'post',
    action: DateRangeController.addDateRange
  },
  {
    path: '/date-range',
    method: 'put',
    action: DateRangeController.updateDateRange
  },
  {
    path: '/date-range',
    method: 'delete',
    action: DateRangeController.deleteDateRange
  },
  {
    path: '/funds-type',
    method: 'get',
    action: ToReceiveFundsTypeController.getFundsTypes
  },
  {
    path: '/funds-type',
    method: 'post',
    action: ToReceiveFundsTypeController.addFundsType
  },
  {
    path: '/funds-type',
    method: 'put',
    action: ToReceiveFundsTypeController.updateFundsType
  },
  {
    path: '/funds-type',
    method: 'delete',
    action: ToReceiveFundsTypeController.deleteFundsType
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
  },
  {
    path: '/export/kingdoms',
    method: 'get',
    action: ExportController.exportKingdomHours
  },
  {
    path: '/export/breakdown',
    method: 'get',
    action: ExportController.exportKingdomBreakdown
  }
];