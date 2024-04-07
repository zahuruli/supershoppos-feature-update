import React, { useState } from "react";
import axios from "axios";

const ImageUploader = () => {
  const [file, setFile] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [uploadError, setUploadError] = useState("");

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const uploadImageToDrive = async () => {
    if (!file) {
      setUploadError("Please select a file.");
      return;
    }

    const accessToken = "YOUR_ACCESS_TOKEN"; // Replace with your Google Drive access token
    const url =
      "https://www.googleapis.com/upload/drive/v3/files?uploadType=media";

    const headers = {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": file.type,
    };

    try {
      const response = await axios.post(url, file, { headers });
      setImageUrl(response.data.webViewLink); // Assuming response contains webViewLink
      setUploadError("");
    } catch (error) {
      console.error("Error uploading image:", error);
      setUploadError("Error uploading image. Please try again later.");
    }
  };

  return (
    <div>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      <button onClick={uploadImageToDrive}>Upload Image</button>
      {uploadError && <p>{uploadError}</p>}
      {imageUrl && <img src={imageUrl} alt="Uploaded" />}
    </div>
  );
};

export default ImageUploader;
