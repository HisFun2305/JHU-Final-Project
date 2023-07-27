function spicyShadows(event){
    var x = event.clientX
    var y = event.clientY
    var div = document.getElementById("desc");
    for (c of div.children){
        var rect = c.getBoundingClientRect();
        var vec = normaliseXY(x, y, (rect.left+rect.right)/2, (rect.top+rect.bottom)/2)
        c.style.textShadow = `${vec.x*5}px ${vec.y*5}px 10px grey`
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
});