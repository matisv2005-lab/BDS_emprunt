import styles from "./page.module.css";
import Link from "next/link"

export default function Home() {
  return (
    <div className={styles.page}>
      <h1>Page emprunt BDS</h1>
      <h2>Fée du Sport</h2>
      <div className={styles.ctas}>
          <Link
            className={styles.primary}
            href="/log" 
          >
            Connexion Rezel
          </Link>
      </div>
    </div>
  );
}
