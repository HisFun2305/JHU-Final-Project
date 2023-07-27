var audio = new Audio(`static/audio/Beep.mp3`)
var freqList = [];
var timeLists = [];

async function postData(data) {
    try {
      await fetch("/exp", {
        method: "POST", // or 'PUT'
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
  
    } catch (error) {
      console.error(error);
    }
}

function getRandomFreq() {
    for (let i = 0; i < 5; i++){
        var freq = Math.floor(Math.random() * 7) * 10 + 40
        while (freqList.indexOf(freq) != -1){
            freq = Math.floor(Math.random() * 7) * 10 + 40
        }
        freqList.push(freq)
    }
}

function msDelay(f) {
    return (60.0000/f.toFixed(4))*1000
}

document.addEventListener("DOMContentLoaded", async function(){
    await logJSONData()

    bg = document.getElementById("desc")
    three = document.getElementById("cdown3")
    two = document.getElementById("cdown2")
    one = document.getElementById("cdown1")
    if (btn1Checked == "checked") {
        document.addEventListener("keypress", function(event){
            if (event.code == "Space"){
                bg.style.opacity = 0.8
                setTimeout(function(){
                    bg.style.opacity = 1
                }, 50)
            }
        });
    }
    else if (btn2Checked == "checked") {
        document.addEventListener("click", function(event){
            bg.style.opacity = 0.8
            setTimeout(function(){
                bg.style.opacity = 1
            }, 50)
        });
    }
    await new Promise(function(resolve){
        setTimeout(function(){
            three.style.fontSize = "40vw";
            three.style.opacity = 1;
        }, 1000);
        setTimeout(function(){
            three.style.opacity = 0;
            three.style.fontSize = "1vw";
        }, 2000);
        setTimeout(function(){
            two.style.fontSize = "40vw";
            two.style.opacity = 1;
        }, 3000);
        setTimeout(function(){
            two.style.opacity = 0;
            two.style.fontSize = "1vw";
        }, 4000);
        setTimeout(function(){
            one.style.fontSize = "40vw";
            one.style.opacity = 1;
        }, 5000);
        setTimeout(function(){
            one.style.opacity = 0;
            one.style.fontSize = "1vw";
            resolve(true)
        }, 6000);
    })

    getRandomFreq()
    //calibration sequence
    var calibList = [2000, 1800, 1600, 1400, 1200, 1000, 800, 600]
    await new Promise(function(resolve){
        var beep = seqTimer(function(){
            audio.volume = (volVal/100);
            audio.play();
        }, calibList)
        var begin = new Date().getTime();
        var timeList = [];
        var num = 9;
        let c = 0;
        function clicker(event){
            event.stopPropagation();
            c++;
            console.log(c);
            let t = new Date().getTime() - begin
            timeList.push(t.toString())
            if (c == num){
                timeLists.push(timeList);
                clearTimeout(esc);
                document.removeEventListener("click", clicker)
                resolve(true);
            }
        }
        function clickerAlt(event){
            if (event.code == "Space") {
                console.log(num);
                event.stopPropagation();
                c++;
                let t = new Date().getTime() - begin
                timeList.push(t.toString())
                if (c == num){
                    timeLists.push(timeList);
                    clearTimeout(esc);
                    document.removeEventListener("keypress", clickerAlt);
                    resolve(true);
                }
            }
        }
        if (btn1Checked == "checked") {
            document.addEventListener("keypress", clickerAlt);
        }
        else if (btn2Checked == "checked") {
            document.addEventListener("click", clicker);
        }
        var esc = setTimeout(function(){
            timeList.push("X")
            timeLists.push(timeList);
            if (btn1Checked == "checked") {
                document.removeEventListener("keypress", clickerAlt);
            }
            else if (btn2Checked == "checked") {
                document.removeEventListener("click", clicker)
            }
            resolve(false);
        },15400);
    })

    //experiment
    for (f of freqList){
        var timeList = []
        var begin = new Date().getTime();
        var beep = accurateTimer(function(){
            audio.volume = (volVal/100);
            audio.play();
        }, msDelay(f))
        await new Promise(function(resolve){
            function clicker(event){
                console.log(num)
                event.stopPropagation()
                c++
                let t = new Date().getTime() - begin
                timeList.push(t.toString())
                if (c == num){
                    beep.cancel();
                    clearTimeout(esc);
                    timeLists.push(timeList);
                    document.removeEventListener("click", clicker)
                    resolve(true);
                }
            }
            function clickerAlt(event){
                if (event.code == "Space") {
                    console.log(num)
                    event.stopPropagation()
                    c++
                    let t = new Date().getTime() - begin
                    timeList.push(t.toString())
                    if (c == num){
                        beep.cancel();
                        clearTimeout(esc);
                        timeLists.push(timeList);
                        document.removeEventListener("keypress", clickerAlt)
                        resolve(true);
                    }
                }
            }
            let c = 0;
            let num = Math.floor(20000/msDelay(f))
            if (btn1Checked == "checked") {
                document.addEventListener("keypress", clickerAlt);
            }
            else if (btn2Checked == "checked") {
                document.addEventListener("click", clicker);
            }
            var esc = setTimeout(function(){
                timeList.push("X")
                timeLists.push(timeList);
                if (btn1Checked == "checked") {
                    document.removeEventListener("keypress", clickerAlt);
                }
                else if (btn2Checked == "checked") {
                    document.removeEventListener("click", clicker)
                }
                resolve(false);
            },21000);
        });
    }
    postData([freqList, timeLists]);
    window.location.href = `${window.location.origin}/qns`;
})

//credit to Scott Price at https://medium.com/@sayes2x/creating-an-accurate-javascript-timer-function-in-react-255f3f5cf50c
const accurateTimer = (fn, time = 1000) => {
    // nextAt is the value for the next time the timer should fire.
    // timeout holds the timeoutID so the timer can be stopped.
    let nextAt, timeout;
    // Initilzes nextAt as now + the time in milliseconds you pass
    // to accurateTimer.
    nextAt = new Date().getTime() + time;
   
    // This function schedules the next function call.
    const wrapper = () => {
      // The next function call is always calculated from when the
      // timer started.
      nextAt += time;
      // this is where the next setTimeout is adjusted to keep the
      //time accurate.
      timeout = setTimeout(wrapper, nextAt - new Date().getTime());
      // the function passed to accurateTimer is called.
      fn();
    };
   
    // this function stops the timer.
    const cancel = () => clearTimeout(timeout);
   
    // the first function call is scheduled.
    timeout = setTimeout(wrapper, nextAt - new Date().getTime());
   
    // the cancel function is returned so it can be called outside
    // accurateTimer.
    return { cancel };
  };

  const seqTimer = (fn, time = 1000) => {
    // nextAt is the value for the next time the timer should fire.
    // timeout holds the timeoutID so the timer can be stopped.
    let nextAt, timeout, c;
    // Initilzes nextAt as now + the time in milliseconds you pass
    // to accurateTimer.
    c = 0;
    nextAt = new Date().getTime() + time[c];
   
    // This function schedules the next function call.
    const wrapper = () => {
      // The next function call is always calculated from when the
      // timer started.
      c++
      nextAt += time[c];
      // this is where the next setTimeout is adjusted to keep the
      //time accurate.
      timeout = setTimeout(wrapper, nextAt - new Date().getTime());
      if (c >= time.length){
          cancel()
      }
      // the function passed to accurateTimer is called.
      fn();
    };
   
    // this function stops the timer.
    const cancel = () => clearTimeout(timeout);
   
    // the first function call is scheduled.
    timeout = setTimeout(wrapper, nextAt - new Date().getTime());
   
    // the cancel function is returned so it can be called outside
    // accurateTimer.
    return { cancel };
  };