// this is just kinda like a black box implementation of the little cat that 
// follows your cursor around. i say 'black box' because it's a cool thing to say
// but i'm really just re-making the same thing without looking at the code to
// see what i learn from doing so :3

console.log("bweh");

// store the current cursor position
let cursorX = -1;
let cursorY = -1;
// and critter position
let critterX = -1;
let critterY = -1;


// lazy kitty function thank you MDN
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

// pythagoras :fire:
function dist(x1, y1, x2, y2) {
  let x = x1 - x2;
  let y = y1 - y2;
  return Math.sqrt((x*x) + (y*y));
}

// CREATE the thing
function genCritter() {
  const critter = document.createElement("div");
  // STEALED idea from the original one... just pick a random starting position
  // bounded to generate within the center 80% of the width/height
  // also it's all stealed ideas :P
  critterX = getRandomInt(0.1*window.innerWidth, 0.9*window.innerWidth);
  critterY = getRandomInt(0.1*window.innerHeight, 0.9*window.innerHeight);

  // a little guy
  critter.style.width = "32px";
  critter.style.height = "32px";

  critter.style.position = "absolute";

  critter.style.left = `${critterX}px`;
  critter.style.top = `${critterY}px`;

  // maybe use this? it means that the object's center will be at the coordinates,
  // rather than the top left idk idk idk bweh i'll think later
  critter.style.transform = "translate(-50%, -50%)";

  // my critter!!!!!!!!!!
  //critter.style.backgroundImage = "url(./shaymin.png)";
  critter.style.backgroundColor = "white";
  critter.style.backgroundSize = "contain";

  // no click
  critter.style.pointerEvents = "none";

  // insert at the top of the body
  document.body.insertAdjacentElement("afterbegin", critter);

  return critter;
}

// the critter has gone GLOBAL 🌎🌎🌎🌎🌎 url("mr_worldwide.jpeg")
// this just holds a handle to the div
const critter = genCritter();

// set some sort of flag when the cursor moves and the kitten is sleeping, and
// use the time since to then unset the flag and start moving. it's mentally
// coming together :fire:

// update these values when the cursor moves
addEventListener("mousemove", (event) => {
  cursorX = event.clientX;
  cursorY = event.clientY;
  //console.log(cursorX, cursorY);
})

// store a handle to the setInterval process(? is that the right word)
let handle;

// start the thing running
function play() {
  console.log("it BEGINS.");

  // handle now refers to this specific thing
  handle = setInterval(() => {
    // cursor has yet to be moved, or critter already close to the cursor 
    if (cursorX == -1 || dist(cursorX,cursorY, critterX,critterY) < 64) {
      console.log("resting...");
    }
    // critter needs to run to the cursor
    else {
      critter.style.left = `${cursorX}px`;
      critter.style.top =  `${cursorY}px`;
      critterX = cursorX;
      critterY = cursorY;
      console.log("running!!");
      console.log(critter.style.left, critter.style.top);
    } 
  }, 100); // testing, code runs 10x/sec (is this too high? too low?)

}

// stop the thing from running
function pause() {
  clearInterval(handle);
  console.log("you have PAUSED the critter.");
}

// i lowkey stole the example from mdn for this thank you mozilla <3
// https://developer.mozilla.org/en-US/docs/Web/API/Page_Visibility_API
document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    // pause doing stuff
    pause();
  } else {
    // resume doing stuff, page focused
    play();
  }
});

// start the program
play();
