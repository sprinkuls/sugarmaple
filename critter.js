// but i'm really just re-making the same thing without looking at the code to
// see what i learn from doing so :3
// this is a pretty naive implementation, because the person implementing it
// is pretty naive

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
  // bounded to generate within the center 80% of the width/height
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
  critter.style.backgroundImage = "url(./shaymin.png)";
  critter.style.backgroundImage = "url(./spritesheet.png)";
  //critter.style.backgroundColor = "white";
  //critter.style.backgroundSize = "contain";

  // no click
  critter.style.pointerEvents = "none";
  critter.id = "critter";

  // insert at the top of the body
  document.body.insertAdjacentElement("afterbegin", critter);

  return critter;
}

// this just holds a handle to the div
const critter = genCritter();

// set some sort of flag when the cursor moves and the kitten is sleeping, and
// use the time since to then unset the flag and start moving. it's mentally
// coming together :fire:

// update cursor position values when the cursor moves
addEventListener("mousemove", (event) => {
  cursorX = event.clientX;
  cursorY = event.clientY;
})

// store a handle to setInterval process(? is that the right word)
let handle;

const closeness = 50; // how close (in px) to get to the cursor before stopping
const updateTime = 100; // # of ms between each run of interval
const speed = 180; // # of px to move each second
const N = speed * (updateTime/1000); // given above updateTime and speed, calculate
                                     // how fast the critter should move each interval

// stuff for keeping track of overall state of things
let timeInPhase = 0; // track how long we've been in a phase for
let lastPhase = "rest"; // indicate when we switch from running to rest, vice versa

// stuff for when running
let runTimer = 0;
let runSprite = true; // ok really jank way to just say sprite 1 (true) or sprite 2 (false)

// stuff for when resting
let restState; // yawn scratch sleep
let scratchTimer = 0;
let scratchLength; // how long to scratch for before going to sleep
let yawnTimer = 0; // maybe combine this with scratchtimer?


// start the thing running
function play() {
  console.log("it BEGINS.");

  // handle now refers to this specific thing
  handle = setInterval(() => {
    // critter already close to the cursor, or cursor has yet to be moved
    if ((dist(cursorX,cursorY, critterX,critterY) < closeness) || (cursorX == -1)) {
      console.log("resting..");
      // check if we just switched over to this phase
      if (lastPhase == "run") {
        lastPhase = "rest";
        restState = "sit";
        timeInPhase = 0;
      }

      // part 1: cat sits
      if (timeInPhase < 400) {
        // sit sprite
        critter.style.backgroundPositionX = "-256px";
        critter.style.backgroundPositionY = "0px";

        // coin flip to see if the cat scratches
        if (Math.random() < 0.5) {
          restState = "scratch";
        } else {
          restState = "yawn";
        }
      // part 2: scratch
      } 
      else {
        if (restState == "scratch") {
          if (scratchTimer <= 500) {
            // do scratch animation stuff
            scratchTimer += updateTime;
            critter.style.backgroundPositionX = "-352px";
            critter.style.backgroundPositionY = "0px";
          }
          else {
            // end scratching, yawn
            restState = "yawn";
            scratchTimer = 0;
          }
        } 
        if (restState == "yawn") {
          if (yawnTimer <= 500) {
            // do yawn
            yawnTimer += updateTime;
            critter.style.backgroundPositionX = "-256px";
            critter.style.backgroundPositionY = "-32px";
          } else {
            // end yawning, sleep
            restState = "sleep";
            yawnTimer = 0;
          }
        }
        if (restState == "sleep") {
          critter.style.backgroundPositionX = "-288px";
          critter.style.backgroundPositionY = "-32px";
          // random chance to wake up and scratch again
          if (Math.random() < 0.001) {
            restState = "scratch";
          }
        }
      }


      /*else if (restState == "scratch") {
          if (runTimer)
          // zzz
          critter.style.backgroundPositionX = "-320px";
          critter.style.backgroundPositionY = "-32px";
        

      }*/
      // sleep
      // doing the little scratch animation
    }
    // critter needs to run to the cursor
    else {
      console.log("running!!");
      // check if we just switched over to this phase
      if (lastPhase == "rest") {
        lastPhase = "run";
        timeInPhase = 0;
        runTimer = 0;
      }

      // that little brief 'alert' moment
      if (timeInPhase < 300) {
        critter.style.backgroundPositionX = "-320px";
        critter.style.backgroundPositionY = "0px";

      // we're already in motion
      } else {
        let theta = Math.atan2(cursorY - critterY,cursorX - critterX);
        // yeah, i took trig.
        let y = N * Math.sin(theta);
        let x = N * Math.cos(theta);
        critterX += x;
        critterY += y;
        // you could do this without putting it in degrees but i'm a little
        // stupid so i want to think in degrees
        theta = theta * 180/Math.PI;
        if (theta < 0)
          theta += 360;

        // is this even faster than just a big if else chain idk
        theta = (theta/45) - 0.5;
        theta = Math.ceil(theta);
        if (theta == 8)
          theta = 0;
        // get X position for background
        critter.style.backgroundPositionX = `${theta * 32 * -1}px`;


        // switch between running sprite 1 / 2 every 200 ms
        if (runTimer == 200) {
          runSprite = !runSprite;
          runTimer = 0;
        }

        // "scuffed"
        critter.style.backgroundPositionY = `${-1 * (runSprite * 32)}px`

        // ^ does the same thing as this block below
        /*
        if (runSprite) {
          critter.style.backgroundPositionY = "0px";
        } else {
          critter.style.backgroundPositionY = "-32px";
        }
        */
        runTimer += updateTime;


        critter.style.left = `${critterX}px`;
        critter.style.top =  `${critterY}px`;
      }
    } 
    // increment the time in phase by the amount each interval runs for
    timeInPhase += updateTime;
  }, updateTime);

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
