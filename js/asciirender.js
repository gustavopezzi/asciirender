document.addEventListener("DOMContentLoaded", function(event) { 
    var v = document.getElementById('vid');
    var c = document.getElementById('canv').getContext('2d');
    var a = document.getElementById('a');
    var cs = "$@B%8&WM#*oahkbdpqwmZO0QLCJUYXzcvunxrjft/\|()1{}[]?-_+~<>i!lI;:,&quot;^`'. ";

    a.style.fontSize = '14px';
    a.style.lineHeight = '14px';

    v.play();
    v.paused=false;
    
    navigator.getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia || function() {};
    
    navigator.getUserMedia({
        video: true
    }, function(stream) {
        v.src = window.URL.createObjectURL(stream);
        v.play();
        v.addEventListener('play', captureFrames);
    }, function() {
        alert('*** application does not have permission to use the webcam ***');
    });

    function captureFrames() {
        if (v.paused)
            return;
      
        try {
            c.drawImage(v, 0, 0);
            var pixels = contrastFilter(c.getImageData(0, 0, 640, 480));
            c.putImageData(pixels, 0, 0);
            convertToASCII(pixels);
        }
        catch (e) {

        }
        
        requestAnimationFrame(captureFrames);
    }

    function contrastFilter(pixels) {
        var d = pixels.data;
        var l = d.length;
        var gray = 0;
      
        for (var i = 0; i < l; i += 4) {
            gray = 0.2126 * d[i] + 0.7152 * d[i + 1] + 0.0722 * d[i + 2];
            d[i] = d[i + 1] = d[i + 2] = Math.round(gray / 255 * cs.length) * 255 / cs.length;
        }

        return pixels;
    }

    function convertToASCII(pixels) {
        var w = 640, h = 480;
        var x, y, xi, yi, d = pixels.data;
        var sum = 0;
        var c = [];
        var detail = 10;
      
        for (y = 0; y < h; y += detail) {
            for (x = 0; x < w; x += detail * (5/8)) {
                char = Math.floor(d[(Math.round(x) + (y * w)) * 4] / 255 * (cs.length - 1));
                c.push(cs[char]);
            }
            c.push("\n");
        }
        a.textContent = c.join("");
    }
    
    window.requestAnimationFrame = window.requestAnimationFrame || 
        window.webkitRequestAnimationFrame || 
        window.mozRequestAnimationFrame || 
        function(f) {
            setTimeout(f, 1000/60);
        };
});