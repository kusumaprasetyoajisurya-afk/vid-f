import { withIronSessionApiRoute } from 'iron-session/next';

const sessionOptions = {
  password: process.env.SESSION_SECRET,
  cookieName: 'next-js-mongodb-app-session',
  // secure: true should be used in production (HTTPS)
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
  },
};

export function withSessionRoute(handler) {
  return withIronSessionApiRoute(handler, sessionOptions);
}
