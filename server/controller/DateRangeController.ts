import { Request, Response } from 'express';
import { DateRange } from '../entity/DateRange';
import { getManager, Like, Repository } from 'typeorm';
import { HttpStatusCodes } from '../constants/HttpStatusCodes';

/**
 * Handles calls from the 'time-entry' route.
 */
export default class DateRangeController {
  /**
   * Gets the date range from the DateRange table
   * @param request The HTTP Request Object
   * @param response The HTTP Response Object
   */
  static async getDateRanges(
    request: Request,
    response: Response
  ): Promise<void> {
    const dateRange = await getManager()
      .getRepository(DateRange)
      .find();

    response.send(dateRange);
  }

  /**
   * Adds a new DateRange
   *
   * @param request The HTTP Request Object
   * @param response The HTTP Response Object
   */
  static async addDateRange(
    request: Request,
    response: Response
  ): Promise<void> {
    const dateRange = new DateRange();
    const DateRangeRepo: Repository<DateRange> = getManager().getRepository(
      DateRange
    );
    const activeYearToAdd: string = request.body.activeYear;
    const existingDateRange: DateRange = await DateRangeRepo.findOne({
      where: { activeYear: Like(activeYearToAdd) }
    });

    if (existingDateRange) {
      response
        .status(HttpStatusCodes.Conflict)
        .json(`A date range for year '${activeYearToAdd}' already exists.`);
      return;
    }

    dateRange.activeYear = activeYearToAdd;
    dateRange.endDate = new Date(request.body.endDate);
    dateRange.startDate = new Date(request.body.startDate);

    await DateRangeRepo.save(dateRange);

    response.sendStatus(HttpStatusCodes.Ok);
  }

  /**
   * Updates a single existing DateRange
   * using the ID and properties in the request body.
   *
   * @param req The HTTP Request Object
   * @param res The HTTP Response Object
   */
  static async updateDateRange(req: Request, res: Response): Promise<void> {
    const DateRangeRepo: Repository<DateRange> = getManager().getRepository(
        DateRange
    );
    const id = req.body.id;
    const dateRangeToFind = req.body.activeYear;
    const existingDateRange: DateRange = await DateRangeRepo.findOne({
      where: { activeYear: Like(dateRangeToFind) }
    });

    if (existingDateRange && existingDateRange.id !== id) {
      res
        .status(HttpStatusCodes.Conflict)
        .json(`A date range for year '${dateRangeToFind}' already exists.`);
      return;
    }

    let DateRangeToUpdate: DateRange = await DateRangeRepo.findOne(id);

    DateRangeToUpdate = req.body;

    await DateRangeRepo.update(id, DateRangeToUpdate);

    res.sendStatus(HttpStatusCodes.Ok);
  }

  /**
   * Deletes a single DateRange from the database
   * given the ID found in the query string.
   *
   * @param request The HTTP Request Object
   * @param response The HTTP Response Object
   */
  static async deleteDateRange(
    request: Request,
    response: Response
  ): Promise<void> {
    const DateRangeRepo: Repository<DateRange> = getManager().getRepository(
        DateRange
    );
    const id = request.params.id;
    const dateRange = await DateRangeRepo.findOne(id);

    if (dateRange) {
      await DateRangeRepo.remove(dateRange);

      response
        .status(HttpStatusCodes.Ok)
        .json(`Date range with ID: ${id} deleted successfully.`);
      return;
    }
    response
      .status(HttpStatusCodes.NotFound)
      .json(`Date range with ID: ${id} not found.`);
  }
}
