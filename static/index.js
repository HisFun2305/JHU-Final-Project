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

// volSlider = document.getElementById("volume")
// volSlider.addEventListener("input", function(event){
//     audio.volume = (volSlider.value/100)
//     if (audio.duration = 0 || audio.paused) {
//         audio.loop = true;
//         audio.play();
//     }
// })

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
    
});