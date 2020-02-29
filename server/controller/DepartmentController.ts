import { Request, Response } from 'express';
import { Department } from '../entity/Department';
import { getManager, Like, Repository } from 'typeorm';
import { HttpStatusCodes } from '../constants/HttpStatusCodes';

/**
 * Handles calls from the 'departments' route.
 */
export default class DepartmentController {
  /**
   * Retrieves list of all departments.
   *
   * @param req The HTTP Request Object
   * @param res The HTTP Response Object
   */
  static async getDepartments(req: Request, res: Response): Promise<void> {
    const departments = await getManager()
      .getRepository(Department)
      .find();

    res.send(departments);
  }

  /**
   * Adds a new Department
   *
   * @param req The HTTP Request Object
   * @param res The HTTP Response Object
   */
  static async addDepartment(req: Request, res: Response): Promise<void> {
    const department = new Department();
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

    await deptRepo.save(department);

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
    const id = req.body.id;
    const newName: string = req.body.name;
    const existingDept: Department = await deptRepo.findOne({
      where: { name: Like(newName) }
    });

    if (existingDept) {
      res
        .status(HttpStatusCodes.Conflict)
        .json(`A Department with the name '${newName}' already exists.`);
      return;
    }

    let departmentToUpdate = await deptRepo.findOne(id);

    departmentToUpdate = req.body;

    await deptRepo.update(id, departmentToUpdate);

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
    const id = req.params.id;
    const department = await deptRepo.findOne(id);

    if (department) {
      await deptRepo.remove(department);

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
