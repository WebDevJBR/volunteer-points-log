/**
 ** 
 * Handles calls from the 'funds-type' route.
 */

import { Request, Response } from 'express';
import { ToReceiveFundsType_REF } from '../entity/toReceiveFundsType_REF';
import { getManager, Like, Repository } from 'typeorm';
import { HttpStatusCodes } from '../constants/HttpStatusCodes';

export default class toReceiveFundsTypeController {
  /**
   * Retrieves all ToReceiveFundsTypes.
   *
   * @param req The HTTP Request Object
   * @param res The HTTP Response Object
   */

  static async getFundsTypes(req: Request, res: Response): Promise<void> {
    const typeId = req.query.id;
    const toReceiveFundsTypes = await getManager()
      .getRepository(ToReceiveFundsType_REF)
      .find({
        where: { id: typeId }
      });

    res.send(toReceiveFundsTypes);

  }
    /**
   * Adds a new ToReceiveFundsType.
   *
   * @param req The HTTP Request Object
   * @param res The HTTP Response Object
   */
  static async addFundsType(req: Request, res: Response): Promise<void> {
    const toReceiveFundsType = new ToReceiveFundsType_REF();
    const toReceiveFundsTypeRepo: Repository<ToReceiveFundsType_REF> = getManager().getRepository(
      ToReceiveFundsType_REF
    );
    const type: string = req.body.type;
    const existingToReceiveFundsType: ToReceiveFundsType_REF = await toReceiveFundsTypeRepo.findOne({
      where: { type: Like(type) }
    });

    if (existingToReceiveFundsType) {
      res
        .status(HttpStatusCodes.Conflict)
        .json(`A matching toReceiveFundsType already exists.`);
      return;
    }

    toReceiveFundsType.type = type;

    await toReceiveFundsTypeRepo.save(toReceiveFundsType);

    res.sendStatus(HttpStatusCodes.Ok);
  }
   /**
   * Updates a single existing toReceiveFundsType
   * using the ID and properties in the request body.
   *
   * @param req The HTTP Request Object
   * @param res The HTTP Response Object
   */
  static async updateFundsType(req: Request, res: Response): Promise<void> {
    const toReceiveFundsTypeRepo: Repository<ToReceiveFundsType_REF> = getManager().getRepository(
        ToReceiveFundsType_REF
      );
    const id = req.body.id;
    const newType: string = req.body.type;
    const existingToReceiveFundsType: ToReceiveFundsType_REF = await toReceiveFundsTypeRepo.findOne({
      where: { type: Like(newType) }
    });

    if (existingToReceiveFundsType) {
      res
        .status(HttpStatusCodes.Conflict)
        .json(`toReceiveFundsType '${newType}' already exists.`);
      return;
    }

    let toReceiveFundsTypeToUpdate = await toReceiveFundsTypeRepo.findOne(id);

    toReceiveFundsTypeToUpdate = req.body;

    await toReceiveFundsTypeRepo.update(id, toReceiveFundsTypeToUpdate);

    res.sendStatus(HttpStatusCodes.Ok);
  }

    /**
   * Deletes a single toReceiveFundsType from the database
   * given the ID in the query string.
   *
   * @param req The HTTP Request Object
   * @param res The HTTP Response Object
   */
  static async deleteFundsType(req: Request, res: Response): Promise<void> {
    const toReceiveFundsTypeRepo: Repository<ToReceiveFundsType_REF> = getManager().getRepository(
        ToReceiveFundsType_REF
      );
    const id = req.query.id;
    const toReceiveFundsType = await toReceiveFundsTypeRepo.findOne(id);

    if (toReceiveFundsType) {
      await toReceiveFundsTypeRepo.remove(toReceiveFundsType);

      res
        .status(HttpStatusCodes.Ok)
        .json(`toReceiveFundsType with ID: ${id} deleted successfully.`);
      return;
    }
    res
      .status(HttpStatusCodes.NotFound)
      .json(`toReceiveFundsType with ID: ${id} not found.`);
  }
   
}
