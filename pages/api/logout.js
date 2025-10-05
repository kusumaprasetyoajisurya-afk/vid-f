import { getSession } from '../../lib/session';

export default async function logout(req, res) {
    const session = await getSession(req, res);
    session.destroy();
    res.json({ message: 'Logged out' });
  }