/* eslint-disable no-lone-blocks */
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { Suspense, lazy } from "react";
import NavBar from "./components/NavBar.js";
import "./App.css";
import Play4UsNow from "./components/Play4UsNow.js";

const Home = lazy(() => import("./components/Home.js"));
const About = lazy(() => import("./components/About.js"));
const SinglePost = lazy(() => import("./components/SinglePost.js"));
const Posts = lazy(() => import("./components/Posts.js"));
const Audio = lazy(() => import("./components/Audio.js"));
const Worldbuilder = lazy(() => import("./components/Worldbuilder.js"));
const Skeleton = lazy(() => import("./components/Skeleton.js"));
const Projects = lazy(() => import("./components/Projects.js"));
const Playground = lazy(() => import("./components/Playground.js"));
const ContentRedistribution = lazy(() =>
  import("./components/ContentRedistribution.js")
);

function App() {
  return (
    <>
      <BrowserRouter>
        <header className="flex-row">
          <NavBar />
        </header>
        <main className="main-container">
          <Suspense fallback={null}>
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
              <Route path="/playground">
                <Playground />
              </Route>
              <Route path="/Content-Redistribution">
                <ContentRedistribution />
              </Route>
              <Route path="/play4usnow">
                <Play4UsNow />
              </Route>
            </Switch>
          </Suspense>
        </main>
      </BrowserRouter>
    </>
  );
}

export default App;
