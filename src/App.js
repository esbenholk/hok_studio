import { BrowserRouter, Route, Switch } from "react-router-dom";
import Home from "./components/Home.js";
import About from "./components/About.js";
import SinglePost from "./components/SinglePost.js";
import Posts from "./components/Posts.js";
import NavBar from "./components/NavBar.js";
import { NavLink } from "react-router-dom";

import "./App.css";

import R3FCanvasWDataAnimation from "./components/three_d/trials/perlin";

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
              <Route component={Home} path="/" exact />
              <Route component={About} path="/about" />
              <Route component={SinglePost} path="/projects/:slug" />
              <Route component={Posts} path="/projects" />
            </Switch>
          </div>
        </BrowserRouter>
      </div>
    </>
  );
}

export default App;
