export const IPC_MESSAGE_TYPE = {
  SET_ACTIVITY: 'SET_ACTIVITY',
};

export type SetActivityMessage = {
  activityName: string;
  activityMessage: string;
};
