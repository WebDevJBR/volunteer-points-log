import React, { useState, useEffect } from 'react';

import VolunteerBase from '../../../hoc/VolunteerBase/VolunteerBase';

import {
  IVolunteer,
  IKingdom,
  ILocalGroup
} from '../../../shared/Interfaces/Volunteer/IVolunteer';

export interface IState {
  volunteer: Partial<IVolunteer>;
  kingdomList: IKingdom[] | [];
  selectedKingdom: IKingdom | {};
  localGroupList: ILocalGroup[] | [];
  selectedLocalGroup?: ILocalGroup | {};
  toReceiveFundsSelect?: string;
  toReceiveFundsText?: string;
  toReceiveFundsDisabled: boolean;
}

const AddVolunteer: React.FC = () => {
  const [state, setState] = useState<IState>({
    volunteer: {
      name: '',
      mka: '',
      membershipNumber: undefined,
      kingdom: undefined,
      localGroup: undefined,
      toReceiveFunds: ''
    },
    kingdomList: [],
    selectedKingdom: {},
    localGroupList: [],
    selectedLocalGroup: {},
    toReceiveFundsSelect: 'kingdom',
    toReceiveFundsText: '',
    toReceiveFundsDisabled: true
  });

  useEffect(() => {
    setState((prevState: IState) => {
      let updatedVolunteer;

      if (state.toReceiveFundsSelect === 'other') {
        updatedVolunteer = {
          ...prevState.volunteer,
          toReceiveFunds: ''
        };

        return {
          ...prevState,
          volunteer: updatedVolunteer,
          toReceiveFundsDisabled: false
        };
      } else {
        updatedVolunteer = {
          ...prevState.volunteer,
          toReceiveFunds: prevState.toReceiveFundsSelect
        };

        return {
          ...prevState,
          volunteer: updatedVolunteer,
          toReceiveFundsText: '',
          toReceiveFundsDisabled: true
        };
      }
    });
  }, [state.toReceiveFundsSelect]);

  const selectChangeHandler = () => {};

  const textChangeHandler = (key: keyof IState, value: string) => {
    setState((prevState: IState) => {
      let updatedVolunteer;

      if (key === 'toReceiveFundsText') {
        updatedVolunteer = { ...prevState.volunteer, toReceiveFunds: value };

        return {
          ...prevState,
          volunteer: updatedVolunteer,
          [key]: value
        };
      } else {
        updatedVolunteer = { ...prevState.volunteer, [key]: value };

        return {
          ...prevState,
          volunteer: updatedVolunteer
        };
      }
    });
  };

  const radioChangeHandler = (value: string) => {
    setState((prevState: IState) => {
      return {
        ...prevState,
        toReceiveFundsSelect: value
      };
    });
  };

  return (
    <VolunteerBase
      selectChange={selectChangeHandler}
      textChange={textChangeHandler}
      radioChange={radioChangeHandler}
      kingdoms={state.kingdomList}
      localGroups={state.localGroupList}
      volunteer={state.volunteer}
      receiveFundsDisabled={state.toReceiveFundsDisabled}
      receiveFundsRadio={state.toReceiveFundsSelect}
      receiveFundsText={state.toReceiveFundsText}
    />
  );
};

export default AddVolunteer;
