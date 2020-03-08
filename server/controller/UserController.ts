import { Request, Response } from 'express';
import { getManager, Like, Repository } from 'typeorm';
import { User } from '../entity/User';
import { HttpStatusCodes } from '../constants/HttpStatusCodes';
import CryptoHelper from '../utils/CryptoHelper';
import passport = require('passport');

/**
 * Handles calls from the 'users' route.
 */
export class UserController {
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
    const newUser: User = new User();
    const userRepo: Repository<User> = getManager().getRepository(User);
    const username: string = request.body.username as string;
    const password: string = request.body.password as string;

    let existingUser: User;
    let salt: string;

    if (!username || !password) {
      response
        .status(HttpStatusCodes.BadRequest)
        .json('You must provide a username and password.');
      return;
    }

    existingUser = await userRepo.findOne({
      where: { name: Like(username) }
    });

    if (existingUser) {
      response
        .status(HttpStatusCodes.Conflict)
        .json('A matching user already exists.');
      return;
    }

    salt = CryptoHelper.generateSalt();

    newUser.name = username;
    newUser.password = CryptoHelper.hashPassword(password, salt);
    newUser.salt = salt;
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

/**
   * Updates a single existing user
   * using the ID and properties in the request body.
   * 
   * TODO: Update this method in the future for fully updating a user. 
   * It was implemented in the first iteration for only updating the Admin User's password
   * 
   * @param req The HTTP Request Object
   * @param res The HTTP Response Object
   */
  static async updateUser(req: Request, res: Response): Promise<void> {
    const updateUser: User = new User();
    const userRepo: Repository<User> = getManager().getRepository(User);
    const username: string = req.body.username as string;
    const newPassword: string = req.body.password;

    let existingUser: User;
    let salt: string;

    if (req.body.admin !== "true"){
      res
        .status(HttpStatusCodes.BadRequest)
        .json('Only admin passwords can be reset.');
      return;
    }

    if (!username || !newPassword) {
      res
        .status(HttpStatusCodes.BadRequest)
        .json('You must provide a username and new password to update.');
      return;
    }

    existingUser = await userRepo.findOne({
      where: { name: Like(username) }
    });
    if (existingUser) {
      let id = existingUser.id;
      salt = CryptoHelper.generateSalt();

      updateUser.name = username;
      updateUser.password = CryptoHelper.hashPassword(newPassword, salt);
      updateUser.salt = salt;
      updateUser.admin = true;

      await userRepo.update(id, updateUser);

      res.sendStatus(HttpStatusCodes.Ok);
    }
    else {
      res
      .status(HttpStatusCodes.NotFound)
      .json(`User with username: ${username} not found.`);
    }
  }
}
