'use client';

import { useState } from "react";
import styles from "./PDFUpload.module.css";

export default function PDFUpload() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  async function handleUpload(e) {
    e.preventDefault();
    setUploading(true);

    const formData = new FormData();
    formData.append("file", file);

    await fetch("/api/upload", { method: "POST", body: formData });
    setUploading(false);
  }

  return (
    <form onSubmit={handleUpload} className={styles.uploadForm}>
      <input
        type="file"
        accept="application/pdf"
        onChange={e => setFile(e.target.files[0])}
        className={styles.fileInput}
      />
      <button
        type="submit"
        disabled={uploading || !file}
        className={styles.uploadBtn}
      >
        {uploading ? "Uploading..." : "Upload PDF"}
      </button>
      {file && <span className={styles.fileName}>{file.name}</span>}
    </form>
  );
}
