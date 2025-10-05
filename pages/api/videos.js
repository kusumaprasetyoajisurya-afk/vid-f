import { getSession } from "../../lib/session";
import { connectToDatabase } from '../../lib/db';

export default async function handler(req, res) {
  const session = await getSession(req, res);
  if (!session.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const { db } = await connectToDatabase();
    const videos = await db.collection('videos').find({}).toArray();
    res.json(videos);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
