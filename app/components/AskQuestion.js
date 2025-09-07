'use client';
import { useState } from "react";
import styles from "./AskQuestion.module.css";

export default function AskQuestion() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [asking, setAsking] = useState(false);

  async function handleAsk(e) {
    e.preventDefault();
    setAsking(true);
    setAnswer(""); 

    const res = await fetch("/api/ask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question }),
    });
    const data = await res.json();
    setAnswer(data.answer || "");
    setAsking(false);
  }

  return (
    <div>
      <form onSubmit={handleAsk} className={styles.askForm}>
        <input
          type="text"
          className={styles.questionInput}
          placeholder="Ask your question"
          value={question}
          onChange={e => setQuestion(e.target.value)}
          disabled={asking}
        />
        <button type="submit" className={styles.askBtn} disabled={asking || !question}>
          Ask
        </button>
      </form>
      <div className={styles.answerBox}>
        <span className={styles.answerLabel}>Answer:</span>
        {answer}
      </div>
    </div>
  );
}
