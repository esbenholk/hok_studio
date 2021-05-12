import React from "react";
import { NavLink } from "react-router-dom";

export default function NavBar() {
  return (
    <>
      <nav className="fixed-left-top">
        <div className="flex-row">
          <NavLink className="standard-button" to="/">
            ESBEN HOLK @ HOUSE OF KILLING
          </NavLink>
        </div>
        <div className="flex-row">
          <NavLink className="standard-button" to="/posts">
            Exhibitions
          </NavLink>
          <NavLink className="standard-button" to="/projects">
            Projects
          </NavLink>
          <NavLink className="standard-button" to="/about">
            About us
          </NavLink>
          <NavLink className="standard-button" to="/audio-visualiser">
            Audio Visualizer
          </NavLink>
          <NavLink className="standard-button" to="/worldbuilder">
            World Builder
          </NavLink>
          <NavLink className="standard-button" to="/skeleton">
            Skeleton
          </NavLink>
          <NavLink className="standard-button" to="/playground">
            Playground
          </NavLink>
          <NavLink className="standard-button" to="/Content-Redistribution">
            Content Redistribution
          </NavLink>
        </div>
      </nav>
      <div
        className="fixed-right-top standard-button no-padding"
        style={{ overflow: "hidden" }}
      >
        <img
          className="tiny"
          src="https://stayvirtual.s3.amazonaws.com/crystals/greencrystal"
          alt="crystal"
        />
        <img
          className="tiny"
          src="https://stayvirtual.s3.amazonaws.com/licking-transparant-crop"
          alt="starfish patricks licking tung"
        />
      </div>
    </>
  );
}
