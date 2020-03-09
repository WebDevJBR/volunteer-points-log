import { Request, Response } from 'express';
import { Department } from '../entity/Department';
import { getManager, Like, Repository } from 'typeorm';
import { HttpStatusCodes } from '../constants/HttpStatusCodes';
import { VolunteerTimeEntryController } from './VolunteerTimeEntryController';
import { VolunteerTimeEntry } from '../entity/VolunteerTimeEntry';
import { TimeEntryType } from '../enums/TimeEntryType';

/**
 * Handles calls from the 'departments' route.
 */
export class DepartmentController {
  /**
   * Retrieves list of all departments.
   *
   * @param req The HTTP Request Object
   * @param res The HTTP Response Object
   */
  static async getDepartments(req: Request, res: Response): Promise<void> {
    const orderBy = req.query['orderBy'] || 'id';
    const orderDirection = req.query['orderDirection'] || 'ASC';
    const search = req.query['search'] || '';
    const limit = parseInt(req.query['per_page']) || 0;
    const page = parseInt(req.query['page']) || 0;
    const offset = (page - 1) * limit;
    const [results, total] = await getManager()
      .getRepository(Department)
      .createQueryBuilder('department')
      .loadAllRelationIds({ relations: ['headVolunteer', 'deputyVolunteer'] })
      .where('department.name LIKE :name', { name: '%' + search + '%' })
      .orderBy(`department.${orderBy}`, orderDirection)
      .skip(offset)
      .take(limit)
      .getManyAndCount();

    res.send({
      data: results,
      page: page,
      total: total
    });
  }

  /**
   * Adds a new Department
   *
   * @param req The HTTP Request Object
   * @param res The HTTP Response Object
   */
  static async addDepartment(req: Request, res: Response): Promise<void> {
    let department: Department = new Department();
    const deptRepo: Repository<Department> = getManager().getRepository(
      Department
    );
    const name: string = req.body.name;
    const existingDept: Department = await deptRepo.findOne({
      where: { name: Like(name) }
    });

    if (existingDept) {
      res
        .status(HttpStatusCodes.Conflict)
        .json(`A matching Department already exists.`);
      return;
    }

    department.name = name;
    department.multiplier = req.body.multiplier;
    department.deputyVolunteer = req.body.deputyVolunteerId;
    department.headVolunteer = req.body.headVolunteerId;

    department = await deptRepo.save(department);

    if (department.headVolunteer && department.deputyVolunteer) {
      if (department.headVolunteer === department.deputyVolunteer) {
        // Deputy and Head are the same individual and therefore only receives 48 hours.
        await VolunteerTimeEntryController.awardFortyEightHourCredit(
          department.headVolunteer,
          department.id
        );
      } else {
        // Both Deputy and Head receive credits.
        await VolunteerTimeEntryController.awardFortyEightHourCredit(
          department.deputyVolunteer,
          department.id
        );
        await VolunteerTimeEntryController.awardFortyEightHourCredit(
          department.headVolunteer,
          department.id
        );
      }
    } else if (department.headVolunteer) {
      await VolunteerTimeEntryController.awardFortyEightHourCredit(
        department.headVolunteer,
        department.id
      );
    } else if (department.deputyVolunteer) {
      await VolunteerTimeEntryController.awardFortyEightHourCredit(
        department.deputyVolunteer,
        department.id
      );
    }

    res.sendStatus(HttpStatusCodes.Ok);
  }

  /**
   * Updates a single existing department
   * using the ID and properties in the request body.
   *
   * @param req The HTTP Request Object
   * @param res The HTTP Response Object
   */
  static async updateDepartment(req: Request, res: Response): Promise<void> {
    const deptRepo: Repository<Department> = getManager().getRepository(
      Department
    );
    const volunteerTimeEntryRepo: Repository<VolunteerTimeEntry> = getManager().getRepository(
      VolunteerTimeEntry
    );
    const id = req.body.id;
    const newName: string = req.body.name;
    const existingDept: Department = await deptRepo.findOne({
      where: { name: Like(newName) }
    });

    if (existingDept && existingDept.id !== id) {
      res
        .status(HttpStatusCodes.Conflict)
        .json(`A Department with the name '${newName}' already exists.`);
      return;
    }

    let departmentToUpdate = await deptRepo.findOne(id);

    departmentToUpdate.name = req.body.name;
    departmentToUpdate.deputyVolunteer = req.body.deputyVolunteerId;
    departmentToUpdate.headVolunteer = req.body.headVolunteerId;
    departmentToUpdate.multiplier = req.body.multiplier;

    await deptRepo.update(id, departmentToUpdate);

    const departmentCredits: Array<VolunteerTimeEntry> = await volunteerTimeEntryRepo.find(
      {
        where: {
          department: departmentToUpdate.id,
          timeEntryType: TimeEntryType.HeadOrDeputy
        }
      }
    );

    departmentCredits.forEach(async credit => {
      await volunteerTimeEntryRepo.remove(credit);
    });

    if (departmentToUpdate.deputyVolunteer) {
      await VolunteerTimeEntryController.awardFortyEightHourCredit(
        departmentToUpdate.deputyVolunteer,
        departmentToUpdate.id
      );
    }

    if (departmentToUpdate.headVolunteer) {
      await VolunteerTimeEntryController.awardFortyEightHourCredit(
        departmentToUpdate.headVolunteer,
        departmentToUpdate.id
      );
    }

    res.sendStatus(HttpStatusCodes.Ok);
  }

  /**
   * Deletes a single department from the database
   * given the ID in the query string.
   *
   * @param req The HTTP Request Object
   * @param res The HTTP Response Object
   */
  static async deleteDepartment(req: Request, res: Response): Promise<void> {
    const deptRepo: Repository<Department> = getManager().getRepository(
      Department
    );
    const volunteerTimeEntryRepo: Repository<VolunteerTimeEntry> = getManager().getRepository(
      VolunteerTimeEntry
    );
    const id = req.query.id;
    const department = await deptRepo.findOne(id);

    if (department) {
      await deptRepo.remove(department).catch(err => console.error(err));

      const departmentCredits: Array<VolunteerTimeEntry> = await volunteerTimeEntryRepo.find(
        {
          where: {
            department: department.id,
            timeEntryType: TimeEntryType.HeadOrDeputy
          }
        }
      );

      departmentCredits.forEach(async credit => {
        await volunteerTimeEntryRepo.remove(credit);
      });

      res
        .status(HttpStatusCodes.Ok)
        .json(`Department with ID: ${id} deleted successfully.`);
      return;
    }
    res
      .status(HttpStatusCodes.NotFound)
      .json(`Department with ID: ${id} not found.`);
  }
}
