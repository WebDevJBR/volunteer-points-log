import { Request, Response } from 'express';
import { getManager, Repository } from 'typeorm';
import { VolunteerTimeEntry } from '../entity/VolunteerTimeEntry';
import { HttpStatusCodes } from '../constants/HttpStatusCodes';

/**
 * Handles calls from the 'volunteer/time-entry' route.
 */
export class VolunteerTimeEntryController {
  /**
   * Gets a collection of all time entries for a given volunteer.
   * @param request The HTTP request.
   * @param response The HTTP response.
   */
  static async getTimeEntries(
    request: Request,
    response: Response
  ): Promise<void> {
    const id = request.query.id;
    const orderBy = request.query['orderBy'] || 'id';
    const orderDirection = request.query['orderDirection'] || 'ASC';
    const search = request.query['search'] || '';
    const limit = parseInt(request.query['per_page']) || 0;
    const page = parseInt(request.query['page']) || 0;
    const offset = (page - 1) * limit;
    const [results, total] = await getManager()
      .getRepository(VolunteerTimeEntry)
      .createQueryBuilder('timeEntries')
      .loadAllRelationIds({
        relations: ['department', 'enteredByUser', 'volunteer']
      })
      .where('timeEntries.volunteerId = :id', { id: id })
      .orderBy(`timeEntries.${orderBy}`, orderDirection)
      .skip(offset)
      .take(limit)
      .getManyAndCount();

    response.send({
      data: results,
      page: page,
      total: total
    });
  }

  /**
   * Adds a new VolunteerTimeEntry.
   * @param request The HTTP request.
   * @param response The HTTP response.
   */
  static async addTimeEntry(
    request: Request,
    response: Response
  ): Promise<void> {
    const TimeEntryRepo: Repository<VolunteerTimeEntry> = getManager().getRepository(
      VolunteerTimeEntry
    );
    let newTimeEntry = new VolunteerTimeEntry();

    newTimeEntry.timeIn = new Date(request.body.timeIn);
    newTimeEntry.timeOut = new Date(request.body.timeOut);

    if (
      newTimeEntry.timeOut.toDateString() !== newTimeEntry.timeIn.toDateString()
    ) {
      response
        .status(HttpStatusCodes.Conflict)
        .json('Error: Time in and Time Out must be on the same day.');
      return;
    }

    newTimeEntry.multiplier = request.body.multiplier;
    newTimeEntry.comments = request.body.comments;
    newTimeEntry.department = request.body.department;
    newTimeEntry.enteredByUser = request.body.enteredByUser;
    newTimeEntry.volunteer = request.body.volunteer;
    newTimeEntry.timeIn = request.body.timeIn;
    newTimeEntry.timeOut = request.body.timeOut;
    newTimeEntry.date = request.body.date;

    await TimeEntryRepo.save(newTimeEntry);

    response.sendStatus(HttpStatusCodes.Ok);
  }

  /**
   * Gets a collection of all time entries for a given volunteer.
   * @param request The HTTP request.
   * @param response The HTTP response.
   */
  static async updateTimeEntry(
    request: Request,
    response: Response
  ): Promise<void> {
    const TimeEntryRepo: Repository<VolunteerTimeEntry> = getManager().getRepository(
      VolunteerTimeEntry
    );
    const id = request.body.id;

    let entryToUpdate: VolunteerTimeEntry = await TimeEntryRepo.findOne(id);
    entryToUpdate = request.body;
    await TimeEntryRepo.update(id, entryToUpdate);

    response.sendStatus(HttpStatusCodes.Ok);
  }

  /**
   * Deletes a single volunteer time entry from the database
   * given the ID parameter.
   *
   * @param request The HTTP Request Object
   * @param response The HTTP Response Object
   */
  static async deleteTimeEntry(
    request: Request,
    response: Response
  ): Promise<void> {
    const TimeEntryRepo: Repository<VolunteerTimeEntry> = getManager().getRepository(
      VolunteerTimeEntry
    );
    const id = request.query.id;
    const timeEntry = await TimeEntryRepo.findOne(id);

    if (timeEntry) {
      await TimeEntryRepo.remove(timeEntry);

      response
        .status(HttpStatusCodes.Ok)
        .json(`Time Entry with ID: ${id} deleted successfully.`);
      return;
    }
    response
      .status(HttpStatusCodes.NotFound)
      .json(`Time Entry with ID: ${id} not found.`);
  }
}
