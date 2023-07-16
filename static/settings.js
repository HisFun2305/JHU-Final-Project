
async function logJSONData() {
    const response = await fetch("/");
    const jsonData = await response.json();
    console.log(jsonData)
}

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

document.addEventListener("DOMContentLoaded", function(){
    var settings = document.getElementById("settings")
    var settingsForm = document.getElementById("settings-input")
    const SETTINGS_FORM = `
    <div class="form-child">
        <label for="volume" class="form-label">Volume</label>
        <input type="range" class="slider" min="0" max="100" value="0" id="volume" name="volume">
    </div>
    <div class="btn-group" role="group" aria-label="Basic radio toggle button group">
        <input type="radio" class="btn-check" name="btnradio" id="btnradio1" autocomplete="off" value="0" checked>
        <label class="btn btn-outline-dark" for="btnradio1">Spacebar</label>
      
        <input type="radio" class="btn-check" name="btnradio" id="btnradio2" autocomplete="off" value="1">
        <label class="btn btn-outline-dark" for="btnradio2">Keyboard</label>
    </div>
    <button id="save" type="submit" class="btn btn-dark">Save</button>`

    function initSettings() {
        settings = document.getElementById("settings")
        settings.style.width = "15rem";
        settings.style.height = "8rem";
        settings.firstElementChild.style.rotate = "90deg";
        return new Promise(function (resolve) {
            setTimeout(function(){
                settingsForm.innerHTML = SETTINGS_FORM
                for (c of settings.children){
                    if (c.id != "img"){
                        c.addEventListener("click", function(event){
                            event.stopPropagation();
                        })
                    }
                }
                var save = document.getElementById("save")
                save.addEventListener("click", function(event){
                    event.preventDefault();
                    var vol = document.getElementById("volume");
                    var b1 = document.getElementById("btnradio1");
                    var b2 = document.getElementById("btnradio2");
                    var data = {volume: vol.ariaValueMax, btn1: b1.checked, btn2:b2.checked};
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
            i--;
        }
    })
})