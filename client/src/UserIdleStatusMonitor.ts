import { powerMonitor } from 'electron';
import { EventEmitter } from 'events';

export class UserIdleStatusMonitor extends EventEmitter {
  private idleCheckHandle?: NodeJS.Timeout;
  private idleCheckInterval: number = 10000;
  private idleCheckThresholdSeconds: number = 10;

  private lastStatusWasIdle: boolean = false;

  start() {
    this.idleCheckHandle = setInterval(
      this.checkUserIdleStatus.bind(this),
      this.idleCheckInterval
    );
  }

  stop() {
    if (this.idleCheckHandle) {
      clearInterval(this.idleCheckHandle);
    }
  }

  private checkUserIdleStatus() {
    const idleState = powerMonitor.getSystemIdleState(
      this.idleCheckThresholdSeconds
    );

    const isIdle = idleState === 'idle' || idleState === 'locked';
    if (!this.lastStatusWasIdle && isIdle) {
      this.lastStatusWasIdle = true;
      this.emit('idle');
      return;
    }

    if (idleState === 'unknown') {
      console.warn('Idle state is unknown... Not sure what to do!');
      return;
    }

    if (this.lastStatusWasIdle && !isIdle) {
      this.lastStatusWasIdle = false;
      this.emit('active');
      return;
    }
  }
}
