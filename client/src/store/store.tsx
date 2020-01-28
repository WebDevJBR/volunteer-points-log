import React, { createContext, useReducer } from 'react';
import {IProps, IContextProps} from './interfaces';
import reducer from './reducer';

const initState: IProps = {
  show: false,
  content: null
};

export const Context = createContext({} as IContextProps);

export const Provider: React.FC = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initState);
    const value = { state, dispatch };

    return (
        <Context.Provider value={value}>
            {children}
        </Context.Provider>
    );
};

export default Provider;