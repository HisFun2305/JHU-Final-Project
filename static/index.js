const width = window.innerWidth;
const height = window.innerHeight;
var audio = new Audio("static/audio/Procedural Jiggle Bone.mp3")

function initBegin(){
    div.addEventListener("keypress", async function(event) {
        if (event.code === "Space") {
            for (c of div.children){
                c.style.textShadow = ""
                div.removeEventListener("mousemove", spicyShadows)
            }
            div.style.color = "transparent"
        }
    });
}

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
    var div = document.getElementById("desc");
    div.addEventListener("mousemove", spicyShadows);
    var save = document.getElementById("save-vis")
    var vol = document.getElementById("volume-vis");
    var b1 = document.getElementById("btnradio1-vis");
    var b2 = document.getElementById("btnradio2-vis");
    save.addEventListener("click", function(event){
        event.preventDefault();
        var data = {volume: vol.ariaValueMax, btn1: b1.checked, btn2: b2.checked};
        postJSON(data);
    })
    vol.addEventListener("input", function(event){
        volVal = vol.value;
        var volSettings = document.getElementById("volume");
        if (volSettings){
            volSettings.value = `${vol.value}`;
        }
    })
    b1.addEventListener("click", function(event){
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
        btn2Checked = "checked"
        btn1Checked = ""
        var txtOut = document.getElementById("txt2")
        txtOut.innerText = "Your task is simple: whenever you hear a beep, click the right mouse button, and try to follow the rhythm."
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