import got, { Got } from 'got';

export type PresenceActivity = {
  status: string;
  message: string;
  timestamp?: number;
};

export class PresenceApi {
  private authenticatedClient: Got;

  constructor(private endpoint: string, private sharedSecret: string) {
    this.authenticatedClient = got.extend({
      prefixUrl: this.endpoint,
      timeout: 5000,
      headers: {
        authorization: this.sharedSecret,
      },
    });
  }

  async setActivity(activityName: string, message: string): Promise<void> {
    const body: PresenceActivity = {
      status: activityName,
      message: message,
    };

    await this.authenticatedClient.put('presence', {
      json: body,
    });
  }

  async getActivity(): Promise<PresenceActivity | null> {
    const currentActivity = await this.authenticatedClient
      .get('presence')
      .json<PresenceActivity | null>();

    return currentActivity;
  }

  async sendHeartbeat(): Promise<void> {
    await this.authenticatedClient.post('heartbeat');
  }
}
