(this.webpackJsonpasd2=this.webpackJsonpasd2||[]).push([[0],{10:function(e,n,t){e.exports=t(16)},15:function(e,n,t){},16:function(e,n,t){"use strict";t.r(n);var r=t(0),a=t.n(r),i=t(2),o=t.n(i),s=(t(15),t(7)),u=t(3),l=t(4),p=t(8),c=t(5),m=t(9),f=t(6),h=t.n(f),d=function(e){function n(e){var t;return Object(u.a)(this,n),(t=Object(p.a)(this,Object(c.a)(n).call(this,e))).setup=function(e,n){t.p5=e,e.createCanvas(t.size,t.size).parent(n),e.pixelDensity(1),t.startGeneratingMap()},t.startGeneratingMap=function(){var e=t.state,n=e.size,r=e.numOfPoints;t.colors=[],t.countries=[],t.mappixels=new Array(n).fill().map((function(e){return new Array(n).fill(0)})),t.nextpixels=new Array(n).fill().map((function(e){return new Array(n).fill(0)}));for(var a=0;a<r;a++){var i=t.p5.round(t.p5.random(1,n-1)),o=t.p5.round(t.p5.random(1,n-1));t.mappixels[i][o]=a,t.countries.push({index:a,neighbors:new Set}),t.colors.push([t.p5.round(t.p5.random(0,254)),t.p5.round(t.p5.random(0,254)),t.p5.round(t.p5.random(0,254))])}t.currentGeneration=[],t.selectedCountry=null,t.topscore=0,t.setState((function(){return{currentGeneration:0,draw:"1",mapRunning:!0,evoRunning:!1,canRunEvo:!1}}))},t.generateMapStep=function(){var e=t.state,n=e.size;if(e.evoRunning)throw new Error("couldnt generate map during evo phase");for(var r=0;r<n;r++)for(var a=function(e){var n=t.mappixels[r][e],a=[];r>0&&a.push(t.mappixels[r-1][e]),r<t.size-1&&a.push(t.mappixels[r+1][e]),e>0&&a.push(t.mappixels[r][e-1]),e<t.size-1&&a.push(t.mappixels[r][e+1]),r>0&&e>0&&a.push(t.mappixels[r-1][e-1]),r>0&&e<t.size-1&&a.push(t.mappixels[r-1][e+1]),r<t.size-1&&e>0&&a.push(t.mappixels[r+1][e-1]),r<t.size-1&&e<t.size-1&&a.push(t.mappixels[r+1][e+1]);for(var i=new Map,o=0,s=a;o<s.length;o++){var u=s[o];i.has(u)?i.set(u,i.get(u)+1):i.set(u,1)}var l=0,p=0;i.forEach((function(e,n){l<e&&0!==n&&(l=e,p=n)})),0===n&&Math.abs(Math.random())<.4&&(n=p),t.nextpixels[r][e]=n},i=0;i<n;i++)a(i);var o=[t.mappixels,t.nextpixels];t.nextpixels=o[0],t.mappixels=o[1],t.sparseLog()===t.size*t.size&&(t.setState((function(){return{mapRunning:!1,canRunEvo:!0}})),t.calcNeigbours(),t.makeFirstGeneration())},t.sparseLog=function(e){void 0===e&&(e=t.mappixels);for(var n=new Map,r=0,a=0;a<t.size;a++)for(var i=0;i<t.size;i++){var o=e[a][i];0!==o&&r++,n.has(o)?n.set(o,n.get(o)+1):n.set(o,1)}return r},t.getCountryOpacity=function(e){return t.selectedCountry?t.selectedCountry===e?255:t.countries[t.selectedCountry].neighbors.has(e)?150:50:255},t.mouseMoved=function(e){var n=e.mouseX,r=e.mouseY;if(n=e.round(n),r=e.round(r),n>=0&&n<t.size&&r>=0&&r<t.size){var a=t.mappixels[n][r];t.selectedCountry!==a&&0!==a&&(t.selectedCountry=a)}},t.draw=function(e){var n=t.state,r=n.mapRunning,a=n.evoRunning;r&&t.generateMapStep(),a&&t.makeSecondGeneration(),t.p5.background(0),t.p5.loadPixels();for(var i=t.state.size,o=0;o<i;o++)for(var s=0;s<i;s++){var u=4*(o+s*i),l=t.mappixels[o][s],p=void 0;if("1"===t.state.draw)p=t.colors[l];else{var c=t.currentGeneration[0].dna;p=t.scolors[c[l]]}var m=!1;o>0&&t.mappixels[o-1][s]!==l?m=!0:s>0&&t.mappixels[o][s-1]!==l?m=!0:o<i-1&&t.mappixels[o+1][s]!==l?m=!0:s<i-1&&t.mappixels[o][s+1]!==l&&(m=!0),t.p5.pixels[u]=m?0:p[0],t.p5.pixels[u+1]=m?0:p[1],t.p5.pixels[u+2]=m?0:p[2],"1"===t.state.draw?t.p5.pixels[u+3]=t.getCountryOpacity(l):t.p5.pixels[u+3]=255}t.p5.updatePixels(),t.p5.stroke(255)},t.calcFitness=function(e){for(var n=0,r=0;r<t.countries.length;r++){var a=t.countries[r],i=!0,o=!1,s=void 0;try{for(var u,l=a.neighbors[Symbol.iterator]();!(i=(u=l.next()).done);i=!0){var p=u.value;e[p]===e[a.index]&&a.index!==p&&(n+=a.neighbors.size)}}catch(c){o=!0,s=c}finally{try{i||null==l.return||l.return()}finally{if(o)throw s}}}return n},t.mutate=function(e){for(var n=t.state.mutationFactor,r=Object(s.a)(e),a=0;a<t.p5.random(0,t.p5.round(t.numOfPoints/n));a++)r[t.p5.round(t.p5.random(0,e.length-1))]=t.p5.round(t.p5.random(0,3));return r},t.makeFirstGeneration=function(){t.currentGeneration=new Array(t.numOfSamples).fill().map((function(e){var n=new Array(t.countries.length).fill(0).map((function(){return t.p5.round(t.p5.random(0,3))}));return{dna:n,fitness:t.calcFitness(n)}})),t.currentGeneration.sort((function(e,n){return e.fitness-n.fitness})),t.setState((function(){return{currentGeneration:0}}))},t.resetGeneticAlgorithm=function(){t.makeFirstGeneration(),t.makeSecondGeneration()},t.makeSecondGeneration=function(){if(t.state.mapRunning)throw new Error("coudnt run evo while map havent finished generating");t.setState((function(){return{evoRunning:!0}}));var e=t.currentGeneration;t.currentGeneration=[];for(var n=0;n<20;n++)t.currentGeneration.push(e[n]);for(var r=20;r<t.numOfSamples-100;r++){var a=t.mutate(e[Math.floor(r%20)].dna);t.currentGeneration.push({dna:a,fitness:t.calcFitness(a)})}for(var i=0;i<100;i++){var o=new Array(t.countries.length).fill(0).map((function(){return t.p5.round(t.p5.random(0,3))}));t.currentGeneration.push({dna:o,fitness:t.calcFitness(o)})}var s=1e4,u=!0,l=!1,p=void 0;try{for(var c,m=t.currentGeneration[Symbol.iterator]();!(u=(c=m.next()).done);u=!0){var f=c.value;s=Math.min(s,f.fitness)}}catch(h){l=!0,p=h}finally{try{u||null==m.return||m.return()}finally{if(l)throw p}}t.currentGeneration.sort((function(e,n){return e.fitness-n.fitness})),0===s?t.setState((function(e){return{topscore:s,evoRunning:!1,currentGeneration:e.currentGeneration+1}})):t.setState((function(e){return{topscore:s,evoRunning:!0,currentGeneration:e.currentGeneration+1}}))},t.createTableCells=function(e){var n=[],t=0;n.push(a.a.createElement("td",{key:0},a.a.createElement("b",null,e.fitness)));var r=!0,i=!1,o=void 0;try{for(var s,u=e.dna[Symbol.iterator]();!(r=(s=u.next()).done);r=!0){var l=s.value;n.push(a.a.createElement("td",{key:t+1},l)),t++}}catch(p){i=!0,o=p}finally{try{r||null==u.return||u.return()}finally{if(i)throw o}}return n},t.createTableRows=function(){return t.currentGeneration.map((function(e,n){return a.a.createElement("tr",{key:n},t.createTableCells(e))}))},t.handleNumberOfCountriesChange=function(e){e.persist(),t.setState((function(){return{numOfPoints:Number(e.target.value)||100,strNumOfPoints:e.target.value}}))},t.handlePopulationSizeChange=function(e){e.persist(),t.setState((function(){return{numOfSamples:Number(e.target.value)||100,strNumOfSamples:e.target.value}}))},t.handleMutationChanceChange=function(e){e.persist(),t.setState((function(){return{mutationFactor:Number(e.target.value)||10,strMutationFactor:e.target.value}}))},t.size=500,t.numOfPoints=100,t.numOfSamples=500,t.mappixels=new Array(t.size).fill().map((function(e){return new Array(t.size).fill(0)})),t.nextpixels=new Array(t.size).fill().map((function(e){return new Array(t.size).fill(0)})),t.selectedCountry=null,t.countries=[],t.currentGeneration=[],t.colors=[],t.scolors=[[255,0,255],[255,0,0],[0,255,0],[0,0,255]],t.state={draw:"1",evoRunning:!1,mapRunning:!0,size:500,numOfPoints:50,strNumOfPoints:"50",numOfSamples:5e3,strNumOfSamples:"5000",mutationFactor:10,strMutationFactor:"10",currentGeneration:0,topscore:0,canRunEvo:!1},t}return Object(m.a)(n,e),Object(l.a)(n,[{key:"calcNeigbours",value:function(){for(var e=0;e<this.size;e++)for(var n=0;n<this.size;n++){var t=this.mappixels[e][n],r=this.countries[t].neighbors;e>0&&this.mappixels[e-1][n]!==t&&r.add(this.mappixels[e-1][n]),e<this.size-1&&this.mappixels[e+1][n]!==t&&r.add(this.mappixels[e+1][n]),n>0&&this.mappixels[e][n-1]!==t&&r.add(this.mappixels[e][n-1]),n<this.size-1&&this.mappixels!==t&&r.add(this.mappixels[e][n+1])}}},{key:"render",value:function(){var e=this,n=this.state,t=n.evoRunning,r=n.mapRunning,i=n.canRunEvo,o=n.currentGeneration,s=n.strNumOfSamples,u=n.strNumOfPoints,l=n.strMutationFactor,p=n.mutationFactor,c=n.numOfPoints,m=n.numOfSamples;return a.a.createElement(a.a.Fragment,null,a.a.createElement("h1",null,"\u0420\u0430\u0441\u043a\u0440\u0430\u0441\u043a\u0430 \u043a\u0430\u0440\u0442\u044b"),a.a.createElement("p",null,a.a.createElement("label",null,"Number of countries: "),a.a.createElement("input",{type:"text",name:"size",value:u,onChange:this.handleNumberOfCountriesChange})),a.a.createElement("p",null,a.a.createElement("label",null,"Population size: "),a.a.createElement("input",{type:"text",name:"size",value:s,onChange:this.handlePopulationSizeChange})),a.a.createElement("p",null,a.a.createElement("label",null,"Mutation factor: "),a.a.createElement("input",{type:"text",name:"size",value:l,onChange:this.handleMutationChanceChange})),a.a.createElement("p",null,"Current gen: ",o),a.a.createElement("p",null,"Top score: ",this.state.topscore),a.a.createElement("p",null,"Number of countries: ",c),a.a.createElement("p",null,"Population size: ",m),a.a.createElement("p",null,"Mutation factor: ",p),a.a.createElement("p",null,a.a.createElement("button",{disabled:r||t,onClick:this.startGeneratingMap},"Create new map"),a.a.createElement("button",{disabled:r||t||!i,onClick:this.resetGeneticAlgorithm},"Run evo"),a.a.createElement("button",{onClick:function(){e.setState((function(){return{evoRunning:!1,mapRunning:!1}}))}},"Stop"),a.a.createElement("select",{disabled:r||t,onChange:function(n){n.persist(),e.setState((function(){return{draw:n.target.value}}))}},a.a.createElement("option",{value:"1"},"\u0421\u0442\u0440\u0430\u043d\u044b"),r?null:a.a.createElement("option",{value:"2"},"\u0420\u0430\u0441\u043a\u0440\u0430\u0441\u043a\u0430"))),a.a.createElement(h.a,{setup:this.setup,draw:this.draw,mouseMoved:this.mouseMoved}),null)}}]),n}(r.Component);Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));o.a.render(a.a.createElement(d,null),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()}))}},[[10,1,2]]]);
//# sourceMappingURL=main.ced43540.chunk.js.map