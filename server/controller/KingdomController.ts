import { Request, Response } from 'express';
import { Kingdom } from '../entity/Kingdom';
import { getManager, Like, Repository } from 'typeorm';
import { HttpStatusCodes } from '../constants/HttpStatusCodes';

/**
 * Handles calls from the 'kingdoms' route.
 */
export default class KingdomController {
  /**
   * Retrieves list of all kingdoms.
   *
   * @param req The HTTP Request Object
   * @param res The HTTP Response Object
   */
  static async getKingdoms(req: Request, res: Response): Promise<void> {
    const kingdoms = await getManager()
      .getRepository(Kingdom)
      .find();

    res.send(kingdoms);
  }

  /**
   * Adds a new Kingdom.
   *
   * @param req The HTTP Request Object
   * @param res The HTTP Response Object
   */
  static async addKingdom(req: Request, res: Response): Promise<void> {
    const kingdom = new Kingdom();
    const kingdomRepo: Repository<Kingdom> = getManager().getRepository(
      Kingdom
    );
    const name: string = req.body.name;
    const existingKingdom: Kingdom = await kingdomRepo.findOne({
      where: { name: Like(name) }
    });

    if (existingKingdom) {
      res
        .status(HttpStatusCodes.Conflict)
        .json(`A matching Kingdom already exists.`);
      return;
    }

    kingdom.name = name;

    await kingdomRepo.save(kingdom);

    res.sendStatus(HttpStatusCodes.Ok);
  }

  /**
   * Updates a single existing kingdom
   * using the ID and properties in the request body.
   *
   * @param req The HTTP Request Object
   * @param res The HTTP Response Object
   */
  static async updateKingdom(req: Request, res: Response): Promise<void> {
    const kingdomRepo: Repository<Kingdom> = getManager().getRepository(
      Kingdom
    );
    const id = req.body.id;
    const newName: string = req.body.name;
    const existingKingdom: Kingdom = await kingdomRepo.findOne({
      where: { name: Like(newName) }
    });

    if (existingKingdom) {
      res
        .status(HttpStatusCodes.Conflict)
        .json(`A Kingdom with the name '${newName}' already exists.`);
      return;
    }

    let kingdomToUpdate = await kingdomRepo.findOne(id);

    kingdomToUpdate = req.body;

    await kingdomRepo.save(kingdomToUpdate);

    res.sendStatus(HttpStatusCodes.Ok);
  }

  /**
   * Deletes a single kingdom from the database
   * given the ID in the query string.
   *
   * @param req The HTTP Request Object
   * @param res The HTTP Response Object
   */
  static async deleteKingdom(req: Request, res: Response): Promise<void> {
    const kingdomRepo: Repository<Kingdom> = getManager().getRepository(
      Kingdom
    );
    const id = req.params.id;
    const kingdom = await kingdomRepo.findOne(id);

    if (kingdom) {
      await kingdomRepo.remove(kingdom);

      res
        .status(HttpStatusCodes.Ok)
        .json(`Kingdom with ID: ${id} deleted successfully.`);
      return;
    }
    res
      .status(HttpStatusCodes.NotFound)
      .json(`Kingdom with ID: ${id} not found.`);
  }
}
