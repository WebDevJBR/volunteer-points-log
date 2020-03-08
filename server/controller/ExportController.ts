import { Response } from 'express';
import { getManager, Repository, Like } from 'typeorm';
import * as json2csv from 'json2csv';
import { HttpStatusCodes } from '../constants/HttpStatusCodes';
import { Kingdom } from '../entity/Kingdom';
import { Volunteer } from '../entity/Volunteer';
import { VolunteerTimeEntry } from '../entity/VolunteerTimeEntry';
import { ToReceiveFundsType_REF } from '../entity/toReceiveFundsType_REF';
import { LocalGroup } from '../entity/LocalGroup';

/**
 * Handles calls from the 'Export' route.
 */
export class ExportController {
  /**
   * Export kingdoms and total hours per kingdom.
   * @param request The HTTP request.
   * @param response The HTTP response.
   */
  static async exportKingdomHours(
    request: any,
    response: Response
  ): Promise<void> {
    const kingdomRepo: Repository<Kingdom> = getManager().getRepository(
      Kingdom
    );

    // Grab data from kingdom, vols, time entries
    let kingdomsWithVolunteerTime = await kingdomRepo.find({
      where: {},
      join: {
        alias: 'kingdom',
        leftJoinAndSelect: {
          volunteers: 'kingdom.volunteers',
          timeEntries: 'volunteers.timeEntries'
        }
      }
    });

    let csv_data = [];
    let totalActual: number = 0;
    let totalEarned: number = 0;
    kingdomsWithVolunteerTime.forEach(kingdom => {
      let kingdomActualHours: number = 0;
      let kingdomEarnedHours: number = 0;
      kingdom.volunteers.forEach(vol => {
        vol.timeEntries.forEach(entry => {
          let hourDiff =
            Math.abs(entry.timeOut.getTime() - entry.timeIn.getTime()) / 36e5;
          kingdomActualHours += hourDiff;
          kingdomEarnedHours +=
            entry.multiplier != 0 ? entry.multiplier * hourDiff : hourDiff;
        });
      });

      totalActual += kingdomActualHours;
      totalEarned += kingdomEarnedHours;

      csv_data.push({
        'Kingdom of Residence': kingdom.name,
        'Actual Hours': kingdomActualHours?.toFixed(2),
        'Earned Hours': kingdomEarnedHours?.toFixed(2)
      });
    });

    // Write total row
    csv_data.push({
      'Kingdom of Residence': 'Total',
      'Actual Hours': totalActual?.toFixed(2),
      'Earned Hours': totalEarned?.toFixed(2)
    });

    let data = await json2csv.parse(csv_data);

    response.attachment('kingdomHours.csv');
    response.set({
      'Content-Type': 'text/csv',
      'Content-Disposition': 'attachment; filename=kingdomAndGroups.csv',
      Pragma: 'no-cache',
      Expires: '0'
    });
    response.status(HttpStatusCodes.Ok).send(data);
  }

  /**
   * Export a more specific breakdown of each kingdom and their local groups.
   * @param request The HTTP request.
   * @param response The HTTP response.
   */
  static async exportKingdomBreakdown(
    request: any,
    response: Response
  ): Promise<void> {
    const kingdomRepo: Repository<Kingdom> = getManager().getRepository(
      Kingdom
    );
    const toReceieveRepo: Repository<ToReceiveFundsType_REF> = getManager().getRepository(
      ToReceiveFundsType_REF
    );
    const volunteerRepo: Repository<Volunteer> = getManager().getRepository(
      Volunteer
    );
    const localGroupRepo: Repository<LocalGroup> = getManager().getRepository(
      LocalGroup
    );

    // Specific kingdom to look at
    const kingdomId = request.query['id'] || null;
    const kingdom = await kingdomRepo.findOne({ where: { id: kingdomId } });

    const getHours = async (toRecType: string, kingdom: Kingdom) => {
      let toReceiveFundsTypeRef = await toReceieveRepo.findOne({
        where: { type: Like(toRecType) }
      });

      let volunteers = await volunteerRepo.find({
        where: { toReceiveFundsType: toReceiveFundsTypeRef, kingdom: kingdom },
        join: {
          alias: 'volunteer',
          leftJoinAndSelect: {
            timeEntries: 'volunteer.timeEntries'
          }
        }
      });

      return volunteers;
    };

    const calculateEntryHours = (timeEntries: VolunteerTimeEntry[]) => {
      let actual = 0;
      let earned = 0;

      timeEntries.forEach(entry => {
        let hourDiff =
          Math.abs(entry.timeOut.getTime() - entry.timeIn.getTime()) / 36e5;
        actual += hourDiff;
        earned += hourDiff * entry.multiplier + hourDiff;
      });

      return { actual, earned };
    };

    // Breakdown of specific hours for the kingdom
    let actual: number = 0;
    let earned: number = 0;
    let volSpecificEntries = await getHours('Kingdom', kingdom);

    // Loop through each volunteer, adding up hours for this specific kingdom entry
    volSpecificEntries.forEach(vol => {
      let hours = calculateEntryHours(vol.timeEntries);
      actual = hours.actual;
      earned = hours.earned;
    });

    // Handle header / entry for specific kingdom
    let csv_data = [];

    csv_data.push({
      Kingdom: kingdom.name,
      'Actual Hours': 0,
      'Earned Hours': 0
    });
    csv_data.push({
      Kingdom: 'To Kingdom of ' + kingdom.name,
      'Actual Hours': actual.toFixed(2),
      'Earned Hours': earned.toFixed(2)
    });

    // Local Groups Break down
    let toReceiveFundsTypeRefLG = await toReceieveRepo.findOne({
      where: { type: Like('Local Group') }
    });
    // Second query is get all time entries for volunteers with a local group specified
    // TODO: Fix broken state when you change the ref value to kingdom / other. Still tallies
    let localGroupEntries = await localGroupRepo.find({
      where: {
        kingdom: kingdomId,
        toReceiveFundsType: toReceiveFundsTypeRefLG
      },
      join: {
        alias: 'localGroup',
        leftJoinAndSelect: {
          volunteers: 'localGroup.volunteers',
          timeEntries: 'volunteers.timeEntries'
        }
      }
    });

    actual = earned = 0;
    localGroupEntries.forEach(lg => {
      lg.volunteers.forEach(vol => {
        let hours = calculateEntryHours(vol.timeEntries);
        actual = hours.actual;
        earned = hours.earned;
      });
      csv_data.push({
        Kingdom: lg.name,
        'Actual Hours': actual.toFixed(2),
        'Earned Hours': earned.toFixed(2)
      });
    });

    // Last query to get the data for volunteers who picked other for said kingdom
    // Used to verify we only pull volunteers who are using LG as indicated
    let otherEntries = await getHours('Other', kingdom);

    actual = earned = 0;
    otherEntries.forEach(vol => {
      let hours = calculateEntryHours(vol.timeEntries);
      actual = hours.actual;
      earned = hours.earned;

      csv_data.push({
        Kingdom: vol.other,
        'Actual Hours': actual.toFixed(2),
        'Earned Hours': earned.toFixed(2)
      });
    });

    // Sum up totals
    csv_data.forEach(val => {
      csv_data[0]['Actual Hours'] += +val['Actual Hours'];
      csv_data[0]['Earned Hours'] += +val['Earned Hours'];
    });

    let data = await json2csv.parse(csv_data);
    response.attachment('kingdomBreakdown.csv');
    response.status(HttpStatusCodes.Ok).send(data);
  }
}
