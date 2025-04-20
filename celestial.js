// the code for these calculations was taken from the NOAA solar calculations
// spreadsheets (https://gml.noaa.gov/grad/solcalc/calcdetails.html). the NOAA
// website itself credits them to the book 'Astronomical Algorithms' by Jean Meeus.
console.log("<|:3c");

// convenient definitions in UNIX millis
const HOUR = 3600000;
const DAY = 86400000;

const RAD = Math.PI/180;
const DEG = 180/Math.PI;

// i was originally using ip-api.com for this, but you have to pay for an API
// key if you want to make requests over HTTPS. neocities' csp means you *have*
// to make requests over HTTPS, so even though the throughput on this one (10k calls/month)
// is way worse than the 45/min of ip-api, the HTTPS requirement really means that it's 10k/month VS 0/ever
//
// also, i know i could use the inbuilt browser functionality for this, but really
// what is a greater bother than seeing the 'pleaseeee let this random site use your location'
// popup when you're browsing? so i'm fine with this as a more low key way of doing things
// maybe what i do is just put a little button that says "give me your location
// so these get calculated with your latitude/longitude" so u entirely opt in
// to seeing that stupid popup

// disabled for now cause like it's fine
async function getLatLon() {
//  let response, json;
//  // if something goes wrong, just use GNV's lat/long rather than throwing a fit
//  try {
//    response = await fetch('https://ipwho.is/');
//    json = await response.json();
//  } catch {
//    return ([29.6516344, -82.3248262])
//  }
//
//  // if i run out of calls or something, also fall back to GNV's lat/long
//  if (isNaN(parseFloat(json.latitude)))
//    return ([29.6516344, -82.3248262])
//
//  // yippieeeee things worked
//  return([json.latitude, json.longitude]);
  return ([29.6516344, -82.3248262])
}

// get the julian day, offset a certain number of days from the current day
// i could probably change this to just take a UNIX stamp instead, but like it's fiiiiine
function getJulianDay(offset=0) {
  return 2440587.5 + ((Date.now()+(offset*DAY)) / (DAY));
}

// get the UNIX ts from a JDE
function getUNIX(JDE) {
  return (JDE - 2440587.5) * DAY;
}

function getJulianCentury(offset=0) {
  let julianDay = getJulianDay(offset);
  return ((julianDay - 2451545) / 36525);
}

function getRiseSet(lat, long) {
  // convenience
  let sin = Math.sin;
  let cos = Math.cos;
  let tan = Math.tan;

  let asin = Math.asin;
  let acos = Math.acos;

  let JC = getJulianCentury();
  //console.log("julianCentury", JC);

  let geomMeanLongSun = (280.46646+JC*(36000.76983+JC*0.0003032)) % 360;
  //console.log("geomMeanLongSun", geomMeanLongSun);

  let geomMeanAnomSun = 357.52911+JC*(35999.05029-0.0001537*JC);
  //console.log("geomMeanAnomSun", geomMeanAnomSun);

  let eccentEarthOrbit = 0.016708634-JC*(0.000042037+0.0000001267*JC);
  //console.log("eccentEarthOrbit", eccentEarthOrbit);

  let sunEqOfCtr = sin(RAD*geomMeanAnomSun)*(1.914602-JC*(0.004817+0.000014*JC))+sin(RAD*2*geomMeanAnomSun)*(0.019993-0.000101*JC)+sin(RAD*3*geomMeanAnomSun)*0.000289;
  //console.log("sunEqOfCtr", sunEqOfCtr);

  let sunTrueLong = geomMeanLongSun+sunEqOfCtr;
  //console.log("sunTrueLong", sunTrueLong);

  let sunAppLong = sunTrueLong-0.00569-0.00478*sin(RAD*(125.04-1934.136*JC));
  //console.log("sunAppLong", sunAppLong);

  let meanObliqEcliptic = 23+(26+((21.448-JC*(46.815+JC*(0.00059-JC*0.001813))))/60)/60;
  //console.log("meanObliqEcliptic", meanObliqEcliptic);

  let obliqCorr = meanObliqEcliptic+0.00256*cos(RAD*125.04-1934.136*JC);
  //console.log("obliqCorr", obliqCorr);

  let sunDeclin = DEG*(asin(sin(RAD*obliqCorr)*sin(RAD*sunAppLong)));
  //console.log("sunDeclin", sunDeclin);

  let HAsunrise = DEG*(acos(cos(RAD*90.833)/(cos(RAD*lat)*cos(RAD*(sunDeclin)))-tan(RAD*(lat))*tan(RAD*(sunDeclin))));
  console.log("HAsunrise", HAsunrise);

  let varY = tan(RAD*(obliqCorr/2))*tan(RAD*(obliqCorr/2));
  //console.log("varY", varY);

  // insane equation
  let eqOfTime = 4*DEG*(varY*sin(2*RAD*(geomMeanLongSun))-2*eccentEarthOrbit*sin(RAD*(geomMeanAnomSun))+
                 4*eccentEarthOrbit*varY*sin(RAD*(geomMeanAnomSun))*cos(2*RAD*(geomMeanLongSun))-0.5*
                 varY*varY*sin(4*RAD*(geomMeanLongSun))-1.25*eccentEarthOrbit*eccentEarthOrbit*sin(2*RAD*(geomMeanAnomSun)));
  //console.log("eqOfTime", eqOfTime);

  // divide by 60 since offset is given in minutes
  // multiply by -1 because this gives GMT - ${your time zone}
  let tzOffset = -(new Date()).getTimezoneOffset() / 60;
  //console.log("tzOffset", tzOffset);

  let solarNoon = (720-4*long-eqOfTime+tzOffset*60)/1440;
  console.log("solarNoon", solarNoon);
  // this is basically the % progression through the day; a value of 0.5
  // means that solar noon is exactly at normal noon (12:00)
  // # of mins = 60 * 24
  // # of mins through the day
  let mins = solarNoon * (60 * 24);
  let hrs = Math.floor(mins/60);
  mins = Math.floor(mins % 60);
  //console.log("solar noon", hrs, mins);

  // how much the sunrise/sunset are offset from solar noon
  let solarOffset = HAsunrise*4/1440;
  let rise = solarNoon - solarOffset;
  let set = solarNoon + solarOffset;

  let today = new Date();
  //console.log("now: ", today.toString());
  today.setHours(0,0,0,0);

  let zzz = DAY * rise;
  let yyy = DAY * solarNoon;
  let xxx = DAY * set;

  let riseTime = (today.valueOf() + zzz);
  let noonTime = (today.valueOf() + yyy);
  let setTime = (today.valueOf() + xxx);

  return [riseTime, noonTime, setTime];
}

// essentially the same code as in getRiseSet(), as sunrise/sunset
// happens when the sun is in line with the horizon (90 degrees)
// and twilight when it's below it (108 degrees)
function getTwilight(lat, long) {
  // convenience
  let sin = Math.sin;
  let cos = Math.cos;
  let tan = Math.tan;

  let asin = Math.asin;
  let acos = Math.acos;

  let JC = getJulianCentury();
  //console.log("julianCentury", JC);

  let geomMeanLongSun = (280.46646+JC*(36000.76983+JC*0.0003032)) % 360;
  //console.log("geomMeanLongSun", geomMeanLongSun);

  let geomMeanAnomSun = 357.52911+JC*(35999.05029-0.0001537*JC);
  //console.log("geomMeanAnomSun", geomMeanAnomSun);

  let eccentEarthOrbit = 0.016708634-JC*(0.000042037+0.0000001267*JC);
  //console.log("eccentEarthOrbit", eccentEarthOrbit);

  let sunEqOfCtr = sin(RAD*geomMeanAnomSun)*(1.914602-JC*(0.004817+0.000014*JC))+sin(RAD*2*geomMeanAnomSun)*(0.019993-0.000101*JC)+sin(RAD*3*geomMeanAnomSun)*0.000289;
  //console.log("sunEqOfCtr", sunEqOfCtr);

  let sunTrueLong = geomMeanLongSun+sunEqOfCtr;
  //console.log("sunTrueLong", sunTrueLong);

  let sunAppLong = sunTrueLong-0.00569-0.00478*sin(RAD*(125.04-1934.136*JC));
  //console.log("sunAppLong", sunAppLong);

  let meanObliqEcliptic = 23+(26+((21.448-JC*(46.815+JC*(0.00059-JC*0.001813))))/60)/60;
  //console.log("meanObliqEcliptic", meanObliqEcliptic);

  let obliqCorr = meanObliqEcliptic+0.00256*cos(RAD*125.04-1934.136*JC);
  //console.log("obliqCorr", obliqCorr);

////////////////////////////////////////////////////////////////////////////////////////////////////
  let sunDeclin = DEG*(asin(sin(RAD*obliqCorr)*sin(RAD*sunAppLong)));
  //console.log("sunDeclin", sunDeclin);

  let HAsunrise = DEG*(acos(cos(RAD*90.833)/(cos(RAD*lat)*cos(RAD*(sunDeclin)))-tan(RAD*(lat))*tan(RAD*(sunDeclin))));
  console.log("HAsunrise", HAsunrise);

  let varY = tan(RAD*(obliqCorr/2))*tan(RAD*(obliqCorr/2));
  //console.log("varY", varY);

  // insane equation
  let eqOfTime = 4*DEG*(varY*sin(2*RAD*(geomMeanLongSun))-2*eccentEarthOrbit*sin(RAD*(geomMeanAnomSun))+
                 4*eccentEarthOrbit*varY*sin(RAD*(geomMeanAnomSun))*cos(2*RAD*(geomMeanLongSun))-0.5*
                 varY*varY*sin(4*RAD*(geomMeanLongSun))-1.25*eccentEarthOrbit*eccentEarthOrbit*sin(2*RAD*(geomMeanAnomSun)));
  //console.log("eqOfTime", eqOfTime);

  // divide by 60 since offset is given in minutes
  // multiply by -1 because this gives GMT - ${your time zone}
  let tzOffset = -(new Date()).getTimezoneOffset() / 60;
  //console.log("tzOffset", tzOffset);

  let solarNoon = (720-4*long-eqOfTime+tzOffset*60)/1440;
  console.log("solarNoon", solarNoon);
  // this is basically the % progression through the day; a value of 0.5
  // means that solar noon is exactly at normal noon (12:00)
  // # of mins = 60 * 24
  // # of mins through the day
  let mins = solarNoon * (60 * 24);
  let hrs = Math.floor(mins/60);
  mins = Math.floor(mins % 60);
  //console.log("solar noon", hrs, mins);



  //might need to radianify this thing
  let theta = 6;
  //let hourAngle = /*DEG*acos(RAD**/(cos(RAD*theta) - (sin(lat*RAD) * sin(RAD*sunDeclin))) / (cos(lat*RAD) * cos(sunDeclin*RAD));

  let hourAngle = DEG*(acos(cos(RAD*108)/(cos(RAD*lat)*cos(RAD*(sunDeclin)))-tan(RAD*(lat))*tan(RAD*(sunDeclin))));
  console.log("hourAngle", hourAngle);
  //let offset = hourAngle/15.0;
  let offset = hourAngle*4/1440;

  let twilightMorning = solarNoon-offset;
  let twilightEvening = solarNoon+offset;

  console.log("solarNoon", solarNoon);
  console.log("twilightMorning", twilightMorning);
  console.log("twilightEvening", twilightEvening);

  let today = new Date();
  today.setHours(0,0,0,0);

  let morn = DAY * twilightMorning;
  let eve = DAY * twilightEvening;

  let mt = today.valueOf() + morn;
  let et = today.valueOf() + eve;

  // EHHEHEHEHEHEHEHEHEHEEEE
  console.log("morning twilight:", UNIXtoHHMM(mt));
  console.log("evening twilight:", UNIXtoHHMM(et));

  return [mt, et];

}

// find the unix ts for the next new moon
function nextNewFullMoon() {
  const synodic = 29.53059;
  const JDEnew = 2451550.09766;
  const JDEfull = JDEnew + (synodic/2.0); // could find a real val but oh well
  const today = getJulianDay();

  let k = Math.floor((today - JDEnew) / synodic) + 1;
  let T = k / 1236.85;
  let T2 = T*T;
  let T3 = T2*T;
  let T4 = T3*T;
  let newmoon = JDEnew + (synodic*k) + (0.0001337 * T2) - (0.000000150 * T3) + 0.00000000073 * T4;

  k = Math.floor((today - JDEfull) / synodic) + 1;
  T = k / 1236.85;
  T2 = T*T;
  T3 = T2*T;
  T4 = T3*T;
  let fullmoon = JDEfull + (synodic*k) + (0.0001337 * T2) - (0.000000150 * T3) + 0.00000000073 * T4;

  // hmmmm need to find the next time that it's midnight after these dates, and
  // then use that. cause otherwise you'll see 'apr 12' and not realize that apr 12
  // has a new moon that starts at like 4am and you'll go out the night of the
  // or is it not an issue? idk i'm not printing the hour out

  return [getUNIX(newmoon), getUNIX(fullmoon)];
}

// lazy girl function
function UNIXtoHHMM(timestamp) {
  const date = new Date(timestamp);
  let mins = date.getMinutes(); if (mins < 10) mins = `0` + mins;
  let hrs = date.getHours();
  if (hrs == 0) {
    hrs = 12;
    mins += ' am';
  } else if (hrs > 12) {
    hrs = hrs - 12;
    mins += ' pm';
  } else {
    mins += ' am';
  }
  return `${hrs}:${mins}`;
}

// lazy girl function x2
function miniformat(UNIX) {
  const months = ['jan', 'feb', 'mar', 'apr', 'may', 'jun',
                  'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
  let date = new Date(UNIX);
  const month = months[date.getMonth()];
  const daynr = date.getDate();

  return `${month} ${daynr}`;
}

// borrowed from https://celestialprogramming.com/meeus-illuminated_fraction_of_the_moon.html
function constrain(angle) {
    let tmp = angle%360;
    if (tmp < 0) { tmp += 360; }
    return tmp;
}

function getMoonIllum(offset=0) {
    // calculate illumination
    // borrowed from https://celestialprogramming.com/meeus-illuminated_fraction_of_the_moon.html
    // (this one also takes from astronomical algorithms, thank you jean meeus)
    // reference for accuracy of data below:
    // https://aa.usno.navy.mil/calculated/moon/fraction?year=2025&task=12&tz=5&tz_sign=-1&tz_label=true&submit=Get+Data
    const T=(getJulianDay(offset)-2451545)/36525.0;

    const D = constrain(297.8501921 + 445267.1114034*T - 0.0018819*T*T + 1.0/545868.0*T*T*T - 1.0/113065000.0*T*T*T*T)*RAD; //47.2
    const M = constrain(357.5291092 + 35999.0502909*T - 0.0001536*T*T + 1.0/24490000.0*T*T*T)*RAD; //47.3
    const Mp = constrain(134.9633964 + 477198.8675055*T + 0.0087414*T*T + 1.0/69699.0*T*T*T - 1.0/14712000.0*T*T*T*T)*RAD; //47.4

    //48.4
    const i=constrain(180 - D*180/Math.PI - 6.289 * Math.sin(Mp) + 2.1 * Math.sin(M) -1.274 * Math.sin(2*D - Mp) -0.658 * Math.sin(2*D) -0.214 * Math.sin(2*Mp) -0.11 * Math.sin(D))*RAD;

    let k=(1+Math.cos(i))/2;
    k = k.toFixed(2)
    k = k * 100;
    return k;
}

// this is like, not a really precise way of doing things, but the meeus calculations
// were a liiiiiitle too much for me at the moment so i'm doing this the lazy way
// TODO: use the real formulas
function getMoonPhase(julianDate) {
    // offset from known new moon (midnight jan 6 2000)
    let diff = julianDate - 2451549.5;
    // lunar months average 29.53 days, so divide days elapsed by 29.53 to get
    // how many cycles we've moved through
    let newMoons = diff / 29.53;
    // get the decimal part of this to see how far we are through the current cycle
    let fraction = newMoons - Math.floor(newMoons);

    // based on that amount, assign the phase (roughly)
    // these emojis are the opposite of what they should be
    // (first quarter vs third, waning gibbous instead of waxing crescent)
    // because i'm displaying white text rather than black
    ///if (fraction < 0.0625) return '🌕︎ new moon';
    ///else if (fraction < 0.1875) return '🌖︎ waxing crescent';
    ///else if (fraction < 0.3125) return '🌗︎ first quarter';
    ///else if (fraction < 0.4375) return '🌘︎ waxing gibbous';
    ///else if (fraction < 0.5625) return '🌑︎ full moon';
    ///else if (fraction < 0.6875) return '🌒︎ waning gibbous';
    ///else if (fraction < 0.8125) return '🌓︎ last quarter';
    ///else if (fraction < 0.9375) return '🌔︎ waning crescent';
    ///else return '🌕︎ new moon';
    if (fraction < 0.0625) return 'new moon';
    else if (fraction < 0.1875) return 'waxing crescent';
    else if (fraction < 0.3125) return 'first quarter';
    else if (fraction < 0.4375) return 'waxing gibbous';
    else if (fraction < 0.5625) return 'full moon';
    else if (fraction < 0.6875) return 'waning gibbous';
    else if (fraction < 0.8125) return 'last quarter';
    else if (fraction < 0.9375) return 'waning crescent';
    else return 'new moon';
}

// where we actually run code
(async () => {
    // store values for future (re)use
    const [lat, lon] = await getLatLon();
    let [rise, noon, set] = getRiseSet(lat, lon);
    rise = UNIXtoHHMM(rise);
    noon = UNIXtoHHMM(noon);
    set = UNIXtoHHMM(set);

    let illumination = getMoonIllum(0);
    let phase = getMoonPhase(getJulianDay());
    let [mt, et] = getTwilight(lat, lon);
    mt = UNIXtoHHMM(mt);
    et = UNIXtoHHMM(et);

    let [newmoon, fullmoon] = nextNewFullMoon();
    miniformat(newmoon);
    newmoon = new Date(newmoon);
    fullmoon = new Date(fullmoon);

    let riseEl = document.getElementById("sunrise");
    let setEl = document.getElementById("sunset");
    riseEl.innerHTML = `sunrise: ${rise}`;
    setEl.innerHTML = `sunset:&nbsp; ${set}`;

    let illumEl = document.getElementById("illumtext");
    illumEl.innerHTML = `${illumination}%`;

    ////////// for the bottom bar //////////
    let barsunEl = document.getElementById("sun");
    barsunEl.innerHTML = `sun ↑${rise} - ${set}↓`;

    let barmoonEl = document.getElementById("moon");
    barmoonEl.innerHTML = `︎${phase}, ${illumination}︎% illuminated `;

    let twilightEl = document.getElementById("twilight");
    twilightEl.innerHTML = `dawn ${mt}, dusk ${et}`;

    let majorEl = document.getElementById("nextmajor");
    let majorfmt = `next 🌕︎: ${miniformat(newmoon)}, next 🌑︎: ${miniformat(fullmoon)}`;
    majorfmt = `next new moon: ${miniformat(newmoon)}; full: ${miniformat(fullmoon)}`;
    majorEl.innerHTML = majorfmt;
})();
