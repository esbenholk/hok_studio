import React from "react";
import { Suspense } from "react";

import PlaygroundCanvas from "./three_d/playground";

export default function Playground() {
  return (
    <div className="content-container">
      <Suspense fallback={null}>
        <PlaygroundCanvas />
      </Suspense>
    </div>
  );
}
