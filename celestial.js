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

function getJulianDay(offset=0) {
  return 2440587.5 + ((Date.now()+(offset*DAY)) / (DAY));
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
  //console.log("HAsunrise", HAsunrise);

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
  //console.log("solarNoon", solarNoon);
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

// borrowed from https://celestialprogramming.com/meeus-illuminated_fraction_of_the_moon.html
function constrain(angle) {
    let tmp = angle%360;
    if (tmp < 0) { tmp += 360; }
    return tmp;
}

(async () => {
    const [lat, lon] = await getLatLon();
    let [rise, _, set] = getRiseSet(lat, lon);
    rise = UNIXtoHHMM(rise);
    set = UNIXtoHHMM(set);

    let riseEl = document.getElementById("sunrise");
    let setEl = document.getElementById("sunset");
    riseEl.innerHTML = `sunrise: ${rise}`;
    setEl.innerHTML = `sunset:&nbsp; ${set}`;

    // calculate illumination
    // borrowed from https://celestialprogramming.com/meeus-illuminated_fraction_of_the_moon.html
    // (this one also takes from astronomical algorithms, thank you jean meeus)
    // reference for accuracy of data below:
    // https://aa.usno.navy.mil/calculated/moon/fraction?year=2025&task=12&tz=5&tz_sign=-1&tz_label=true&submit=Get+Data
    const T=(getJulianDay()-2451545)/36525.0;

    const D = constrain(297.8501921 + 445267.1114034*T - 0.0018819*T*T + 1.0/545868.0*T*T*T - 1.0/113065000.0*T*T*T*T)*RAD; //47.2
    const M = constrain(357.5291092 + 35999.0502909*T - 0.0001536*T*T + 1.0/24490000.0*T*T*T)*RAD; //47.3
    const Mp = constrain(134.9633964 + 477198.8675055*T + 0.0087414*T*T + 1.0/69699.0*T*T*T - 1.0/14712000.0*T*T*T*T)*RAD; //47.4

    //48.4
    const i=constrain(180 - D*180/Math.PI - 6.289 * Math.sin(Mp) + 2.1 * Math.sin(M) -1.274 * Math.sin(2*D - Mp) -0.658 * Math.sin(2*D) -0.214 * Math.sin(2*Mp) -0.11 * Math.sin(D))*RAD;

    let k=(1+Math.cos(i))/2;
    k = k.toFixed(2)
    k = k * 100;
    let illumEl = document.getElementById("illumtext");
    illumEl.innerHTML = `${k}%`;
})();
