import { withSessionRoute } from '../../lib/session';

export default withSessionRoute(async (req, res) => {
  if (req.session.user) {
    res.json({
      isLoggedIn: true,
      ...req.session.user,
    });
  } else {
    res.json({
      isLoggedIn: false,
    });
  }
});
