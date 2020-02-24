import { getManager, Like, Repository } from 'typeorm';
import { LocalGroup } from '../entity/LocalGroup';
import { Request, Response } from 'express';
import { HttpStatusCodes } from '../constants/HttpStatusCodes';

/**
 * Handles calls from the 'local groups' route.
 */
export default class LocalGroupController {
  /**
   * Retrieves list of all local groups.
   *
   * @param req The HTTP Request Object
   * @param res The HTTP Response Object
   */
  static async getLocalGroups(req: Request, res: Response): Promise<void> {
    const kingdom = req.query.kingdom || '';
    const localGroupRepo: Repository<LocalGroup> = getManager().getRepository(
      LocalGroup
    );

    const localGroups = await localGroupRepo.find({
      where: {kingdom: Like(`%${kingdom}%`)}
    });

    res.send(localGroups);
  }

  /**
   * Adds a new Local Group
   *
   * @param req The HTTP Request Object
   * @param res The HTTP Response Object
   */
  static async addLocalGroup(req: Request, res: Response): Promise<void> {
    const localgroup = new LocalGroup();
    const lgRepo: Repository<LocalGroup> = getManager().getRepository(
      LocalGroup
    );
    const name: string = req.body.name;
    const existingLG: LocalGroup = await lgRepo.findOne({
      where: { name: Like(name) }
    });

    if (existingLG) {
      res
        .status(HttpStatusCodes.Conflict)
        .json(`A matching Local Group already exists.`);
      return;
    }

    localgroup.name = req.body.name;
    localgroup.kingdom = req.body.kingdom;

    await lgRepo.save(localgroup);

    res.sendStatus(HttpStatusCodes.Ok);
  }

  /**
   * Updates a single existing local group
   * using the ID and properties in the request body.
   *
   * @param req The HTTP Request Object
   * @param res The HTTP Response Object
   */
  static async updateLocalGroup(req: Request, res: Response): Promise<void> {
    const lgRepo: Repository<LocalGroup> = getManager().getRepository(
      LocalGroup
    );
    const id = req.body.id;
    const newName: string = req.body.name;
    const existingLG: LocalGroup = await lgRepo.findOne({
      where: { name: Like(newName) }
    });

    if (existingLG && existingLG.id !== id) {
      res
        .status(HttpStatusCodes.Conflict)
        .json(`A Local Group with the name '${newName}' already exists.`);
      return;
    }

    let localGroupToUpdate = await lgRepo.findOne(id);

    localGroupToUpdate = req.body;

    await lgRepo.update(id, localGroupToUpdate);

    res.sendStatus(HttpStatusCodes.Ok);
  }

  /**
   * Deletes a single local group from the database
   * given the ID in the query string.
   *
   * @param req The HTTP Request Object
   * @param res The HTTP Response Object
   */
  static async deleteLocalGroup(req: Request, res: Response): Promise<void> {
    const lgRepo: Repository<LocalGroup> = getManager().getRepository(
      LocalGroup
    );
    const id = req.params.id;
    const localgroup = await lgRepo.findOne(id);

    if (localgroup) {
      await lgRepo.remove(localgroup);

      res
        .status(HttpStatusCodes.Ok)
        .json(`Local Group with ID: ${id} deleted successfully.`);
      return;
    }
    res
      .status(HttpStatusCodes.NotFound)
      .json(`Local Group with ID: ${id} not found.`);
  }
}
