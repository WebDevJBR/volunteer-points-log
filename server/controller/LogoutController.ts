/**
 ** 
 * Handles calls from the 'logout' route.
 */

import { Request, Response } from 'express';

export default class LogoutController {
    /**
   * @param req The HTTP Request Object
   * @param res The HTTP Response Object
   */

  static async logout(req: Request, res: Response): Promise<void> {
    await req.logout();      
    await res.clearCookie('connect.sid', { path: '/' });
    await res.redirect('/');   
  }
}