import { Request, Response } from "express";
import { getManager, Like, Not } from "typeorm";
import { User } from "../entity/User";

/**
 * Handles calls from the 'users' route.
 */
export default class UserController {
  
  /**
   * Gets a collection of all users.
   * @param request The HTTP request.
   * @param response The HTTP response.
   */
  static async getUsers(request: Request, response: Response): Promise<void> {
    const users = await getManager()
      .getRepository(User)
      .find({
        where: {
          name: Not(Like("%admin%"))
        }
      });

    response.send(users);
  }
}
