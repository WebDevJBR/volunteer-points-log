import { Dispatch } from 'react';

export interface IAction {
  type: string;
  value: any;
}

export interface IProps {
  show: boolean;
  content: JSX.Element | null;
}

export interface IContextProps {
  state: IProps;
  dispatch: Dispatch<IAction>;
}
