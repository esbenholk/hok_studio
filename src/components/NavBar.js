import React from "react";
import { NavLink } from "react-router-dom";

export default function NavBar() {
  return (
    <header>
      <div>
        <nav className="flex-row">
          <NavLink className="standard-button" to="/">
            HOUSE OF KILLING
          </NavLink>
          <NavLink className="standard-button" to="/projects">
            Projects
          </NavLink>
          <NavLink className="standard-button" to="/about">
            About us
          </NavLink>
          <NavLink className="standard-button" to="/">
            Studio
          </NavLink>
          <NavLink className="standard-button" to="/projects">
            Content Curation
          </NavLink>
          <NavLink className="standard-button" to="/about">
            Exhibitions
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
