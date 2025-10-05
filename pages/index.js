
import Head from 'next/head';
import styles from '../styles/Home.module.css';
import Sidebar from '../components/Sidebar';
import Auth from '../components/Auth';
import UserArea from '../components/UserArea';

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Video Marketplace</title>
        <link rel="icon" href="/favicon.ico" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap" rel="stylesheet"/>
      </Head>

      <Sidebar />

      <main className={styles.main}>
        <Auth />
        <UserArea />
      </main>
    </div>
  );
}
