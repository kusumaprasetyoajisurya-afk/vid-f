import { withSessionRoute } from '../../lib/session';

export default withSessionRoute((req, res) => {
  req.session.destroy();
  res.json({ message: 'Logged out' });
});
