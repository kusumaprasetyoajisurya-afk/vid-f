
import { useState } from 'react';
import styles from '../styles/Home.module.css';

export default function Auth() {
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [regUsername, setRegUsername] = useState('');
  const [regPassword, setRegPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username: loginUsername, password: loginPassword }),
    });

    const data = await res.json();
    if (res.ok) {
      alert('Login successful!');
      window.location.reload();
    } else {
      alert(`Login failed: ${data.error}`);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username: regUsername, password: regPassword }),
    });

    const data = await res.json();
    if (res.ok) {
      alert('Registration successful! Please log in.');
      // Reset form or redirect
      setRegUsername('');
      setRegPassword('');
    } else {
      alert(`Registration failed: ${data.error}`);
    }
  };

  return (
    <div id="auth" className={styles.auth}>
      <h2 className={styles.title}>Login</h2>
      <form onSubmit={handleLogin} className={styles.authForm}>
        <input 
          type="text" 
          value={loginUsername}
          onChange={(e) => setLoginUsername(e.target.value)}
          placeholder="👤 Username" 
          required 
          className={styles.input} 
        />
        <input 
          type="password" 
          value={loginPassword}
          onChange={(e) => setLoginPassword(e.target.value)}
          placeholder="🔒 Password" 
          required 
          className={styles.input} 
        />
        <button type="submit" className={`${styles.button} ${styles.btnPrimary}`}>Login</button>
      </form>

      <h3 className={styles.title}>Or Register</h3>
      <form onSubmit={handleRegister} className={styles.authForm}>
        <input 
          type="text" 
          value={regUsername}
          onChange={(e) => setRegUsername(e.target.value)}
          placeholder="👤 New Username" 
          required 
          className={styles.input} 
        />
        <input 
          type="password" 
          value={regPassword}
          onChange={(e) => setRegPassword(e.target.value)}
          placeholder="🔒 New Password" 
          required 
          className={styles.input} 
        />
        <button type="submit" className={`${styles.button} ${styles.btnSecondary}`}>Register</button>
      </form>
    </div>
  );
}
