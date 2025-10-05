import { getSession } from "../../lib/session";

export default async function handler(req, res) {
  const session = await getSession(req, res);
  if (session.user) {
    res.json({
      isLoggedIn: true,
      ...session.user,
    });
  } else {
    res.json({
      isLoggedIn: false,
    });
  }
}
