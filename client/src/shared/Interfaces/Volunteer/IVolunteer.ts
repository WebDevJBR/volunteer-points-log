export interface IKingdom {
  id: number;
  name: string;
}

export interface ILocalGroup {
  id: number;
  name: string;
}

export interface IVolunteer {
  name: string;
  mka: string;
  membershipNumber?: number;
  kingdom: IKingdom;
  localGroup?: ILocalGroup;
  toReceiveFunds: string;
}
