import React from "react";
import { Suspense } from "react";

import MinecraftWorldbuilder from "./three_d/minecraft_worldbuilder";

export default function Worldbuilder() {
  return (
    <div className="content-container">
      <Suspense fallback={null}>
        <MinecraftWorldbuilder />
      </Suspense>
    </div>
  );
}
