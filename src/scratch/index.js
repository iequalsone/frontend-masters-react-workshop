import React, { useEffect, useReducer, useState } from 'react';
import { createMachine, assign } from 'xstate';
import { useMachine } from '@xstate/react';

const initialState = 'pending';

const alarmMachine = createMachine({
  initial: 'inactive',
  context: {
    count: 0
  },
  states: {
    inactive: {
      on: {
        TOGGLE: {
          target: 'pending',
          actions: assign({ 
            count: (context, event) => {
              return context.count + 1
            } 
          })
        },
      },
    },
    pending: {
      on: {
        SUCCESS: 'active',
        TOGGLE: 'inactive',
      },
    },
    active: {
      on: {
        TOGGLE: 'inactive',
      },
    },
  },
});

const alarmReducer = (state, event) => {
  const nextState = alarmMachine.transition(state, event);
  return nextState;
  // switch (state) {
  //   case 'pending':
  //     if (event.type === 'SUCCESS') {
  //       return 'active';
  //     }
  //     if (event.type === 'TOGGLE') {
  //       return 'inactive';
  //     }
  //     return state;
  //   case 'active':
  //     if (event.type === 'TOGGLE') {
  //       return 'inactive';
  //     }
  //     return state;
  //   case 'inactive':
  //     if (event.type === 'TOGGLE') {
  //       return 'pending';
  //     }
  //     return state;
  //   default:
  //     return state;
  // }
};

export const ScratchApp = () => {
  // 'inactive', 'pending', 'active'
  const [state, send] = useMachine(alarmMachine);

  const status = state.value; // 'pending', 'active', 'inactive
  const { count } = state.context;

  useEffect(() => {
    let timeout;
    if (status === 'pending') {
      timeout = setTimeout(() => {
        send('SUCCESS');
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
          })}{' '}
          ({count})
        </div>
        <div
          className='alarmToggle'
          data-active={status === 'active' || undefined}
          style={{ opacity: status === 'pending' ? 0.5 : 1 }}
          onClick={() => {
            send('TOGGLE');
          }}
        ></div>
      </div>
    </div>
  );
};
