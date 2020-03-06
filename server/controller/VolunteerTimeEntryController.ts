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
    const timeEntries = await getManager()
      .getRepository(VolunteerTimeEntry)
      .find({
        where: { volunteerId: id },
        relations: ['department', 'enteredByUser', 'volunteer']
      });

    response.send(timeEntries);
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
