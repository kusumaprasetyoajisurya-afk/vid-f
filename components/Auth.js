import styles from '../styles/Home.module.css';

export default function Auth() {
  return (
    <div id="auth" className={styles.auth}>
      <h2 className={styles.title}>Login</h2>
      <form id="loginForm" className={styles.authForm}>
        <input type="text" id="username" placeholder="👤 Username" required className={styles.input} />
        <input type="password" id="password" placeholder="🔒 Password" required className={styles.input} />
        <button type="submit" className={`${styles.button} ${styles.btnPrimary}`}>Login</button>
      </form>

      <h3 className={styles.title}>Or Register</h3>
      <form id="registerForm" className={styles.authForm}>
        <input type="text" id="regUsername" placeholder="👤 New Username" required className={styles.input} />
        <input type="password" id="regPassword" placeholder="🔒 New Password" required className={styles.input} />
        <button type="submit" className={`${styles.button} ${styles.btnSecondary}`}>Register</button>
      </form>
    </div>
  );
}
