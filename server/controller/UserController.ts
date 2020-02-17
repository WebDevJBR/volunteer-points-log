import { Request, Response } from 'express';
import { getManager, Like, Repository } from 'typeorm';
import { User } from '../entity/User';
import { HttpStatusCodes } from '../constants/HttpStatusCodes';

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
        where: { admin: false }
      });

    response.send(users);
  }

  /**
   * Adds a new User.
   * @param request The HTTP request.
   * @param response The HTTP response.
   */
  static async addUser(request: Request, response: Response): Promise<void> {
    const newUser = new User();
    const userRepo: Repository<User> = getManager().getRepository(User);
    const username: string = request.body.username as string;
    const existingUser: User = await userRepo.findOne({
      where: { name: Like(username) }
    });

    if (existingUser) {
      response
        .status(HttpStatusCodes.Conflict)
        .json('A matching user already exists.');
      return;
    }

    newUser.name = username;
    newUser.admin = false;

    await userRepo.save(newUser);

    response.sendStatus(HttpStatusCodes.Ok);
  }

  /**
   * Deletes a single user from the database
   * given the ID in the query string.
   *
   * @param request The HTTP Request Object
   * @param response The HTTP Response Object
   */
  static async deleteUser(request: Request, response: Response): Promise<void> {
    const userRepo: Repository<User> = getManager().getRepository(User);
    const id = request.params.id;
    const user = await userRepo.findOne(id);

    if (user) {
      await userRepo.remove(user);

      response
        .status(HttpStatusCodes.Ok)
        .json(`User with ID: ${id} deleted successfully.`);
      return;
    }
    response
      .status(HttpStatusCodes.NotFound)
      .json(`User with ID: ${id} not found.`);
  }
}
