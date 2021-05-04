import React from "react";
import { Suspense } from "react";

import InfiniteModel from "./three_d/infinite_model";

export default function Project() {
  return (
    <div className="content-container">
      <Suspense fallback={null}>
        <InfiniteModel />
      </Suspense>
    </div>
  );
}
