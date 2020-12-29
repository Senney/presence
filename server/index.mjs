import fastify from 'fastify';
import { generateStatusImage } from './image.mjs';

const SHARED_SECRET = process.env.SHARED_SECRET;

const app = fastify({
  logger: true,
});

const HEARTBEAT_EXPIRY = 5 * 60 * 1000;
let lastHeartbeat = new Date().getTime();
let heartbeatTimeout = -1;
const presence = [];

const heartbeat = () => {
  lastHeartbeat = new Date().getTime();
  if (heartbeatTimeout) {
    clearTimeout(heartbeatTimeout);
  }

  heartbeatTimeout = setTimeout(() => {
    presence.push({
      timestamp: new Date().getTime(),
      status: 'AWAY',
      message: 'Currently away.',
    });
  }, HEARTBEAT_EXPIRY);
};

app.put('/presence', (req, res) => {
  if (req.headers['authorization'] !== SHARED_SECRET) {
    return res.status(403).send('Forbidden');
  }

  presence.push({
    ...req.body,
    timestamp: new Date().getTime(),
  });
  heartbeat();
  res.status(200).send();
});

app.get('/presence', (req, res) => {
  if (!presence.length) {
    return res.status(200).send(null);
  }

  res.status(200).send(presence[presence.length - 1]);
});

app.get('/presence/png', async (req, res) => {
  const currentPresence = presence[presence.length - 1] ?? {};
  const image = await generateStatusImage(
    currentPresence.status,
    currentPresence.message
  );

  res.status(200).type('image/png').send(image);
});

app.post('/heartbeat', (req, res) => {
  if (req.headers['authorization'] !== SHARED_SECRET) {
    return res.status(403).send('Forbidden');
  }

  heartbeat();
  return res.status(200).send();
});

app.listen(process.env.PORT ?? 3000, () => console.log('Server listening.'));
