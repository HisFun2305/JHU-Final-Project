const width = window.innerWidth;
const height = window.innerHeight;
var audio = new Audio("static/audio/Procedural Jiggle Bone.mp3")

function spicyShadows(event){
    var x = event.clientX
    var y = event.clientY
    var div = document.getElementById("desc");
    for (c of div.children){
        var rect = c.getBoundingClientRect();
        var vec = normaliseXY(x, y, (rect.left+rect.right)/2, (rect.top+rect.bottom)/2)
        c.style.textShadow = `${vec.x*2}px ${vec.y*2}px 3px grey`
    }
}

function normaliseXY(pX, pY, posX, posY){
    var diffx = posX - pX;
    var diffy = posY - pY;
    var a = Math.atan(diffy/diffx);
    return {x: (diffx/Math.abs(diffx))*Math.cos(Math.abs(a)), y: (diffy/Math.abs(diffy))*Math.sin(Math.abs(a))}
}

document.addEventListener("DOMContentLoaded", function(event) {
    logJSONData()
    var div = document.getElementById("desc");
    div.addEventListener("mousemove", spicyShadows);
    var save = document.getElementById("save-vis")
    var vol = document.getElementById("volume-vis");
    var b1 = document.getElementById("btnradio1-vis");
    var b2 = document.getElementById("btnradio2-vis");
    if (btn1Checked == "checked"){
        b1.checked = true
    }
    else if (btn2Checked == "checked"){
        b2.checked = true
    }
    vol.value = volVal
    save.addEventListener("click", function(event){
        event.preventDefault();
        event.stopPropagation();
        if (vol.value == 0){
            var errOut = document.getElementById("err")
            errOut.innerText = "Please input an audible volume"
        }
        else {
            var data = {volume: vol.value, inputSetting: b2.checked ? 0 : 1};
            postJSON(data);
            var cont = document.getElementById("txt3");
            cont.style.opacity = 1;
            save.blur()
            if (b1.checked) {
                txt3 = document.getElementById("txt3");
                txt3.innerText = "[Press the spacebar to begin]"
                document.addEventListener("keypress", function(event){
                    if (event.code == "Space") {
                        for (var c of div.children){
                            if (c.id != "settings"){
                                c.style.opacity = 0;
                            }
                        }
                        setInterval(function(){
                            window.location.href = `${window.location.origin}/exp`;
                        }, 1100);
                    }
                });
            }
            
            else if (b2.checked) {
                txt3 = document.getElementById("txt3");
                txt3.innerText = "[Left-click or tap the screen to begin]"
                document.addEventListener("click", function(event){
                    for (var c of div.children){
                        if (c.id != "settings"){
                            c.style.opacity = 0;
                        }
                    }
                    setInterval(function(){
                        window.location.href = `${window.location.origin}/exp`;
                    }, 1100);
                });
            }
        }
    })
    vol.addEventListener("input", function(event){
        var errOut = document.getElementById("err")
        errOut.innerText = ""
        volVal = vol.value;
        var volSettings = document.getElementById("volume");
        if (volSettings){
            volSettings.value = `${vol.value}`;
        }
    })
    b1.addEventListener("click", function(event){
        event.stopPropagation()
        btn1Checked = "checked"
        btn2Checked = ""
        var b1Settings = document.getElementById("btnradio1")
        var txtOut = document.getElementById("txt2")
        txtOut.innerText = "Your task is simple: whenever you hear a beep, press the spacebar, and try to follow the rhythm."
        if (b1Settings) {
            b1Settings.checked = true
        }
    })
    b2.addEventListener("click", function(event){
        event.stopPropagation()
        btn2Checked = ""
        btn1Checked = "checked"
        var txtOut = document.getElementById("txt2")
        txtOut.innerText = "Your task is simple: whenever you hear a beep, click the left mouse button or tap the screen, and try to follow the rhythm."
        var b2Settings = document.getElementById("btnradio2")
        if (b2Settings) {
            b2Settings.checked = true
        }
    })
    setInterval(function() {
        audio.volume = (vol.value/100);
        if (audio.duration = 0 || audio.paused) {
            audio.loop = true;
            audio.play();
        }
    }, 100);
});