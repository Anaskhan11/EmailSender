// SendMails.jsx
import React, { useState } from "react";
import axios from "axios";

function SendMails() {
  const [file, setFile] = useState("");

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("file", file);

    axios
      .post("http://localhost:3000/sendmail/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        alert("Emails Sent Successfully!");
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("Failed to send emails.");
      });
  };

  return (
    <div className="form-container">
      <form onSubmit={handleFormSubmit}>
        <input type="file" name="file" onChange={handleFileChange} />
        <button type="submit">Upload and Send Emails</button>
      </form>
    </div>
  );
}

export default SendMails;

// https://portal.aws.amazon.com/billing/signup#/identityverification
