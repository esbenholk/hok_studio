import React from "react";
import { Suspense } from "react";
import AudioVisualiser from "./three_d/visualiser/index";

export default function Audio() {
  return (
    <div className="content-container">
      <Suspense fallback={null}>
        <AudioVisualiser />
      </Suspense>
    </div>
  );
}
