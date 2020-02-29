export interface IUser {
  id: number;
  name: string;
  admin: boolean;
  timeEntries?: Array<object> | Partial<Array<object>>;
}
