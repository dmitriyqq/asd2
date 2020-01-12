import React, { Component } from "react";
import Sketch from "react-p5";
import Queue from "queue-fifo"
import { isLinesIntersect, isPointsNear } from "./math";

export default class App extends Component {
  size = 800;
  verticies = [];
  edges = [];
  polygons = []
  numOfPoints = 50;
  g = [];


  createPolygon = p5 => {
    // get start point
    const v1 = p5.round(p5.random(0, this.numOfPoints-1))
    const numOfEdges = p5.round(p5.random(4, 10))
    const svert = this.verticies[v1];
    const used = new Set();
    console.log('createPolygon', v1, numOfEdges);
    const dfsRes = this.dfs(svert, 0, v1, used, numOfEdges);

    this.polygons.push({verticies: dfsRes})
    console.log('dfsRes', dfsRes);
  }

  dfs = (v, l, svert, used, max_level) => {
    if (l < max_level) {
      for (const e of this.g[v.i]) {
        if (e !== svert && !used.has(e)) {
          used.add(v.i);
          const dfsRes = this.dfs(this.verticies[e], l+1, svert, used, max_level);
          used.delete(v.i);
          if (dfsRes !== null) {
            console.log('finished', dfsRes, l);
            dfsRes.push(v.i);
            console.log('adding next vert', dfsRes, l);
            return dfsRes;
          }

          console.log('no match', l)
        }
      }
      return null;
    } else {
      if (this.g[v.i].has(svert)) {
        console.log('last edge found');
        return [v.i]
      } else {
        return null;
      }
    }
  }

  createGraph = () => {
    for (let i = 0; i < this.numOfPoints; i++) {
      this.g[i] = new Set();
    }

    for (const edge of this.edges) {
      const iv1 = edge.v1.i;
      const iv2 = edge.v2.i;

      this.g[iv1].add(iv2)
      this.g[iv2].add(iv1)
    }
  }


  setup = (p5, canvasParentRef) => {
    // use parent to render canvas in this ref (without that p5 render this canvas outside your component)
    p5.createCanvas(this.size, this.size).parent(canvasParentRef);

    // first, let's generate dozen of points
    this.verticies = [];

    this.verticies.push({ x: 1, y: 1, i: 0})
    this.verticies.push({ x: this.size - 1, y: 1, i: 1 })
    this.verticies.push({ x: 1, y: this.size - 1, i: 2})
    this.verticies.push({ x: this.size - 1, y: this.size - 1, i: 3})

    for (let i = 4; i < this.numOfPoints; i++) {
      console.log(i);
      let x, y
      

      // check if there are point near
      let near = true;
      while (near) {
        x = p5.round(p5.random(1, this.size - 1));
        y = p5.round(p5.random(1, this.size - 1));

        let near2 = false;
        for (const v of this.verticies) {
          if (isPointsNear(v, {x, y}, 10)) {
            near2 = true;
            break;
          }
        }

        near = near2;
      }

      this.verticies.push({ x, y, i })
    }
    console.log(this.verticies)

    this.edges = [];

    this.edges.push({v1: this.verticies[0], v2: this.verticies[1]})
    this.edges.push({v1: this.verticies[1], v2: this.verticies[3]})
    this.edges.push({v1: this.verticies[2], v2: this.verticies[3]})
    this.edges.push({v1: this.verticies[0], v2: this.verticies[2]})

    // let's generate edges
    for(let i = 0; i < 10000; i++) {
      const v1 = p5.round(p5.random(0, this.numOfPoints-1))
      const v2 = p5.round(p5.random(0, this.numOfPoints-1))
      console.log(v1, v2);

      const pv1 = this.verticies[v1];
      const pv2 = this.verticies[v2];
      console.log(pv1, pv2)

      let notIntersect = true;
      for(const edge of this.edges) {
        if (isLinesIntersect(pv1, pv2, edge.v1, edge.v2)) {
          notIntersect = false;
          break;
        }
      }

      if (v1 !== v2 && notIntersect && pv1.x !== pv2.x && pv1.y !== pv2.y) {
        this.edges.push({ v1: pv1, v2: pv2 });
      }
    }

    // create graph structure to speed up computations
    this.createGraph();

    // lets create first polygon
    this.polygons = [];
    this.createPolygon(p5);
    // console.log(this.edges);
  };

  // NOTE: Do not use setState in draw function or in functions that is executed in draw function... 
  // pls use normal variables or class properties for this purposes
  draw = p5 => {
    p5.background(0);

    p5.stroke(255, 0, 255)
    p5.strokeWeight(4);
    for (const edge of this.edges) {
      p5.line(edge.v1.x, edge.v1.y, edge.v2.x, edge.v2.y);
    }


    p5.stroke(0, 255, 0);
    p5.strokeWeight(2);
    for (const point of this.verticies) {
      p5.circle(point.x, point.y, 3);
    }

    p5.stroke(0, 0, 255);
    p5.strokeWeight(5);
    for (const polygon of this.polygons) {
      const {verticies} = polygon;
      for (let i = 0; i < verticies.length - 1; i++) {
        const v1 = this.verticies[verticies[i]];
        const v2 = this.verticies[verticies[i+1]];
        p5.line(v1.x, v1.y, v2.x, v2.y);
      }

      const v1 = this.verticies[verticies[0]];
      const v2 = this.verticies[verticies[verticies.length - 1]];
      p5.line(v1.x, v1.y, v2.x, v2.y);
    }

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