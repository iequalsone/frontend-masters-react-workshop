import React, { useEffect, useReducer, useState } from 'react';
import { createMachine } from 'xstate';
import { useMachine } from '@xstate/react';

const initialState = 'pending';

const alarmReducer = (state, event) => {
  switch (state) {
    case 'pending':
      if (event.type === 'SUCCESS') {
        return 'active';
      }
      if (event.type === 'TOGGLE') {
        return 'inactive';
      }
      return state;
    case 'active':
      if (event.type === 'TOGGLE') {
        return 'inactive';
      }
      return state;
    case 'inactive':
      if (event.type === 'TOGGLE') {
        return 'pending';
      }
      return state;
    default:
      return state;
  }
};

export const ScratchApp = () => {
  // 'inactive', 'pending', 'active'
  const [status, dispatch] = useReducer(alarmReducer, initialState);

  useEffect(() => {
    console.log(status);
    let timeout;
    if (status === 'pending') {
      timeout = setTimeout(() => {
        dispatch({ type: 'SUCCESS' });
      }, 2000);
    }

    return () => {
      clearTimeout(timeout);
    };
  }, [status]);

  return (
    <div className='scratch'>
      <div className='alarm'>
        <div className='alarmTime'>
          {new Date().toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </div>
        <div
          className='alarmToggle'
          data-active={status === 'active' || undefined}
          style={{ opacity: status === 'pending' ? 0.5 : 1 }}
          onClick={() => {
            console.log('here');
            dispatch({ type: 'TOGGLE' });
          }}
        ></div>
      </div>
    </div>
  );
};
