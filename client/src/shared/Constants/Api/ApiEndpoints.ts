const serverHost = 'http://' + window.location.hostname + ':5000'

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
  Users: `${serverHost}/api/users`,
  Login: `${serverHost}/api/login`,
  Kingdoms: `${serverHost}/api/kingdoms`,
  LocalGroups: `${serverHost}/api/local-groups`,
  Departments: `${serverHost}/api/departments`,
  Volunteers: `${serverHost}/api/volunteers`,
  DateRange: `${serverHost}/api/date-range`,

  /**
   * Volunteers
   */
  GetVolunteers: `${serverHost}/api/volunteers`
};
