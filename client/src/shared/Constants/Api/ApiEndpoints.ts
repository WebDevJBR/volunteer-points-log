const serverHost = 'http://localhost:5000'

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

  /**
   * Volunteers
   */
  GetVolunteers: `${serverHost}/api/volunteers`,

  /**
   * Imports
   */
  ImportKingdomsAndGroups: `${serverHost}/api/import/kingdomsAndGroups`,
  ImportVolunteers: `${serverHost}/api/import/volunteers`,
  ImportDepartments: `${serverHost}/api/import/departments`,

  /**
   * Exports
   */
  ExportKingdoms: `${serverHost}/api/export/kingdoms`,
  ExportBreakdown: `${serverHost}/api/export/breakdown`
};
