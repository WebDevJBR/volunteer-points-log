const serverHost = `http://${window.location.hostname}:${window.location.port}/api`;

/**
 * API Endpoints through which HTTP requests are routed.
 */
export const ApiEndpoints = {
  /**
   * Users
   */
  UserLogin: '/login/user',
  AdminLogin: '/login/admin',

  /**
   * API Endpoints
   */
  Users: `${serverHost}/users`,
  Login: `${serverHost}/login`,
  Logout: `${serverHost}/logout`,
  Kingdoms: `${serverHost}/kingdoms`,
  LocalGroups: `${serverHost}/local-groups`,
  Departments: `${serverHost}/departments`,
  Volunteers: `${serverHost}/volunteers`,
  TimeEntries: `${serverHost}/volunteers/time-entry`,
  DateRange: `${serverHost}/date-range`,
  ImportKingdomsAndGroups: `${serverHost}/import/kingdomsAndGroups`,
  ImportVolunteers: `${serverHost}/import/volunteers`,
  ImportDepartments: `${serverHost}/import/departments`,
  ExportKingdoms: `${serverHost}/export/kingdoms`,
  ExportBreakdown: `${serverHost}/export/breakdown`
};
