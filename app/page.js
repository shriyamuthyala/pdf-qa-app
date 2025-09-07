import styles from "./HomePage.module.css";
import PDFUpload from "./components/PDFUpload";
import AskQuestion from "./components/AskQuestion";

export default function HomePage() {
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>PDF Q&amp;A App</h1>
        <PDFUpload />
        <hr className={styles.hr} />
        <AskQuestion />
      </div>
    </div>
  );
}
