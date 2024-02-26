import styles from "./page.module.css";
import Contents from "./components/MainPage/Contents/Contents";
import Navbar from "./components/MainPage/Navbar/Navbar";

export default function Home() {
  return (
    <main className={styles.mainContent}>
      <Navbar />
      <Contents />
    </main>
  );
}
