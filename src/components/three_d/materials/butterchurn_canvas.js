import React from "react";
import butterchurn from "butterchurn";
import butterchurnPresets from "butterchurn-presets";

export default class Visualizer extends React.Component {
  state = {
    visualizer: null,
    audioContext: null,
    canvas: null,
    audioFile: null,
    audioName: null,
    source: null,
    playing: false,
    context: null,
  };

  componentDidMount = () => {
    let { audioFile, source } = this.state;

    //get width of screen we will make this auto adjust later.
    const width = window.innerWidth;
    const height = window.innerHeight;

    //get state of canvas visualizer and audio context
    let { canvas, visualizer, audioContext } = this.state;

    //get canvas
    canvas = document.getElementById("dataCanvas");

    //set width and height of canvas
    canvas.width = width;
    canvas.height = height;

    //create a new audio context
    audioContext = new AudioContext();

    audioFile = new Audio("sounds/afrodisiac.mp3");

    //set source
    source = audioContext.createMediaElementSource(audioFile);
    source.connect(audioContext.destination);

    //play audio
    audioFile.load();

    //create visualizer with butterchurn
    visualizer = butterchurn.createVisualizer(audioContext, canvas, {
      width: width,
      height: height,
    });

    //connect audio to visualizer
    visualizer.connectAudio(source);

    //set state for audiofile and source
    this.setState({
      audioFile,
      source,
    });

    //intialize with default values
    this.visualizerIntializer(visualizer, audioContext, canvas, width, height);
  };

  componentWillUnmount() {
    console.log("unmounting");
    this.stopAudio();
  }
  visualizerIntializer = (visualizer, audioContext, canvas, width, height) => {
    visualizer.setRendererSize(width, height);

    this.setState({
      visualizer,
      audioContext,
      canvas,
    });

    this.randomPresets();

    this.renderFrames();
  };
  renderFrames = () => {
    let { visualizer } = this.state;
    if (visualizer) {
      visualizer.render();
    }
    setTimeout(() => {
      this.renderFrames(visualizer);
    }, 1000 / 244);
  };
  randomPresets = () => {
    if (this.state.visualizer) {
      this.state.visualizer.loadPreset(
        this.randomProperty(butterchurnPresets.getPresets()),
        1
      ); // 2nd argument is the number of seconds to blend presets
    } else {
      setTimeout(() => {
        this.randomPresets();
      }, 500);
    }
    if (this.state.playing === true) {
      setTimeout(() => {
        this.randomPresets();
      }, 500);
    }
  };
  randomProperty = (obj) => {
    let keys = Object.keys(obj);
    return obj[keys[(keys.length * Math.random()) << 0]];
  };
  playAudio = () => {
    if (this.state.audioFile !== null) {
      let { playing } = this.state;

      playing = true;
      this.setState({
        playing,
      });

      setTimeout(() => {
        this.randomPresets();
      }, 10000);

      this.state.audioFile.pause();
      this.state.audioFile.play();
    } else {
    }
  };
  stopAudio = () => {
    let { playing } = this.state;

    playing = false;
    this.setState({
      playing,
    });

    setTimeout(() => {
      this.randomPresets();
    }, 10000);
    //pause
    if (this.state.audioFile !== null) {
      this.state.audioFile.pause();
    } else {
    }
  };
  render() {
    return (
      <div>
        <div style={{ position: "absolute", top: "0", right: "0" }}>
          <button onClick={this.playAudio}>Play Audio</button>
          <button onClick={this.stopAudio}>Stop Audio</button>
        </div>
        <canvas
          id="dataCanvas"
          ref={this.canvas}
          style={{ display: "none", height: "100px", width: "100px" }}
        />
      </div>
    );
  }
}
