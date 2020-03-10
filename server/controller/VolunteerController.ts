import { Request, Response } from 'express';
import { Volunteer } from '../entity/Volunteer';
import { getManager, Like, Repository } from 'typeorm';
import { HttpStatusCodes } from '../constants/HttpStatusCodes';

/**
 * Handles calls from the 'volunteers' route.
 */
export class VolunteerController {
  /**
   * Gets a list of volunteers given the filter information
   * found in the query string.
   * @param request The HTTP Request Object
   * @param response The HTTP Response Object
   */
  static async getVolunteers(
    request: Request,
    response: Response
  ): Promise<void> {
    const filter = request.query.filter || '';
    const volunteers = await getManager()
      .getRepository(Volunteer)
      .find({
        where: [
          { name: Like(`%${filter}%`) },
          { mka: Like(`%${filter}%`) },
          { membershipNumber: Like(`%${filter}%`) }
        ]
      });

    response.send(volunteers);
  }

  /**
   * Retrieves a single volunteer from the database
   * given the filter information in the query string.
   *
   * @param request The HTTP Request Object
   * @param response The HTTP Response Object
   */
  static async getVolunteer(
    request: Request,
    response: Response
  ): Promise<void> {
    const id = request.params.id;
    const volunteerRepo: Repository<Volunteer> = getManager().getRepository(
      Volunteer
    );
    const volunteer: Volunteer = await volunteerRepo
      .createQueryBuilder('volunteer')
      .loadAllRelationIds()
      .where(`volunteer.id = ${id}`)
      .getOne();

    response.send(volunteer);
  }

  /**
   * Adds a new Volunteer
   *
   * @param request The HTTP Request Object
   * @param response The HTTP Response Object
   */
  static async addVolunteer(
    request: Request,
    response: Response
  ): Promise<void> {
    const volunteer = new Volunteer();
    const volunteerRepo: Repository<Volunteer> = getManager().getRepository(
      Volunteer
    );
    const name: string = request.body.name;
    const existingVolunteer: Volunteer = await volunteerRepo.findOne({
      where: { name: Like(name) }
    });

    if (existingVolunteer) {
      response
        .status(HttpStatusCodes.Conflict)
        .json(`A matching Volunteer already exists.`);
      return;
    }

    volunteer.name = request.body.name;
    volunteer.mka = request.body.mka;
    volunteer.membershipNumber = request.body.membershipNumber;
    volunteer.kingdom = request.body.kingdom;
    volunteer.localGroup = request.body.localGroup;
    volunteer.toReceiveFundsType = request.body.toReceiveFundsType;
    volunteer.other = request.body.other;

    volunteer.infoMissing = request.body.infoMissing;

    await volunteerRepo.save(volunteer);

    response.sendStatus(HttpStatusCodes.Ok);
  }

  /**
   * Updates a single existing kingdom
   * using the ID and properties in the request body.
   *
   * @param req The HTTP Request Object
   * @param res The HTTP Response Object
   */
  static async updateVolunteer(req: Request, res: Response): Promise<void> {
    const volunteerRepo: Repository<Volunteer> = getManager().getRepository(
      Volunteer
    );
    const id = req.body.id;
    const newMka = req.body.mka;
    const existingVolunteer: Volunteer = await volunteerRepo.findOne({
      where: { mka: Like(newMka) }
    });

    if (existingVolunteer && existingVolunteer.id !== id) {
      res
        .status(HttpStatusCodes.Conflict)
        .json(`A Volunteer with mka '${newMka}' already exists.`);
      return;
    }

    let volunteerToUpdate: Volunteer = await volunteerRepo.findOne(id);

    volunteerToUpdate = req.body;

    await volunteerRepo.update(id, volunteerToUpdate);

    res.sendStatus(HttpStatusCodes.Ok);
  }

  /**
   * Deletes a single volunteer from the database
   * given the ID found in the query string.
   *
   * @param request The HTTP Request Object
   * @param response The HTTP Response Object
   */
  static async deleteVolunteer(
    request: Request,
    response: Response
  ): Promise<void> {
    const volunteerRepo: Repository<Volunteer> = getManager().getRepository(
      Volunteer
    );
    const id = request.params.id;
    const volunteer = await volunteerRepo.findOne(id);

    if (volunteer) {
      await volunteerRepo.remove(volunteer);

      response
        .status(HttpStatusCodes.Ok)
        .json(`Volunteer with ID: ${id} deleted successfully.`);
      return;
    }
    response
      .status(HttpStatusCodes.NotFound)
      .json(`Volunteer with ID: ${id} not found.`);
  }
}
