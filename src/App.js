import React, { Component } from "react";
import Sketch from "react-p5";

export default class App extends Component {
  constructor(props) {
    super(props);
    this.size = 500;
    this.numOfPoints = 100;
    this.numOfSamples = 500;
    this.mappixels = new Array(this.size).fill().map(i => new Array(this.size).fill(0));
    this.nextpixels = new Array(this.size).fill().map(i => new Array(this.size).fill(0));
    this.selectedCountry = null;
    this.countries = [];
    this.currentGeneration = [];
    this.colors = [];
    this.scolors = [
      [255, 0, 255],
      [255, 0, 0],
      [0, 255, 0],
      [0, 0, 255],
    ];

    this.state = {
      draw: "1",
      evoRunning: false,
      mapRunning: true,
      size: 500,
      numOfPoints: 50,
      strNumOfPoints: "50",
      numOfSamples: 5000,
      strNumOfSamples: "5000",
      mutationFactor: 10,
      strMutationFactor: "10",
      currentGeneration: 0,
      topscore: 0,
      canRunEvo: false,
    }
  }

  setup = (p5, canvasParentRef) => {
    this.p5 = p5;
    p5.createCanvas(this.size, this.size).parent(canvasParentRef);
    p5.pixelDensity(1);

    this.startGeneratingMap();
  };

  startGeneratingMap = () => {
    const { size, numOfPoints } = this.state;
    this.colors = [];
    this.countries = [];

    // algo to generate map uses nextpixels to generate second step, then swaps it to the mappixels -
    // the actual map coloring in countries indices

    this.mappixels = new Array(size).fill().map(i => new Array(size).fill(0));
    this.nextpixels = new Array(size).fill().map(i => new Array(size).fill(0));

    // let's generate dozen of points
    for (let i = 0; i < numOfPoints; i++) {
      const x = this.p5.round(this.p5.random(1, size - 1));
      const y = this.p5.round(this.p5.random(1, size - 1));

      // raster representation
      this.mappixels[x][y] = i;

      this.countries.push({ index: i, neighbors: new Set() })

      // create random rgb color
      this.colors.push([
        this.p5.round(this.p5.random(0, 254)),
        this.p5.round(this.p5.random(0, 254)),
        this.p5.round(this.p5.random(0, 254))
      ])
    }

    this.currentGeneration = [];
    this.selectedCountry = null;
    this.topscore = 0;

    this.setState(() => ({
      currentGeneration: 0,
      draw: "1",
      mapRunning: true,
      evoRunning: false,
      canRunEvo: false,
    }))
  }

  generateMapStep = () => {
    const { size, evoRunning } = this.state;
    if (evoRunning) {
      throw new Error('couldnt generate map during evo phase');
    }

    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {

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
          if (max < value && key !== 0) {
            max = value;
            maxnum = key;
          }
        });

        if (pixel === 0 && Math.abs(Math.random()) < 0.4) {
          pixel = maxnum;
        }

        this.nextpixels[i][j] = pixel;
      }
    }

    [this.nextpixels, this.mappixels] = [this.mappixels, this.nextpixels]

    if (this.sparseLog() === this.size * this.size) {
      this.setState(() => ({ mapRunning: false, canRunEvo: true }));
      this.calcNeigbours();
      this.makeFirstGeneration();
    }
  }

  // get count of empty pixels left
  sparseLog = (pixels) => {
    if (pixels === undefined) {
      pixels = this.mappixels;
    }

    const map = new Map();
    let counter = 0;
    for (let x = 0; x < this.size; x++) {
      for (let y = 0; y < this.size; y++) {
        const n = pixels[x][y]
        if (n !== 0) {
          counter++;
        }

        if (!map.has(n)) {
          map.set(n, 1)
        } else {
          map.set(n, map.get(n) + 1)
        }

      }
    }

    return counter;
  }

  // to highlight neighbors
  getCountryOpacity = (country) => {
    if (!this.selectedCountry) {
      return 255;
    }

    if (this.selectedCountry === country) {
      return 255;
    } else if (this.countries[this.selectedCountry].neighbors.has(country)) {
      return 150;
    } else {
      return 50;
    }
  }

  mouseMoved = p5 => {
    let { mouseX, mouseY } = p5;
    mouseX = p5.round(mouseX);
    mouseY = p5.round(mouseY);

    if (mouseX >= 0 && mouseX < this.size && mouseY >= 0 && mouseY < this.size) {
      const newCountry = this.mappixels[mouseX][mouseY];
      if (this.selectedCountry !== newCountry && newCountry !== 0) {
        this.selectedCountry = newCountry;
      }

    }
  }

  calcNeigbours() {
    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        const currentCountry = this.mappixels[i][j];
        const { neighbors } = this.countries[currentCountry];
        if (i > 0 && this.mappixels[i - 1][j] !== currentCountry) {
          neighbors.add(this.mappixels[i - 1][j])
        }
        if (i < this.size - 1 && this.mappixels[i + 1][j] !== currentCountry) {
          neighbors.add(this.mappixels[i + 1][j])
        }
        if (j > 0 && this.mappixels[i][j - 1] !== currentCountry) {
          neighbors.add(this.mappixels[i][j - 1])
        }
        if (j < this.size - 1 && this.mappixels !== currentCountry) {
          neighbors.add(this.mappixels[i][j + 1])
        }
      }
    }
  }

  draw = p5 => {
    const { mapRunning, evoRunning } = this.state;
    if (mapRunning) {
      this.generateMapStep();
    }

    if (evoRunning) {
      this.makeSecondGeneration();
    }

    this.p5.background(0);
    this.p5.loadPixels();
    const { size } = this.state
    for (let x = 0; x < size; x++) {
      for (let y = 0; y < size; y++) {
        const pix = (x + y * size) * 4;
        const country = this.mappixels[x][y];
        let color;
        if (this.state.draw === "1") {

          color = this.colors[country];
        } else {
          const dna = this.currentGeneration[0].dna
          color = this.scolors[dna[country]];
        }

        let border = false;
        if (x > 0 && this.mappixels[x - 1][y] !== country) {
          border = true;
        } else if (y > 0 && this.mappixels[x][y - 1] !== country) {
          border = true;
        } else if (x < size - 1 && this.mappixels[x + 1][y] !== country) {
          border = true;
        } else if (y < size - 1 && this.mappixels[x][y + 1] !== country) {
          border = true;
        }

        this.p5.pixels[pix] = border ? 0 : color[0];
        this.p5.pixels[pix + 1] = border ? 0 : color[1];
        this.p5.pixels[pix + 2] = border ? 0 : color[2];

        if (this.state.draw === "1") {
          this.p5.pixels[pix + 3] = this.getCountryOpacity(country); // alpha
        } else {
          this.p5.pixels[pix + 3] = 255;
        }
      }
    }
    this.p5.updatePixels();
    this.p5.stroke(255);
  };


  calcFitness = (dna) => {
    let score = 0;

    for (let i = 0; i < this.countries.length; i++) {
      const country = this.countries[i];
      for (const neighbor of country.neighbors) {
        if (dna[neighbor] === dna[country.index] && country.index !== neighbor) {
          score += country.neighbors.size;
        }
      }
    }

    return score;
  }

  mutate = (dna) => {
    const { mutationFactor } = this.state;
    const copy = [...dna];
    for (let i = 0; i < this.p5.random(0, this.p5.round(this.numOfPoints / mutationFactor)); i++) {
      copy[this.p5.round(this.p5.random(0, dna.length - 1))] = this.p5.round(this.p5.random(0, 3));
    }
    return copy;
  }

  makeFirstGeneration = () => {
    this.currentGeneration = new Array(this.numOfSamples).fill()
      .map(_ => {
        const dna = new Array(this.countries.length).fill(0).map(() => this.p5.round(this.p5.random(0, 3)))
        return { dna, fitness: this.calcFitness(dna) }
      });

    this.currentGeneration.sort((a, b) => a.fitness - b.fitness)
    this.setState(() => ({ currentGeneration: 0 }));
  }

  resetGeneticAlgorithm = () => {
    this.makeFirstGeneration();
    this.makeSecondGeneration();
  }

  makeSecondGeneration = () => {
    const { mapRunning } = this.state;
    if (mapRunning) {
      throw new Error('coudnt run evo while map havent finished generating')
    }

    this.setState(() => ({ evoRunning: true }));

    const currentGeneration = this.currentGeneration;

    this.currentGeneration = [];
    // the best goes without changes
    for (let i = 0; i < 20; i++) {
      this.currentGeneration.push(currentGeneration[i])
    }

    for (let i = 20; i < this.numOfSamples - 100; i++) {
      const dna = this.mutate(currentGeneration[Math.floor(i % 20)].dna)
      this.currentGeneration.push({
        dna, fitness: this.calcFitness(dna)
      })
    }

    for (let i = 0; i < 100; i++) {
      const dna = new Array(this.countries.length).fill(0).map(() => this.p5.round(this.p5.random(0, 3)))
      this.currentGeneration.push({
        dna, fitness: this.calcFitness(dna)
      })
    }

    let topscore = 10000;
    for (const t of this.currentGeneration) {
      topscore = Math.min(topscore, t.fitness);
    }

    this.currentGeneration.sort((a, b) => a.fitness - b.fitness)
    if (topscore === 0) {
      this.setState(p => ({ topscore, evoRunning: false, currentGeneration: p.currentGeneration + 1 }));
    } else {
      this.setState(p => ({ topscore, evoRunning: true, currentGeneration: p.currentGeneration + 1 }));
    }

  }

  createTableCells = (row) => {
    const cells = [];
    let counter = 0;

    cells.push(<td key={0}><b>{row.fitness}</b></td>)
    for (const t of row.dna) {
      cells.push(<td key={counter + 1}>{t}</td>)
      counter++;
    }

    return cells;
  }

  createTableRows = () => {
    return this.currentGeneration.map((el, i) => (<tr key={i}>{this.createTableCells(el)}</tr>));
  }

  handleNumberOfCountriesChange = (e) => {
    e.persist();
    this.setState(() => ({ numOfPoints: Number(e.target.value) || 100, strNumOfPoints: e.target.value }))
  }

  handlePopulationSizeChange = (e) => {
    e.persist();
    this.setState(() => ({ numOfSamples: Number(e.target.value) || 100, strNumOfSamples: e.target.value }))
  }

  handleMutationChanceChange = (e) => {
    e.persist();
    this.setState(() => ({ mutationFactor: Number(e.target.value) || 10, strMutationFactor: e.target.value }))
  }

  render() {
    let table = null;

    // if (this.currentGeneration) {
    //   // 
    //   table = (<table>
    //       <tbody>
    //       {this.createTableRows()}
    //       </tbody>
    //     </table>)
    // }

    const { evoRunning, mapRunning,
      canRunEvo, currentGeneration, strNumOfSamples,
      strNumOfPoints, strMutationFactor, mutationFactor, numOfPoints, numOfSamples } = this.state;

    return (
      <React.Fragment>
        <h1>Раскраска карты</h1>

        <p>
          <label>Number of countries: </label>
          <input type="text" name="size" value={strNumOfPoints} onChange={this.handleNumberOfCountriesChange} />
        </p>

        <p>
          <label>Population size: </label>
          <input type="text" name="size" value={strNumOfSamples} onChange={this.handlePopulationSizeChange} />
        </p>

        <p>
          <label>Mutation factor: </label>
          <input type="text" name="size" value={strMutationFactor} onChange={this.handleMutationChanceChange} />
        </p>


        <p>Current gen: {currentGeneration}</p>
        <p>Top score: {this.state.topscore}</p>
        <p>Number of countries: {numOfPoints}</p>
        <p>Population size: {numOfSamples}</p>
        <p>Mutation factor: {mutationFactor}</p>

        <p>
          <button disabled={mapRunning || evoRunning} onClick={this.startGeneratingMap}>Create new map</button>
          <button disabled={mapRunning || evoRunning || !canRunEvo} onClick={this.resetGeneticAlgorithm}>Run evo</button>
          <button onClick={() => { this.setState(() => ({ evoRunning: false, mapRunning: false })) }}>Stop</button>
          <select disabled={mapRunning || evoRunning} onChange={e => { e.persist(); this.setState(() => ({ draw: e.target.value })) }}>
            <option value="1">Страны</option>
            {!mapRunning ? <option value="2">Раскраска</option> : null}
          </select>
        </p>

        <Sketch setup={this.setup} draw={this.draw} mouseMoved={this.mouseMoved} />
        {table}
      </React.Fragment>
    )
  }
}