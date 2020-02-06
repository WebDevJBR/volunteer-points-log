import React, { createContext, useContext, useReducer } from 'react';

import { IContextProps, IProviderProps } from './Interfaces/Snackbar';

export const Context = createContext({} as IContextProps);

export const Provider: React.FC<IProviderProps> = ({
  reducer,
  initState,
  children
}) => {
  const [state, dispatch] = useReducer(reducer, initState);
  const value = { state, dispatch };
  return <Context.Provider value={value}>{children}</Context.Provider>;
};

export const useStore = () => useContext(Context);
