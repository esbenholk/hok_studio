import React from "react";
import { Suspense } from "react";
import Play4UsNowCanvas from "./three_d/play4usnow";

export default function Home() {
  return (
    <div className="content-container">
      <Suspense fallback={null}>
        <Play4UsNowCanvas />
      </Suspense>
    </div>
  );
}
