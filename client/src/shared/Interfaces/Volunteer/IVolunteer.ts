export interface IKingdom {
  id: number;
  name: string;
}

export interface ILocalGroup {
  id: number;
  name: string;
}

export interface IVolunteer {
  id: number;
  name: string;
  mka: string;
  membershipNumber?: string;
  kingdom: number;
  localGroup?: number;
  toReceiveFundsType: number;
  other: string;
  infoMissing: boolean;
  feathersTaken: number;
  ticketsTaken: number;
  aboveAndBeyondTaken: number;
  twentyHours: boolean;
  fiftyHours: boolean;
  oneHundredHours: boolean;
}
