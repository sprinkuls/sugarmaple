/* idea i'm putting here: do something with js to draw a background made of
*  randomly positioned white circles on black bg, so it looks like stars :3
*/

class RGBA {
  constructor(red, green, blue, alpha) {
    this.r = red;
    this.g = green;
    this.b = blue;
    this.a = alpha;
  }
  toStr() {
    return `rgba(${this.r}, ${this.g}, ${this.b}, ${this.a})`
  }
}

function random(min, max) {
  const minCeiled = Math.ceil(min);
  const maxFloored = Math.floor(max);
  // The maximum is inclusive and the minimum is inclusive
  return Math.floor(Math.random() * (maxFloored - minCeiled + 1) + minCeiled); 
}

// Constants
const mainColor = "#0F0"
const body = document.body;
const html = document.querySelector("html");
const canvas = document.createElement("canvas");

// On the terrible quest to not use CSS
body.style.width = "100%";
body.style.height = "100%";
body.style.margin = "0";

html.style.width = "100%";
html.style.height = "100%";
html.style.margin = "0";

body.style.color = mainColor;
body.style.backgroundColor = "black";

body.style.fontFamily = "Consolas, monospace";
body.style.fontSize = "20px";

// Do things with the canvas
body.insertAdjacentElement("afterbegin", canvas);
canvas.style.position = "fixed";

canvas.style.boxSizing = "border-box";
canvas.style.boxShadow = `inset 0 0 2.5em ${mainColor}`;
canvas.style.zIndex = "-1"; // So the text stays above the background

// Style the text in the doc (this would probably be nicer to do with CSS)
let tc = document.getElementById("textcontainer");
tc.style.padding = "2.5rem";
tc.style.textAlign = "center";
tc.style.fontSize = "larger";
let text = document.getElementById("text");
text.style.backgroundColor = "black";




function draw() {
  const ctx = canvas.getContext('2d');
  const width = window.innerWidth;
  const height = window.innerHeight;
  ctx.canvas.width = width;
  ctx.canvas.height = height;


  let c1 = new RGBA(255, 255, 255, 0.7);
  let c2 = new RGBA(128, 128, 128, 0.5);
  let c3 = new RGBA(0, 0, 0, 0);
  //drawOrb(ctx, c1, c2, c3, width/2, height/2, 10, false);
  // do it randomly
  let TMP = 20;
  for (i = 0; i < 300; i++) {
    let x = random(0, width);
    let y = random(0, height);
    let rad = random(1, 10);
      drawOrb(ctx, c1, c2, c3, x, y, rad, false);
  }
  let oc1 = new RGBA(0, 255, 0,  1);
  let oc2 = new RGBA(0, 128, 0,  1);
  let oc3 = new RGBA(0, 10,  0, 0);
  drawOrb(ctx, oc1, oc2, oc3, width/2, height/2, 100, false);

  // so i think what i need to do is make a gradient style with createRadialGradient()
  // and then use that fill style on an ellipse
  // then i'll have a circle!
}

// A function to draw the orb.
// i fucking hate javascript holy shit just let me use types you dolt
// like it's insane how much of a pain it is to do this kind of shit
// it makes me want to just use typescript
// ctx: drawing context
// c1 : RGBA color 1
// c2 : RGBA color 2
// c3 : RGBA color 3
// x  : center of circle, x axis
// y  : center of circle, y ayis
// radius: radius of the circle
function drawOrb(ctx, c1, c2, c3, x, y, radius, mach) {
  //const rg = ctx.createRadialGradient(x-(radius/5), y-(radius/5), radius/3,
  const rg = ctx.createRadialGradient(x, y, 0,
                                      x, y, radius);
  rg.addColorStop(0.0, c1.toStr());
  // Interpolate the values to correct for Mach bands (only need to do this if
  // there are big differences in luminance)
  if (mach) {
    let diff = new RGBA((c1.r-c2.r), (c1.g-c2.g), (c1.b-c2.b), (c1.a-c2.a));
    let diffc1 = new RGBA(c1.r-(diff.r / 10), c1.g-(diff.g/10), c1.b-(diff.b/10), c1.a-(diff.a/10));
    let diffc2 = new RGBA(c2.r+(diff.r / 10), c2.g+(diff.g/10), c2.b+(diff.b/10), c2.a+(diff.a/10));
    rg.addColorStop(0.1, diffc1.toStr());
    rg.addColorStop(0.3, diffc2.toStr());
  }
  rg.addColorStop(0.4, c2.toStr());
  if (mach) {

  }
  rg.addColorStop(1.0, c3.toStr());
  ctx.fillStyle = rg;

  // draw my ORB
  ctx.beginPath();
  ctx.ellipse(x, y, radius, radius, 0, 0, 2*Math.PI);
  ctx.fill();
}

function drawCircle(ctx) {
  // draw a CIRCLE
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  const radius = 70;

  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
  ctx.fillStyle = '#0F0';
  ctx.fill();
  ctx.lineWidth = 5;
  ctx.strokeStyle = '#003300';
  ctx.stroke();

}

// Run the function once, and re-run it on resize
draw(); window.addEventListener('resize', draw);

// I hate this because I'm not allowed to call it a struct it is a CLASS
// also I HATE WEAK TYPING LET ME JUST CALL SOMETHING A FUCKING NUMBER OR 
// ANYTHING THAT ISN'T JUST A VARIABLE NAME UUUUUUGH
// ok so rgb is 0-255
// and A is 0.1
// that's fine it's all fine it's fine
// oh, also, no overloading class constructors. why? what is wrong with you?

// uuuuugh
let whatever = new RGBA(0, 255, 0, 1);
console.log(whatever.g);
whatever.r = whatever.g / 2 ;
console.log(whatever.r);
console.log(whatever.toStr());
