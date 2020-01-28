import { IAction } from './interfaces';

export const setShow = (value: boolean) => {
  const action: IAction = {
    type: 'setShow',
    value: value
  };

  return action;
};

export const setContent = (value: JSX.Element | null) => {
  const action: IAction = {
    type: 'setContent',
    value: value
  };

  return action;
};
