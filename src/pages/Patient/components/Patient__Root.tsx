import React, { useReducer } from 'react';
import { Storage } from '../../../shared/utils';
import PatientList from './Patient__List';
import PatientLogin from './Patient__Login';

type State = {
  token: string | null;
  loading: boolean;
};

type Action = { type: 'SetToken'; token: string };

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'SetToken':
      return { ...state, token: action.token };
    default:
      return state;
  }
};

const updateToken = (dispatch: React.Dispatch<Action>, token: string) => {
  Storage.setToken(token);
  dispatch({ type: 'SetToken', token });
};

const PatientRoot: React.FC = () => {
  const [state, dispatch] = useReducer(reducer, { token: Storage.getToken(), loading: false });

  return (
    <div className="bg-white h-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 h-full">
        {state.token ? (
          <PatientList token={state.token} />
        ) : (
          <PatientLogin updateTokenCB={(token: string) => updateToken(dispatch, token)} />
        )}
      </div>
    </div>
  );
};

export default PatientRoot;
