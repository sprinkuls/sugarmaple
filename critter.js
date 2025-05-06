// this is just kinda like a black box implementation of the little cat that 
// follows your cursor around. i say 'black box' because it's a cool thing to say
// but i'm really just re-making the same thing without looking at the code to
// see what i learn from doing so :3
console.log("bweh");

// so like
// 1. set up our element with styling and initial position
// 2. everything else


// lazy kitty function thank you MDN
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

// CREATE the thing
function genCritter() {
  const critter = document.createElement("div");
  // STEALED idea from the original one... just pick a random starting position
  // bounded to generate within the center 80% of the width/height
  // also it's all stealed ideas :P
  const initX = getRandomInt(0.1*window.innerWidth, 0.9*window.innerWidth);
  const initY = getRandomInt(0.1*window.innerHeight, 0.9*window.innerHeight);

  // a little guy
  critter.style.width = "32px";
  critter.style.height = "32px";

  critter.style.position = "absolute";

  critter.style.left = `${initX}px`;
  critter.style.top = `${initY}px`;

  // maybe use this? it means that the object's center will be at the coordinates,
  // rather than the top left idk idk idk bweh i'll think later
  critter.style.transform = "translate(-50%, -50%)";

  // my critter!!!!!!!!!!
  critter.style.backgroundImage = "url(./shaymin.png)";
  critter.style.backgroundSize = "contain";

  // no click
  critter.style.pointerEvents = "none";

  // insert at the top of the body
  document.body.insertAdjacentElement("afterbegin", critter);

  return critter;
}

// the critter has gone GLOBAL 🌎🌎🌎🌎🌎 url("mr_worldwide.jpeg")
//const critter = genCritter();

const button = document.getElementById("button");
button.onclick = genCritter;

// so this is all the like initialization stuff done. we set the thing at a random
// point anbd from here is when we need to start checking for mouse movements and junk
// it needs to be *SOMETHING* based on checking for mouse move


// should probably have the logic packed into a 'run toward cursor' function
// or maybe a 'check cursor' function, which we then run every N ms 
