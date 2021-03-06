import React from "react";
import { Suspense } from "react";
import VideoCover from "./three_d/video_cover";

export default function Home() {
  return (
    <div className="content-container">
      <Suspense fallback={null}>
        <VideoCover />
      </Suspense>
    </div>
  );
}
