import React from 'react';
import { persistor } from '../../index';
import { PURGE } from 'redux-persist';


export const logoutActionCreator = () => dispatch => {
    // dispatch({
    //     type: actionConstant,
    //     data: data
    // })
    persistor.purge();
  persistor.flush();

  // Create and dispatch the action which will cause redux-persist to purge
  dispatch({
    type: PURGE,
    key: 'DRINKINDIA', // Whatever you chose for the "key" value when initialising redux-persist in the **persistCombineReducers** method - e.g. "root"
    result: () => null, // Func expected on the submitted action.
  });
  localStorage.clear();
}