import React, { useCallback } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { ipcRenderer } from 'electron-better-ipc';
import { IPC_MESSAGE_TYPE, SetActivityMessage } from './ipc';

const useSetActivityCallback = (activityName: string, message: string) => {
  const callback = useCallback(async () => {
    const args: SetActivityMessage = {
      activityName: activityName,
      activityMessage: message,
    };
    await ipcRenderer.callMain(IPC_MESSAGE_TYPE.SET_ACTIVITY, args);
  }, []);

  return callback;
};

const ActivityContainer: React.FC = () => {
  const coding = useSetActivityCallback('CODING', 'Code-monkey need coffee.');
  const gaming = useSetActivityCallback('GAMING', 'Stress relief.');
  const music = useSetActivityCallback('MUSIC', "Jammin'.");

  return (
    <div>
      <button onClick={coding}>Coding</button>
      <button onClick={gaming}>Gaming</button>
      <button onClick={music}>Music</button>
    </div>
  );
};

export default function App() {
  return (
    <Router>
      <Switch>
        <Route path="/" component={ActivityContainer} />
      </Switch>
    </Router>
  );
}
