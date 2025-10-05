import { getIronSession } from "iron-session";

const sessionSecret = process.env.SESSION_SECRET;

if (!sessionSecret) {
  throw new Error("CRITICAL: SESSION_SECRET environment variable is not defined.");
}

if (sessionSecret.length < 32) {
  throw new Error("CRITICAL: SESSION_SECRET environment variable must be at least 32 characters long.");
}

export const sessionOptions = {
  password: sessionSecret,
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
