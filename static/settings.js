var volVal = 0
var btn2Checked = "checked"
var btn1Checked = ""

async function logJSONData() {
    return new Promise(async function(resolve){
        const response = await fetch("/settings");
        const jsonData = await response.json();
        volVal = jsonData.volume
        if (jsonData.inputSetting == 0){
            btn2Checked = "checked", btn1Checked = ""
        }
        else {
            btn2Checked = "", btn1Checked = "checked"
        }
        resolve(jsonData);
    });
}
logJSONData();

async function postJSON(data) {
    try {
      const response = await fetch("/", {
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

function dynSettings(){
    if (window.innerWidth < 575.98){
        settings.style.width = "15rem";
        settings.style.height = "8rem";
    }
    else{
        settings.style.width = "17rem";
        settings.style.height = "10rem";
    }
}

document.addEventListener("DOMContentLoaded", async function(){
    var settings = document.getElementById("settings")
    var settingsForm = document.getElementById("settings-input")

    function initSettings() {
        settings = document.getElementById("settings")
        dynSettings();
        window.addEventListener("resize", dynSettings);
        settings.firstElementChild.style.rotate = "90deg";
        return new Promise(function (resolve) {
            setTimeout(function(){
                settingsForm.innerHTML = `
                <div class="form-child">
                    <label for="volume" class="form-label">Volume</label>
                    <input type="range" class="slider" min="0" max="100" value="${volVal}" id="volume" name="volume">
                </div>
                <div class="btn-group" role="group" aria-label="Basic radio toggle button group">
                    <input type="radio" class="btn-check" name="btnradio" id="btnradio1" autocomplete="off" value="1" ${btn1Checked}>
                    <label class="btn btn-outline-dark" for="btnradio1">Spacebar</label>
                  
                    <input type="radio" class="btn-check" name="btnradio" id="btnradio2" autocomplete="off" value="0" ${btn2Checked}>
                    <label class="btn btn-outline-dark" for="btnradio2">L-click/Tap</label>
                </div>
                <button id="save" type="submit" class="btn btn-dark">Save</button>`
                for (c of settings.children){
                    if (c.id != "img"){
                        c.addEventListener("click", function(event){
                            event.stopPropagation();
                        })
                    }
                }
                var save = document.getElementById("save")
                var vol = document.getElementById("volume");
                var b1 = document.getElementById("btnradio1");
                var b2 = document.getElementById("btnradio2");
                vol.addEventListener("input", function(event){
                    volVal = vol.value;
                    var volVis = document.getElementById("volume-vis");
                    if (volVis){
                        volVis.value = `${vol.value}`;
                    }
                })
                b1.addEventListener("click", function(event){
                    btn1Checked = "checked"
                    btn2Checked = ""
                    var b1Settings = document.getElementById("btnradio1-vis")
                    var txtOut = document.getElementById("txt2")
                    txtOut ? txtOut.innerText = "Your task is simple: whenever you hear a beep, press the spacebar, and try to follow the rhythm." : false
                    if (b1Settings) {
                        b1Settings.checked = true
                    }
                })
                b2.addEventListener("click", function(event){
                    btn2Checked = "checked"
                    btn1Checked = ""
                    var txtOut = document.getElementById("txt2")
                    txtOut ? txtOut.innerText = "Your task is simple: whenever you hear a beep, click the left mouse button or tap the screen, and try to follow the rhythm." : false
                    var b2Settings = document.getElementById("btnradio2-vis")
                    if (b2Settings) {
                        b2Settings.checked = true
                    }
                })  
                save.addEventListener("click", function(event){
                    event.preventDefault();              
                    var data = {volume: vol.value, inputSetting: b2.checked ? 0 : 1};
                    postJSON(data);
                })
                resolve(true)
            }, 200);
        });
    }

    var i = 0
    settings.addEventListener("click", async function(event){
        if (i == 0){
            await initSettings();
            i++;
        }
        else {
            settings.style.width = "3rem";
            settings.style.height = "3rem";
            settings.firstElementChild.style.rotate = "0deg";
            settingsForm.innerHTML = "";
            window.removeEventListener("resize", dynSettings);
            i--;
        }
    })
})