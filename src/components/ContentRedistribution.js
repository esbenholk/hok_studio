import React, { useEffect, useState } from "react";
import ContentRedistributionCanvas from "./three_d/content_redistribution";

import SongPlayer from "./MusicPlayer";

export default function ContentRedistribution() {
  const [imageUrls, setImageUrls] = useState([]);
  const [hasNewImage, setHasNewImage] = useState(true);
  const [previewSource, setPreviewSource] = useState("");

  const loadImages = async () => {
    try {
      const res = await fetch("/api/getallimages");
      const data = await res.json();
      setImageUrls(data);
      console.log(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadImages();
    setHasNewImage(false);
  }, [hasNewImage]);

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    previewFile(file);
  };

  const previewFile = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setPreviewSource(reader.result);
    };
  };

  const handleSubmitFile = (e) => {
    e.preventDefault();
    if (!previewSource) return;
    uploadImage(previewSource);
  };

  const uploadImage = async (base64EncodedImage) => {
    try {
      await fetch("/api/upload", {
        method: "POST",
        body: JSON.stringify({ data: base64EncodedImage }),
        headers: { "Content-type": "application/json" },
      });
      setHasNewImage(true);
      setPreviewSource("");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="content-container">
      {imageUrls.length > 1 && (
        <ContentRedistributionCanvas imageUrls={imageUrls} />
      )}
      <div
        style={{
          position: "fixed",
          zIndex: "2",
          bottom: "0",
          right: "0",
          left: "0",
          marginRight: "7px",
          display: "flex",
          flexFlow: "row",
          justifyContent: "flex-end",
          alignItems: "flex-end",
        }}
      >
        <div
          style={{
            maxWidth: "300px",
            flexGrow: "1",
            position: "relative",
          }}
          className="standard-button flex-column"
        >
          <p
            style={{
              position: "absolute",
              bottom: "105%",
              margin: "0",
              left: "0",
              textAlign: "left",
            }}
          >
            {" "}
            Submit an image
          </p>
          <form onSubmit={handleSubmitFile} className="flex-column">
            <input
              type="file"
              name="file"
              placeholder="Upload an Image"
              onChange={handleFileInputChange}
              style={{
                marginTop: "20px",
                marginBottom: "20px",
                display: "flex",
                flexFlow: "row-reverse",
              }}
              className="custom-file-input"
            ></input>
            {previewSource && (
              <img
                src={previewSource}
                alt={previewSource}
                style={{ width: "100%" }}
              />
            )}
            <button className="standard-button" type="submit">
              UPLOAD
            </button>
          </form>
        </div>

        <div
          style={{
            flexGrow: "7",
          }}
        >
          {" "}
          <SongPlayer audioUrl="https://examples.devmastery.pl/assets/audio/deadfro5h.mp3" />
        </div>
      </div>
    </div>
  );
}
