
import { getIronSession } from "iron-session";

export const sessionOptions = {
  password: process.env.SESSION_SECRET,
  cookieName: "next-js-mongodb-app-session",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
  },
};

// Fungsi helper untuk mendapatkan session
export async function getSession(req, res) {
  const session = await getIronSession(req, res, sessionOptions);
  return session;
}
