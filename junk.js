console.log("i'm going bananas");

// TODO: read this: https://web.dev/articles/canvas-performance
// also this maybe? https://medium.com/@ryan_forrester_/how-to-get-mouse-position-in-javascript-37e4772a3f21

// Constant junk
const coordinatesEl = document.getElementById('coordinates');
const canvasEl = document.getElementById('canvas');
const ctx = canvasEl.getContext("2d");


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

function arrowToCursor() {
  const startX = 354;
  const startY = 492;
  // doing things this way would require putting a canvas in the back like
  // with the stars page, i don't really want the end solution to be dependent
  // on a canvas since that would just be a weird solution.

}

function drawCircle(x, y) {

}

function setCoords(event) {
  const mouseX = event.clientX;
  const mouseY = event.clientY;
  coordinatesEl.textContent = `youre mouse is at... x: ${mouseX}, y: ${mouseY}`;

  // "uuugh"
  canvasEl.width = mouseX;
  canvasEl.width = window.innerWidth;
  canvasEl.height = mouseY;
  canvasEl.height = window.innerHeight;

  //// it's kind of heinous how slow this is. you can say "it's unoptimized" but
  //// i'm drawing three fucking rectangles do you know how fast modern cpus are
  ////bottom right
  //ctx.fillStyle = "rgba(13, 117, 255, 0.5)";
  //ctx.fillRect(mouseX, mouseY, window.innerWidth-mouseX, window.innerHeight-mouseY);
  //// top left
  //ctx.fillStyle = "rgba(128, 200, 255, 0.5)";
  //ctx.fillRect(0, 0, mouseX, mouseY);
  ////top right
  //ctx.fillStyle = "rgba(180, 200, 255, 0.5)";
  //ctx.fillRect(mouseX, 0, window.innerWidth-mouseX, mouseY);


}
document.addEventListener('mousemove', setCoords);
