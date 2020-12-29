import log from 'electron-log';
import { PresenceApi } from './PresenceApi';

const HEARTBEAT_INTERVAL_PERIOD = 60000;

export class HeartbeatCoordinator {
  private heartbeatInterval?: NodeJS.Timeout;

  constructor(private api: PresenceApi) {}

  async start() {
    log.debug('Starting heartbeat coordinator.');
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
    }

    await this.sendHeartbeat();
    this.heartbeatInterval = setInterval(
      this.sendHeartbeat.bind(this),
      HEARTBEAT_INTERVAL_PERIOD
    );
  }

  stop() {
    log.debug('Stopping heartbeat coordinator.');
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
    }
  }

  private async sendHeartbeat() {
    log.debug('Sending heartbeat...');
    await this.api.sendHeartbeat();
  }
}
