import UserController from "./controller/UserController";
import VolunteerController from "./controller/VolunteerController";

/**
 * All application routes
 */
export const AppRoutes = [
  {
    path: "/users",
    method: "get",
    action: UserController.getUsers
  },
  {
    path: "/volunteers",
    method: "get",
    action: VolunteerController.getVolunteers
  }
];
