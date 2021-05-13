import React from "react";
import { Suspense } from "react";
import Play4UsNowCanvas from "./three_d/play4usnow";

export default function Play4UsNow() {
  return (
    <div className="content-container">
      <Suspense fallback={null}>
        <Play4UsNowCanvas />
      </Suspense>
    </div>
  );
}
