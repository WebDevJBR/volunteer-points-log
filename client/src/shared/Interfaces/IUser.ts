export default interface IUser {
  id: number;
  name: string,
  timeEntries?: Array<object> | Partial<Array<object>>
}