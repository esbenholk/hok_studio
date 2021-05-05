import { BrowserRouter, Route, Switch } from "react-router-dom";
import Home from "./components/Home.js";
import About from "./components/About.js";
import SinglePost from "./components/SinglePost.js";
import Posts from "./components/Posts.js";
import NavBar from "./components/NavBar.js";
import Audio from "./components/Audio.js";
import Worldbuilder from "./components/Worldbuilder";
import Skeleton from "./components/Skeleton";
import Projects from "./components/Projects";

import "./App.css";

function App() {
  return (
    <>
      <BrowserRouter>
        <header className="flex-row">
          <NavBar />
        </header>
        <main className="main-container">
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
            <Route path="/posts">
              <Posts />
            </Route>
            <Route path="/projects">
              <Projects />
            </Route>
            <Route path="/audio-visualiser">
              <Audio />
            </Route>
            <Route path="/worldbuilder">
              <Worldbuilder />
            </Route>
            <Route path="/skeleton">
              <Skeleton />
            </Route>
          </Switch>
        </main>
      </BrowserRouter>
    </>
  );
}

export default App;
