import fastify from 'fastify';
import * as uuid from 'uuid';
import { generateStatusImage } from './image.mjs';

const SHARED_SECRET = process.env.SHARED_SECRET;

const app = fastify({
  logger: true,
});

const HEARTBEAT_EXPIRY = 5 * 60 * 1000;
let lastHeartbeat = new Date().getTime();
let heartbeatTimeout = -1;
const presence = [];
let imageCache;

const setPresence = (status, message) => {
  presence.push({
    status,
    message,
    id: uuid.v4(),
    timestamp: new Date().getTime(),
  });
};

const heartbeat = () => {
  lastHeartbeat = new Date().getTime();
  if (heartbeatTimeout) {
    clearTimeout(heartbeatTimeout);
  }

  heartbeatTimeout = setTimeout(() => {
    setPresence('AWAY', 'Curerntly away.');
  }, HEARTBEAT_EXPIRY);
};

app.put('/presence', (req, res) => {
  if (req.headers['authorization'] !== SHARED_SECRET) {
    return res.status(403).send('Forbidden');
  }

  if (!req.body.status && !req.body.message) {
    return res.status(400).send('Missing required fields.');
  }

  setPresence(req.body.status, req.body.message);
  heartbeat();

  res.status(200).send();
});

app.get('/presence', (req, res) => {
  if (!presence.length) {
    return res.status(200).send(null);
  }

  res.status(200).send(presence[presence.length - 1]);
});

app.get('/presence/image.png', async (req, res) => {
  const currentPresence = presence[presence.length - 1] ?? {};
  let image;
  if (imageCache && imageCache.id === currentPresence.id) {
    image = imageCache.image;
  } else {
    image = await generateStatusImage(
      currentPresence.status,
      currentPresence.message
    );

    imageCache = {
      id: currentPresence.id,
      image: image,
    };
  }

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
