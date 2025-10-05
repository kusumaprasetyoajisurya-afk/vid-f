import styles from '../styles/Sidebar.module.css';

export default function Sidebar() {
  return (
    <div className={styles.sidebar}>
      <h2 className={styles.logo}>VM</h2>
      <nav>
        <ul>
          <li><a href="#" id="nav-home">🏠 Home</a></li>
          <li><a href="#" id="nav-videos">🎬 Videos</a></li>
          <li><a href="#" id="nav-sell">💰 Sell</a></li>
          <li><a href="#" id="nav-auth">🔑 Login</a></li>
        </ul>
      </nav>
    </div>
  );
}
