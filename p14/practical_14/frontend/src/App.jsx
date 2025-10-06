import { useState } from "react";
import "./App.css"; // ✅ Import your CSS file

export default function App() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];

    if (!selectedFile) return setMessage("Please select a file.");

    if (selectedFile.type !== "application/pdf") {
      setMessage("❌ Only PDF files are allowed.");
      setFile(null);
      return;
    }

    if (selectedFile.size > 2 * 1024 * 1024) {
      setMessage("❌ File size exceeds 2MB limit.");
      setFile(null);
      return;
    }

    setFile(selectedFile);
    setMessage("");
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return setMessage("Please select a valid PDF file.");

    const formData = new FormData();
    formData.append("resume", file);

    try {
      setLoading(true);
      setMessage("");

      const res = await fetch("http://localhost:5000/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      setMessage(res.ok ? `✅ ${data.message}` : `❌ ${data.error}`);
    } catch {
      setMessage("❌ Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <form onSubmit={handleUpload} className="upload-form">
        <h1>Upload Your Resume</h1>

        <input type="file" accept="application/pdf" onChange={handleFileChange} />

        <button type="submit" disabled={loading}>
          {loading ? "Uploading..." : "Upload"}
        </button>

        {message && (
          <p className={message.includes("❌") ? "error" : "success"}>
            {message}
          </p>
        )}
      </form>
    </div>
  );
}
