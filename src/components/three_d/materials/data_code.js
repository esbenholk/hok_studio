import React from 'react'

class DataCanvas extends React.Component {

    constructor(props) {
        super(props);
        this.myRef = React.createRef();
      }

    componentDidMount() {
      const canvas = this.myRef.current
      const ctx = canvas.getContext("2d")

      var wipeBlock1 = "██"; //Block to clear
      var wipeBlock2 = "▉"; //Block to clear

      //chinese characters - taken from the unicode charset
      var matrix =
        "data, click me, sex, fetish, spank, view, track, 404, cokkie, file, brb, control, hard, sex, fuck, me, baby, lost, you, are, ?, , ?, submit, submit, sex, xx, x, XYZ, WWW, track, data"
      
        //converting the string into an array of single words
      matrix = matrix.split(",");
  
      var font_size = 20;
      ctx.font = font_size + "px monospace";
  
      var columns = canvas.width / font_size*10; //number of columns for the rain
      //one per column
      var drops = []; //Array of drops
      var speed = []; //Frames till next move
      var sMem = []; //Drop speed
  
      //x below is the x coordinate
      //1 = y co-ordinate of the drop(same for every drop initially)
      for (var x = 0; x < columns; x++) {
        drops[x] = 1;
        sMem[x] = 1;
        speed[x] = 0;
      }
  
      //drawing the characters
      function draw() {
        //Black BG for the canvas
        //translucent BG to show trail
        ctx.shadowColor = "#002aff";
        ctx.shadowBlur = 0;
        ctx.fillStyle = "rgba(122, 122, 122, 0.1)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
  
        //looping over drops
        for (var i = 0; i < drops.length; i++) {
          //sending the drop back to the top randomly after it has crossed the screen
          //adding a randomness to the reset to make the drops scattered on the Y axis
          if (drops[i] * font_size > canvas.height && Math.random() > 0.985) {
            drops[i] = 0;
            sMem[i] = 1 + Math.floor(Math.random() * 3);
            speed[i] = 0;
          }
  
          //incrementing Y coordinate
          if (speed[i] >= sMem[i]) {
            ctx.fillStyle = "rgba(122, 122, 122, 0.2)"; //black text
            ctx.shadowBlur = 0;
  
            ctx.fillText(wipeBlock1, i * font_size, drops[i] * font_size); //x = i*font_size, y = value of drops[i]*font_size
            ctx.shadowBlur = 0;
            ctx.fillText(wipeBlock2, i * font_size, drops[i] * font_size); //x = i*font_size, y = value of drops[i]*font_size
            ctx.shadowBlur = 0;
            var text = matrix[Math.floor(Math.random() * matrix.length)]; //a random chinese character to print
            ctx.shadowColor = "#ff0000";
            ctx.shadowBlur = 2;
            ctx.fillStyle = "#ff0000"; //green text
            ctx.fillText(text, i * font_size, drops[i] * font_size); //x = i*font_size, y = value of drops[i]*font_size
            ctx.shadowColor = "#fff";
            ctx.shadowBlur = 2;
            ctx.fillStyle = "#fff"; //white text
            ctx.fillText(text, i * font_size, (drops[i] + 1) * font_size); //x = i*font_size, y = value of drops[i]*font_size
            drops[i]++;
            speed[i] = 0;
          } else {
            speed[i]++;
          }
        }
  
      }
      setInterval(draw, 30);
    }

    render() {
      return(
          <canvas id="dataCanvas" ref={this.myRef} width={640} height={425} style={{display:'none'}}/>
      )
    }
  }


  
  
export default DataCanvas