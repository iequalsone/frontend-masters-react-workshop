import React, { useEffect, useReducer, useState } from 'react';
import { createMachine, assign } from 'xstate';
import { useMachine } from '@xstate/react';

const incrementCount = assign({ 
  count: (ctx) => {
    return ctx.count + 1
  } 
})

const notTooMuch = (context, event) => {
  return context.count < 5;
}

const greetMachine = createMachine({
  initial: 'unknown',
  states: {
    unknown: {
      always: [{
        cond: () => {
          return new Date().getHours() > 12
        },
        target: 'morning'
      }, { target: 'day' }]
    },
    morning: {},
    day: {}
  }
});

const alarmMachine = createMachine({
  initial: 'inactive',
  context: {
    count: 0
  },
  states: {
    inactive: {
      on: {
        TOGGLE: [
          {
            target: 'pending',
            actions: 'incrementCount',
            cond: 'notTooMuch'
          }, {
            target: 'rejected'
          }
        ],
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
    rejected: {}
  },
}, {
  actions: { incrementCount },
  guards: { notTooMuch }
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
  const [greetState] = useMachine(greetMachine);
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
      <h2>Good {greetState.value === 'morning' ? 'morning!!' : 'day!'}</h2>
      <div className='alarm'>
        <div className='alarmTime'>
          {new Date().toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
          })}{' '}
          ({count}) ({state.toStrings().join(' ')})
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
