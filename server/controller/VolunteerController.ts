import { Request, Response } from "express";
import { Volunteer } from "../entity/Volunteer";
import { getManager } from "typeorm";

export default class VolunteerController {
  static async getVolunteers(request: Request, response: Response): Promise<void> {
    const filter = request.query.filter;
    const volunteers = await getManager()
      .getRepository(Volunteer)
      .createQueryBuilder("v")
      .where(
        "v.name LIKE :query OR v.mka LIKE :query OR v.membershipNumber LIKE :query",
        { query: "%" + filter + "%" }
      )
      .getMany();

    response.send(volunteers);
  }
}
