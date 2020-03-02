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
  membershipNumber?: string;
  kingdom: IKingdom;
  localGroup?: ILocalGroup;
  toReceiveFunds: string;
  infoMissing: boolean;
}
