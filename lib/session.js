
import { IronSession, getIronSession } from 'iron-session';
import { cookies } from 'next/headers';

export const sessionOptions = {
  password: process.env.SESSION_SECRET,
  cookieName: 'next-js-mongodb-app-session',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
  },
};

export async function getSession(req, res) {
  const session = await getIronSession(req, res, sessionOptions);
  return session;
}
