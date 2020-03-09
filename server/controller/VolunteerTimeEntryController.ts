import { Request, Response } from 'express';
import { getManager, Repository} from 'typeorm';
import { VolunteerTimeEntry } from '../entity/VolunteerTimeEntry';
import { HttpStatusCodes } from '../constants/HttpStatusCodes';
import { TimeEntryType } from '../enums/TimeEntryType';
import { User } from '../entity/User';

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
    const [results, total] = await getManager()
      .getRepository(VolunteerTimeEntry)
      .createQueryBuilder('timeEntries')
      .loadAllRelationIds({
        relations: ['department', 'enteredByUser', 'volunteer']
      })
      .where('timeEntries.volunteerId = :id', { id: id })
      .orderBy(`timeEntries.${orderBy}`, orderDirection)
      .getManyAndCount();

    response.send({
      data: results,
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
    const user = request.user as User;
    let newTimeEntry = new VolunteerTimeEntry();
    let newDate = new Date(request.body.date);
    let newTimeIn = new Date(request.body.timeIn);
    let newTimeOut = new Date(request.body.timeOut);

    const timeEntries = await TimeEntryRepo
      .find({
        where: [
          { volunteer: request.body.volunteer  }
        ],
        relations: ['department', 'enteredByUser', 'volunteer']
      });

    let entryError: boolean = false;
    timeEntries.forEach(element => {

      let currentEntryDate = new Date(element.date);
      if (currentEntryDate.toDateString() === newDate.toDateString()){
        let currentEntryTimeIn = new Date(element.timeIn);
        let currentEntryTimeOut = new Date(element.timeOut);
        
        if (newTimeIn > currentEntryTimeIn && newTimeIn < currentEntryTimeOut){
          entryError = true;
        }
        else if(newTimeOut > currentEntryTimeIn && newTimeOut < currentEntryTimeOut){
          entryError = true;
        }
        else if(newTimeOut === currentEntryTimeIn || newTimeOut === currentEntryTimeOut){
          entryError = true;
        }
      }
    });
      

    if (!entryError){
      newTimeEntry.multiplier = request.body.multiplier;
      newTimeEntry.comments = request.body.comments;
      newTimeEntry.department = request.body.department;
      newTimeEntry.enteredByUser = user.id;
      newTimeEntry.volunteer = request.body.volunteer;
      newTimeEntry.timeIn = request.body.timeIn;
      newTimeEntry.timeOut = request.body.timeOut;
      newTimeEntry.date = request.body.date;
  
      await TimeEntryRepo.save(newTimeEntry);
  
      response.sendStatus(HttpStatusCodes.Ok);
    }
    else{
      response.send(HttpStatusCodes.Conflict);
    }
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

  /**
   * Adds a 48 hour credit for a volunteer who is either a department head or deputy.
   * @param volunteerId The Id of the Volunteer.
   * @param departmentId The Id of the Department for which the hours are being awarded.
   */
  static async awardFortyEightHourCredit(
    volunteerId: number,
    departmentId: number
  ): Promise<void> {
    const volunteerTimeEntryRepo: Repository<VolunteerTimeEntry> = getManager().getRepository(
      VolunteerTimeEntry
    );

    let existingCredit: VolunteerTimeEntry = await volunteerTimeEntryRepo.findOne(
      {
        where: {
          volunteer: volunteerId,
          timeEntryType: TimeEntryType.HeadOrDeputy
        }
      }
    );

    if (!existingCredit) {
      const now = new Date();
      let newTimeEntry: VolunteerTimeEntry = new VolunteerTimeEntry();

      newTimeEntry.date = now;
      newTimeEntry.timeIn = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        0,
        0,
        0,
        0
      );
      newTimeEntry.timeOut = new Date(
        newTimeEntry.timeIn.getTime() + 1000 * 60 * 60 * 24 * 2 // 48 hours later
      );
      newTimeEntry.multiplier = 1;
      newTimeEntry.comments = '48 Hour Head/Deputy Credit';
      newTimeEntry.timeEntryType = TimeEntryType.HeadOrDeputy;
      newTimeEntry.volunteer = volunteerId;
      newTimeEntry.department = departmentId;

      volunteerTimeEntryRepo.save(newTimeEntry);
    }
  }
}
