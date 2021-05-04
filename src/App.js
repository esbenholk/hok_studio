import { BrowserRouter, Route, Switch } from "react-router-dom";
import Home from "./components/Home.js";
import About from "./components/About.js";
import SinglePost from "./components/SinglePost.js";
import Posts from "./components/Posts.js";
import NavBar from "./components/NavBar.js";
import { NavLink } from "react-router-dom";
import Audio from "./components/Audio.js";
import Worldbuilder from "./components/Worldbuilder";

import "./App.css";

function App() {
  return (
    <>
      <div></div>
      <div className="main-container">
        <BrowserRouter>
          <div>
            <NavBar></NavBar>
          </div>

          <div className="content-container">
            <div className="flex-row fixed">
              <NavLink className="standard-button" to="/">
                Esben Holk @ HOUSE OF KILLING
              </NavLink>
            </div>

            <Switch>
              <Route exact path="/">
                <Home />
              </Route>
              <Route path="/about">
                <About />
              </Route>

              <Route path="/projects/:slug">
                <SinglePost />
              </Route>
              <Route path="/projects">
                <Posts />
              </Route>
              <Route path="/audio-visualiser">
                <Audio />
              </Route>
              <Route path="/worldbuilder">
                <Worldbuilder />
              </Route>
            </Switch>
          </div>
        </BrowserRouter>
      </div>
    </>
  );
}

export default App;
