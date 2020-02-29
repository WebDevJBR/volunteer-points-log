export interface IUser {
  id: number;
  name: string;
  password: string;
  salt: string;
  admin: boolean;
  timeEntries?: Array<object> | Partial<Array<object>>;
}
