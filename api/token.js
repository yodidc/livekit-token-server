import { AccessToken } from 'livekit-server-sdk';

export default async function handler(req, res) {
  const { room = 'global', identity = 'guest-' + Math.random().toString(36).slice(2, 8) } = req.query || {};

  const apiKey = process.env.LIVEKIT_API_KEY;
  const apiSecret = process.env.LIVEKIT_API_SECRET;

  if (!apiKey || !apiSecret) {
    res.status(500).json({ error: 'LIVEKIT_API_KEY/SECRET not set' });
    return;
  }

  try {
    const at = new AccessToken(apiKey, apiSecret, { identity });
    at.addGrant({ room, roomJoin: true, canPublish: true, canSubscribe: true });
    const token = await at.toJwt();
    res.setHeader('Content-Type', 'text/plain');
    res.status(200).send(token);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'failed to issue token' });
  }
}
