function updateTime() {
    // step 1: get the time
    const date = new Date()

    // step 2: get all my INFORMATION
    let secs = date.getSeconds();
    if (secs < 10) secs = `0` + secs;

    let mins = date.getMinutes();
    if (mins < 10) mins = `0` + mins;

    let hrs = date.getHours();
    let xm;
    if (hrs == 0) {
        hrs = 12;
        xm = "am";
    } else if (hrs > 12) {
        hrs -= 12;
        xm = "pm"
    } else {
        xm = "am"
    }
    if (hrs < 10) hrs = `0` + hrs;

    // 3. assign the damn thing
    let timeEl = document.getElementById("timecontainer");
    timeEl.innerHTML = `${hrs}:${mins}:${secs} ${xm}`
}

// 4. run it every second

updateTime();
window.onload = setInterval(updateTime, 1000);
