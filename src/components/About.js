import React from "react";
import { Suspense } from "react";

import R3FCanvas from "./three_d/trials/canvas";

export default function About() {
  return (
    <div className="content-container">
      <Suspense fallback={null}>
        <R3FCanvas />
      </Suspense>
    </div>
  );
}
