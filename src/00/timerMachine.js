import { useMachine } from "@xstate/react";
import { createMachine } from "xstate";

export const timerMachineConfig = createMachine({
  initial: 'idle',
  states: {
    idle: {
      on: {
        TOGGLE: 'running',
      },
    },
    running: {
      on: {
        TOGGLE: 'paused',
      },
    },
    paused: {
      on: {
        TOGGLE: 'running',
        RESET: 'idle',
      },
    },
  },
});

export const timerMachine = (state, event) => {
  // Add the logic that will read the timerMachineConfig
  // and return the next state, given the current state
  // and event received
  const nextState = timerMachineConfig.transition(state, event);

  return nextState;
};
