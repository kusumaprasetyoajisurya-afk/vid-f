import { withSessionRoute } from '../../lib/session';
import { connectToDatabase } from '../../lib/db';
import bcrypt from 'bcryptjs';

export default withSessionRoute(async (req, res) => {
  if (req.method === 'POST') {
    try {
      const { db } = await connectToDatabase();
      const { username, password } = req.body;

      if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
      }

      const existingUser = await db.collection('users').findOne({ username });
      if (existingUser) {
        return res.status(400).json({ error: 'User already exists' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      await db.collection('users').insertOne({ username, password: hashedPassword });

      res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
      console.error('Registration Error:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
});
