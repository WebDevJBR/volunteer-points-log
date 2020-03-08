import { Response } from "express";
import { getManager, Repository, Like } from "typeorm";
import * as csv from "csv-parser";
import * as fs from "fs";
import { HttpStatusCodes } from "../constants/HttpStatusCodes";
import { Kingdom } from '../entity/Kingdom';
import { Volunteer } from '../entity/Volunteer';
import { ToReceiveFundsType_REF } from '../entity/ToReceiveFundsType_REF';
import { LocalGroup } from '../entity/LocalGroup';
import { Department } from "../entity/Department";


/**
 * Handles calls from the 'imports' route.
 */
export class ImportController {
  
  /**
   * Imports kingdoms and respected local groups.
   * @param request The HTTP request.
   * @param response The HTTP response.
   */
  static async importKingdomsAndGroups(request: any, response: Response): Promise<void> {
    
    const kingdomRepo: Repository<Kingdom> = getManager().getRepository(Kingdom);
    const localGroupRepo: Repository<LocalGroup> = getManager().getRepository(LocalGroup);
    
    let rows: any[] = [];
    fs.createReadStream(request.file.path)
      .pipe(csv())
      .on("data", row => {
        rows.push(row);
      })
      .on("end", async () => {
        fs.unlinkSync(request.file.path);

        // Import kingdoms (Stripping off any whitespace from strings)
        const kingdoms = Object.keys(rows[0]);
        kingdoms.map(kingdom => kingdom.trim());
        
        for (let kingdom of kingdoms) {
          
          let existingKingdom: Kingdom = await kingdomRepo.findOne({
            where: { name: Like(kingdom) }
          });

          if (!existingKingdom) {
            let newKingdom = new Kingdom();
            newKingdom.name = kingdom;

            await kingdomRepo.save(newKingdom);
          }
        }

        // Import local groups
        for (let row of rows) {
          for (let [kingdom, group] of Object.entries(row)) {
            
            let existingKingdom: Kingdom = await kingdomRepo.findOne({
              where: { name: Like(kingdom) }
            });

            if (existingKingdom) {
              let existingGroup: LocalGroup = await localGroupRepo.findOne({
                where: { name: Like(group.toString().trim()) }
              });

              if (!existingGroup) {
                let newLocalGroup = new LocalGroup();
                newLocalGroup.name = (group as string).trim();
                newLocalGroup.kingdom = existingKingdom.id;

                await localGroupRepo.save(newLocalGroup);
              }
            }
          }
        }

        response.sendStatus(HttpStatusCodes.Created);
      });
  }


   /**
   * Imports volunteers.
   * @param request The HTTP request.
   * @param response The HTTP response.
   */
  static async importVolunteers(request: any, response: Response): Promise<void> {
    
    const kingdomRepo: Repository<Kingdom> = getManager().getRepository(Kingdom);
    const localGroupRepo: Repository<LocalGroup> = getManager().getRepository(LocalGroup);
    const volunteerRepo: Repository<Volunteer> = getManager().getRepository(Volunteer);
    const receieveFundsTypeRepo: Repository<ToReceiveFundsType_REF> = getManager().getRepository(ToReceiveFundsType_REF);

    let rows: number = 0;
    fs.createReadStream(request.file.path)
      .pipe(csv({headers: ['timestamp', 'email', 'mundane', 'sca', 'kingdom', 'localGroup', 'toReceive', 'membershipNum' ]}))
      .on("data", async (vol) => {

        // Required to remove trailing whitespace in the csv cell
        Object.keys(vol).map((key, index) => { vol[key] = (typeof vol[key] === 'string') ?  vol[key].trim() : vol[key]});

        // Required to include header row in csv file, but skips over it
        if (rows > 0) {
          
          let existingVolunteer: Volunteer = await volunteerRepo.findOne({ name: vol.sca });
          let existingKingdom: Kingdom = await kingdomRepo.findOne({name: vol.kingdom});
          let existingGroup: LocalGroup = await localGroupRepo.findOne({ name: vol.localGroup});
          let fundsType: ToReceiveFundsType_REF = await receieveFundsTypeRepo.findOne({where: { type: Like('Local Group')}});

          let newVolunteer = new Volunteer();
          newVolunteer.mka = vol.mundane ? vol.mundane : '';
          newVolunteer.name = vol.sca ? vol.sca : '';
          newVolunteer.kingdom = existingKingdom?.id;
          newVolunteer.localGroup = existingGroup?.id;
          newVolunteer.membershipNumber = vol.membershipNum;
          newVolunteer.infoMissing = (!existingKingdom || !existingGroup) ? true: false;

         // Handles to receieve cases
          if (vol.toReceive) {
            if ((vol.toReceive == vol.localGroup) && existingGroup) {
              newVolunteer.toReceiveFundsType = fundsType?.id;
            }
            else if ((vol.toReceive == vol.kingdom) && existingKingdom) {
              fundsType  = await receieveFundsTypeRepo.findOne({where:{type:Like('Kingdom')}});
              newVolunteer.toReceiveFundsType = fundsType?.id;
            }
            else {
              newVolunteer.other = vol.toReceive;
              fundsType  = await receieveFundsTypeRepo.findOne({where:{type:Like('Other')}});
              newVolunteer.toReceiveFundsType = fundsType?.id;
            }
          } 
          
          try {
            if (existingVolunteer) {
              // If kingdom ids match update the exisiting volunteer (Same logic as new, but updating existing)
              if (existingVolunteer.kingdom === existingKingdom?.id) {
               
                existingVolunteer.mka = vol.mundane ? vol.mundane : '';
                existingVolunteer.name = vol.sca ? vol.sca : '';
                existingVolunteer.localGroup = existingGroup?.id;
                existingVolunteer.membershipNumber = vol.membershipNum;
                existingVolunteer.infoMissing = (!existingGroup) ? true: false;

                // Handles to receieve cases
                if (vol.toReceive) {
                  if (vol.toReceive == existingGroup?.name) {
                    existingVolunteer.toReceiveFundsType = fundsType?.id;
                  }
                  else if (vol.toReceive == existingGroup?.name) {
                    fundsType  = await receieveFundsTypeRepo.findOne({where:{type:Like('Kingdom')}});
                    existingVolunteer.toReceiveFundsType = fundsType?.id;
                  }
                  else {
                    existingVolunteer.other = vol.toReceive;
                    fundsType  = await receieveFundsTypeRepo.findOne({where:{type:Like('Other')}});
                    existingVolunteer.toReceiveFundsType = fundsType?.id;
                  }
                } 
  
                await volunteerRepo.save(existingVolunteer);
              }
              // Otherwise replace it
              else {
                await volunteerRepo.delete(existingVolunteer);
                newVolunteer.infoMissing = true;
                await volunteerRepo.save(newVolunteer);
              }
            } 
            else {
              if (newVolunteer.mka && newVolunteer.name) {
                await volunteerRepo.save(newVolunteer);
              }
            }
            
          }
          catch(err) {
            console.log(err);
            console.log("Error creating volunteer: ", vol);
          }
        }
          
        rows++;
      })
      .on("end", async () => {
        fs.unlinkSync(request.file.path);    
        response.sendStatus(HttpStatusCodes.Created);
      });
  }


  /**
   * Imports volunteers.
   * @param request The HTTP request.
   * @param response The HTTP response.
   */
  static async importDepartments(request: any, response: Response): Promise<void> {
    
    const departmentRepo: Repository<Department> = getManager().getRepository(Department);
    const volunteerRepo: Repository<Volunteer> = getManager().getRepository(Volunteer);
   

    let rows: number = 0;
    fs.createReadStream(request.file.path)
      .pipe(csv({headers: ['department', 'head', 'deputy' ]}))
      .on("data", async (row) => {

        // Required to remove trailing whitespace in the csv cell
        Object.keys(row).map((key, index) => { row[key] = (typeof row[key] === 'string') ?  row[key].trim() : row[key]});

        // Required to include header row in csv file, but skips over it
        if (rows > 0) {
          
          let existingDepartment: Department = await departmentRepo.findOne({ name: row.department });
          let exisitingHead: Volunteer = await volunteerRepo.findOne({name: row.head});
          let exisitingDeputy: Volunteer = await volunteerRepo.findOne({name: row.deputy});

          // Update exisiting
          if (existingDepartment) {
            existingDepartment.headVolunteer = exisitingHead?.id;
            existingDepartment.deputyVolunteer = exisitingDeputy?.id;

            await departmentRepo.save(existingDepartment);
          }
          else {
            let newDepartment = new Department();
            newDepartment.name = row.department ? row.department: newDepartment.name;
            newDepartment.headVolunteer = exisitingHead?.id;
            newDepartment.deputyVolunteer = exisitingDeputy?.id;

            if (newDepartment.name && newDepartment.headVolunteer) {
              await departmentRepo.save(newDepartment);
            }
          }
        }
        rows++;
      })
      .on("end", async () => {
        fs.unlinkSync(request.file.path);    
        response.sendStatus(HttpStatusCodes.Created);
      });
  }
}
