import { getSession } from '../../lib/session';
import { connectToDatabase } from '../../lib/db';
import bcrypt from 'bcryptjs';

export default async function login(req, res) {
  if (req.method === 'POST') {
    try {
      const { db } = await connectToDatabase();
      const { username, password } = req.body;

      const user = await db.collection('users').findOne({ username });

      if (user && (await bcrypt.compare(password, user.password))) {
        const session = await getSession(req, res);
        session.user = {
          id: user._id,
          username: user.username,
        };
        await session.save();
        res.json({ message: 'Logged in' });
      } else {
        res.status(401).json({ error: 'Invalid username or password' });
      }
    } catch (error) {
      console.error('Login Error:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
