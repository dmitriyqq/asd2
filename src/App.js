import React, { Component } from "react";
import Sketch from "react-p5";
import Queue from "queue-fifo"
import { isLinesIntersect, isPointsNear } from "./math";

export default class App extends Component {
  size = 800;
  verticies = [];

  mappixels = new Array(this.size).fill().map(i => new Array(this.size).fill(0));
  nextpixels = new Array(this.size).fill().map(i => new Array(this.size).fill(0));

  numOfPoints = 50;

  colors = [];

  setup = (p5, canvasParentRef) => {
    // use parent to render canvas in this ref (without that p5 render this canvas outside your component)
    p5.createCanvas(this.size, this.size).parent(canvasParentRef);
    p5.pixelDensity(1);

    console.log(this.mappixels);

    this.mappixels = new Array(this.size).fill().map(i => new Array(this.size).fill(0));
    this.nextpixels = new Array(this.size).fill().map(i => new Array(this.size).fill(0));

    // first, let's generate dozen of points
    this.verticies = [];
    for (let i = 0; i < this.numOfPoints; i++) {
      let x, y


      // check if there are point near
      let near = true;
      while (near) {
        x = p5.round(p5.random(1, this.size - 1));
        y = p5.round(p5.random(1, this.size - 1));

        let near2 = false;
        for (const v of this.verticies) {
          if (isPointsNear(v, { x, y }, 10)) {
            near2 = true;
            break;
          }
        }

        near = near2;
      }

      this.mappixels[x][y] = i;
      console.log('set', x, y, this.mappixels[x][y], this.mappixels[x+1][y], i);
      this.verticies.push({ x, y, i })

      this.colors.push([p5.round(p5.random(0, 254)), p5.round(p5.random(0, 254)), p5.round(p5.random(0, 254))])
    }

    // console.log(this.mappixels)
    this.sparseLog();
    for (let i = 0; i < 200; i++){
      this.iteratePixels();
      this.sparseLog();
    }
  };

  iteratePixels = () => {
    console.log('this.iteratePixels')
    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        let pixel = this.mappixels[i][j];
        const neighbors = []

        if (i > 0) {
          neighbors.push(this.mappixels[i - 1][j])
        }
        if (i < this.size - 1) {
          neighbors.push(this.mappixels[i + 1][j])
        }
        if (j > 0) {
          neighbors.push(this.mappixels[i][j - 1])
        }
        if (j < this.size - 1) {
          neighbors.push(this.mappixels[i][j + 1])
        }
        if (i > 0 && j > 0) {
          neighbors.push(this.mappixels[i - 1][j - 1])
        }
        if (i > 0 && j < this.size - 1) {
          neighbors.push(this.mappixels[i - 1][j + 1])
        }
        if (i < this.size - 1 && j > 0) {
          neighbors.push(this.mappixels[i + 1][j - 1])
        }
        if (i < this.size - 1 && j < this.size - 1) {
          neighbors.push(this.mappixels[i + 1][j + 1])
        }

        // console.log(neighbors);

        const map = new Map()
        for (const n of neighbors) {
          if (map.has(n)) {
            map.set(n, map.get(n) + 1);
          } else {
            map.set(n, 1);
          }
        }

        let max = 0, maxnum = 0;
        map.forEach((value, key) => {
          if (maxnum < key && value !== 0)
          {
            max = value;
            maxnum = key;
          }
        })

        // if (max !== 0) {
        //   console.log('max !== 0', max, maxnum);
        // }

        if (pixel === 0) {
          pixel = max;
        }

        this.nextpixels[i][j] = pixel;
      }
    }
    console.log('nextpixels')
    this.sparseLog(this.nextpixels);

    const t = this.mappixels;
    this.mappixels = this.nextpixels;
    this.nextpixels = t;
    
  }


  sparseLog = (pixels) => {
    if (pixels === undefined) {
      pixels = this.mappixels;
    }

    let counter = 0;
    for (let x = 0; x < this.size; x++) {
      for (let y = 0; y < this.size; y++) {
        if (pixels[x][y]) {
          counter++;
        }
      }
    }
    console.log('sparse counter: ', counter);
  }


  // NOTE: Do not use setState in draw function or in functions that is executed in draw function... 
  // pls use normal variables or class properties for this purposes
  draw = p5 => {
    p5.background(0);
    p5.loadPixels();
    for (let x = 0; x < this.size; x++) {
      for (let y = 0; y < this.size; y++) {
        const num = this.mappixels[x][y];

        const color = this.colors[num];

        let pix = (x + y * this.size) * 4;
        p5.pixels[pix] = color[0];
        p5.pixels[pix + 1] = color[1];
        p5.pixels[pix + 2] = color[2];
        // p5.pixels[pix + 3] = 255;
      }
    }
    p5.updatePixels();
    


    
    // p5.strokeWeight(2);
    // for (const point of this.verticies) {
    //   p5.stroke(0, point.i*5, 255-point.i*5);
    //   p5.circle(point.x, point.y, 3);
    // }
    p5.stroke(255);
  };

  render() {
    return (
      <React.Fragment>
        <h1>Раскраска карты</h1>
        <Sketch setup={this.setup} draw={this.draw} />
      </React.Fragment>
    )
  }
}