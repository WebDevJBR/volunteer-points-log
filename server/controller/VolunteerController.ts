import { Request, Response } from "express";
import { Volunteer } from "../entity/Volunteer";
import { getManager, Like } from "typeorm";

/**
 * Handles calls from the 'volunteers' route.
 */
export default class VolunteerController {
  
  /**
   * Gets a list of volunteers given the filter information
   * found in the query string.
   * @param request The HTTP Request Object
   * @param response The HTTP Response Object 
   */
  static async getVolunteers(request: Request, response: Response): Promise<void> {
    const filter = request.query.filter;
    const volunteers = await getManager()
      .getRepository(Volunteer)
      .find({
        where: [
          { name: Like(`%${filter}%`)},
          { mqa: Like(`%${filter}%`)},
          { membershipNumber: Like(`%${filter}%`)}
        ]
      });

    response.send(volunteers);
  }
}
