console.log("i'm going bananas");

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


function drawCircle(x, y) {

}

const coordinatesEl = document.getElementById('coordinates');
function setCoords(event) {
  const x = event.clientX;
  const y = event.clientY;
  coordinatesEl.textContent = `youre mouse is at... x: ${x}, y: ${y}`;
}
document.addEventListener('mousemove', setCoords);
