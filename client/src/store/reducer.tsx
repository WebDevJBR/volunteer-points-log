import { Reducer } from 'react';
import { IProps, IAction } from './interfaces';

const reducer: Reducer<IProps, IAction> = (state, action) => {
  switch (action.type) {
    case 'setShow':
      return {
        ...state,
        show: action.value
      };

    case 'setContent':
      return {
        ...state,
        content: action.value
      };

    default:
      return state;
  }
};

export default reducer;