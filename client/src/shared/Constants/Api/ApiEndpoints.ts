const serverHost = `http://${window.location.hostname}:5000/api`;

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
  Kingdoms: `${serverHost}/kingdoms`,
  LocalGroups: `${serverHost}/local-groups`,
  Departments: `${serverHost}/departments`,
  Volunteers: `${serverHost}/volunteers`,
  TimeEntries: `${serverHost}/volunteers/time-entry`,
  DateRange: `${serverHost}/date-range`
};
