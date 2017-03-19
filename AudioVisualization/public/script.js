console.log('running...');


var WIDTH = cnv.width;
var HEIGHT = cnv.height;


var ctx = new AudioContext();

//audio.src = window.URL.createObjectURL(audio.src);
//audio.crossOrigin = "anonymous";
var audioSrc = ctx.createMediaElementSource(audio);
var analyser = ctx.createAnalyser();

audioSrc.connect(analyser);
audioSrc.connect(ctx.destination);


// OSCILLATOR
//analyser.fftSize = 2048;

var bufferLength = analyser.frequencyBinCount;

// BAR GRAPH
analyser.fftSize = 256;
//analyser.fftSize = 4096;
bufferLength = analyser.frequencyBinCount;

var frequencyData = new Uint8Array(bufferLength);

function draw() {
    canvasCtx.clearRect(0, 0, cnv.width, cnv.height);
    requestAnimationFrame(draw);

    analyser.getByteFrequencyData(frequencyData);

    if (currGraph == 'osc') {
        analyser.getByteTimeDomainData(frequencyData); // OSCILLATOR
        oscillator();
    } else if (currGraph == 'bar') {
        barGraph();
    } else if (currGraph == 'rad') {
        analyser.getByteTimeDomainData(frequencyData);
        radial();
    }

}

function oscillator() {
    canvasCtx.fillStyle = 'rgb(200, 200, 200)'; // OSCILLATOR
    canvasCtx.lineWidth = 2;
    canvasCtx.strokeStyle = 'rgb(0, 0, 0)';
    canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);

    canvasCtx.beginPath();

    var sliceWidth = WIDTH * 1.0 / bufferLength;
    var x = 0;

    for (var i = 0; i < bufferLength; i++) {

        var v = frequencyData[i] / 128.0;
        var y = v * HEIGHT / 2;

        if (i === 0) {
            canvasCtx.moveTo(x, y);
        } else {
            canvasCtx.lineTo(x, y);
        }

        x += sliceWidth;
    }

    canvasCtx.lineTo(cnv.width, cnv.height / 2);
    canvasCtx.stroke();
}

function barGraph() {

    canvasCtx.fillStyle = 'rgb(0, 0, 0)'; // BAR
    canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);
    var barWidth = (WIDTH / bufferLength) * 2.5;
    var barHeight;
    var x = 0;

    for (var i = 0; i < bufferLength; i++) {
        barHeight = frequencyData[i] / 0.4;

        canvasCtx.fillStyle = 'rgb(200,50,50)';
        canvasCtx.fillRect(x, HEIGHT - barHeight / 2, barWidth, barHeight);

        x += barWidth + 1;
    }
}

function radial() {

    var r = 300;

    var midX = WIDTH / 2;
    var midY = HEIGHT / 2;

    var twoPi = 2 * Math.PI;

    var objectsCount = bufferLength;

    var change = twoPi / objectsCount;

    //canvasCtx.transform(1, 0, 0, 1, midX, midY);

    canvasCtx.beginPath();
    canvasCtx.strokeStyle = "black";
    canvasCtx.lineWidth = 1;
    canvasCtx.fillStyle = "rgb(100,100,100)";
    canvasCtx.fill();
    canvasCtx.fillRect(0, 0, cnv.width, cnv.height);

    for (var i = 0; i < twoPi; i += change) {

        var percent = i / bufferLength;
        var output = Math.round(i * bufferLength / twoPi);
        var r = frequencyData[output];
        var x = r * Math.cos(i);
        var y = r * Math.sin(i);


        if (i === 0) {
            //canvasCtx.moveTo(midX, midY);
        } else {
            canvasCtx.lineTo(x + midX, y + midY);

        }
    }
    
    canvasCtx.closePath();
    canvasCtx.stroke();
}

audio.play();
draw();