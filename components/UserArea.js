import styles from '../styles/Home.module.css';

export default function UserArea() {
  return (
    <div id="userArea" className={styles.userArea} style={{display:'none'}}>
      <p>Welcome, <span id="userNameDisplay"></span>! 
         <button id="logoutBtn" className={`${styles.button} ${styles.btnDanger}`}>Logout</button>
      </p>
      <h2 className={styles.title}>Videos for Sale</h2>
      <ul id="videoList" className={styles.videoList}></ul>

      <h3 className={styles.title}>Sell a Video</h3>
      <form id="sellForm" className={styles.authForm}>
        <input type="text" id="videoTitle" placeholder="Video Title" required className={styles.input}/>
        <input type="number" id="videoPrice" placeholder="Price" required min="0" className={styles.input}/>
        <button type="submit" className={`${styles.button} ${styles.btnPrimary}`}>Add Video</button>
      </form>
    </div>
  );
}
