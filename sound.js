//GRADIENT STUFF

var grad = new Granim({
    element: '#grad',
    direction: 'left-right',
    // stateTransitionSpeed: 50000,
    isPausedWhenNotInView: true,
    states : {
        "default-state": {
            gradients: [
                [
                    { color: '#f5e09d' },
                    { color: '#7aa5e6'},
                    { color: '#ed82e4'}
                ], [
                    { color: '#ed82e4'},
                    { color: '#f5e09d' },
                    { color: '#7aa5e6'},
                ], [
                    { color: '#7aa5e6'},
                    { color: '#ed82e4'},
                    { color: '#f5e09d' },
                ],
            ],
            transitionSpeed: 1000
        }, "750": {
            gradients: [
                [
                    { color: '#f5e09d' },
                    { color: '#7aa5e6'},
                    { color: '#ed82e4'}
                ], [
                    { color: '#ed82e4'},
                    { color: '#f5e09d' },
                    { color: '#7aa5e6'},
                ], [
                    { color: '#7aa5e6'},
                    { color: '#ed82e4'},
                    { color: '#f5e09d' },
                ],
            ],
            transitionSpeed: 750
        }, "500": {
            gradients: [
                [
                    { color: '#f5e09d' },
                    { color: '#7aa5e6'},
                    { color: '#ed82e4'}
                ], [
                    { color: '#ed82e4'},
                    { color: '#f5e09d' },
                    { color: '#7aa5e6'},
                ], [
                    { color: '#7aa5e6'},
                    { color: '#ed82e4'},
                    { color: '#f5e09d' },
                ],
            ],
            transitionSpeed: 500
        }, "250": {
            gradients: [
                [
                    { color: '#f5e09d' },
                    { color: '#7aa5e6'},
                    { color: '#ed82e4'}
                ], [
                    { color: '#ed82e4'},
                    { color: '#f5e09d' },
                    { color: '#7aa5e6'},
                ], [
                    { color: '#7aa5e6'},
                    { color: '#ed82e4'},
                    { color: '#f5e09d' },
                ],
            ],
            transitionSpeed: 250
        }
    }
});


//SOUND AND DISTORT STUFF

const paths = document.getElementsByTagName('path');

var start = 0;

document.addEventListener('click', async () => {
    // Prompt user to select any serial port.
    var port = await navigator.serial.requestPort();
    // be sure to set the baudRate to match the ESP32 code
    await port.open({ 
        baudRate: 115200,
        bufferSize: 2048
     });
  
    let decoder = new TextDecoderStream();
    inputDone = port.readable.pipeTo(decoder.writable);
    inputStream = decoder.readable;
  
    reader = inputStream.getReader();
    readLoop();
  });

async function readLoop(){

    while (true) {
        const { value, done } = await reader.read();

        if(done){
            // console.log(value);
        }
        var doc = value;
        // doc = JSON.parse(doc);
        // console.log(doc);
        if(IsJsonString(doc))
        {
            const metrics = JSON.parse(doc);
            console.log(metrics);
            console.log("DIAL: " + metrics.Dial);

            if(metrics.Button == 0 && start == 0){
                Tone.Transport.start();
                loopBeat.start();
                console.log("STARTED");
                start = 1;
            }else if(metrics.Button == 0 && start == 1){
                loopBeat.stop(0);
                console.log("END");
                start = 0;
            }

            if(start == 1){
                console.log("START");

                // BPM DIAL CONTROLS
                if(metrics.Dial >= 0 && metrics.Dial <= 1024){
                    Tone.Transport.bpm.rampTo(200, 5);
                    grad.changeState('default-state');
                }
                if(metrics.Dial >= 1025 && metrics.Dial <= 2048){
                    console.log("RAMPING");
                    Tone.Transport.bpm.rampTo(400, 5);
                    grad.changeState('750');
                }
                if(metrics.Dial >= 2049 && metrics.Dial <= 3072){
                    console.log("RAMPING");
                    Tone.Transport.bpm.rampTo(600, 5);
                    grad.changeState('500');
                }
                if(metrics.Dial >= 3073 && metrics.Dial <= 4096){
                    console.log("RAMPING");
                    Tone.Transport.bpm.rampTo(800, 5);
                    grad.changeState('250');
                }

                //VRX PITCH
                if(metrics.vX > 2000){
                    shift.pitch = shift.pitch + 1;

                    anime({
                        targets: [paths],
                        skewX: 180,
                        easing: "easeInOutQuad",
                        duration: 3000,
                        direction: "alternate",
                        loop: true,
                        });    

                }
                if(metrics.vX >= 1500 && metrics.vX <= 2000){
                    shift.pitch = 0;

                    if(metrics.vY >= 1500 && metrics.vY <= 2000){

                    anime({
                        targets: [paths],
                        skewX: 0,
                        easing: "easeInOutQuad",
                        duration: 1000,
                        direction: "alternate",
                        loop: true,
                        });
                    }
                }
                if(metrics.vX < 1500){
                    shift.pitch = shift.pitch - 1;

                    anime({
                        targets: [paths],
                        skewX: -180,
                        easing: "easeInOutQuad",
                        duration: 3000,
                        direction: "alternate",
                        loop: true,
                        });
                
                }

                //VRY DISTORT
                if(metrics.vY > 2000){
                    distort.distortion = distort.distortion + .01;

                    anime({
                        targets: [paths],
                        skewY: 180,
                        easing: "easeInOutQuad",
                        duration: 3000,
                        direction: "alternate",
                        loop: true,
                        });

                }
                if(metrics.vY >= 1500 && metrics.vY <= 2000){
                    distort.distortion = 0;

                    if(metrics.vX >= 1500 && metrics.vX <= 2000){
                    anime({
                        targets: [paths],
                        skewY: 0,
                        easing: "easeInOutQuad",
                        duration: 1000,
                        direction: "alternate",
                        loop: true,
                        });
                    }

                }
                if(metrics.vY < 1500){
                    distort.distortion = distort.distortion - .01;

                    anime({
                        targets: [paths],
                        skewY: -180,
                        easing: "easeInOutQuad",
                        duration: 3000,
                        direction: "alternate",
                        loop: true,
                        });
                }

            }
            
        }
    }
}

function IsJsonString(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    // console.log(str);
    return true;
}

sillySynth = new Tone.AMSynth().toMaster();
rubberSynth = new Tone.MonoSynth().toMaster();
bassSynth = new Tone.MembraneSynth().toMaster();
const loopBeat = new Tone.Loop(beat, "4n");

var shift = new Tone.PitchShift({
	pitch: 0
}).toMaster();

var distort = new Tone.Distortion({
    distortion: 0,
}).toDestination();

sillySynth.connect(shift);
rubberSynth.connect(shift);
bassSynth.connect(shift);

sillySynth.connect(distort);
rubberSynth.connect(distort);
bassSynth.connect(distort);


document.getElementById('start').addEventListener('click', function(){
    Tone.Transport.start();
    loopBeat.start();
    console.log("STARTED");
    start = 1;
});

function beat(time){
    sillySynth.triggerAttackRelease('c5', '8n', time);
    rubberSynth.triggerAttackRelease('c1', '8n', time);
    bassSynth.triggerAttackRelease('c1', '8n', time);
    console.log(time);
}

document.getElementById("200").addEventListener('click', function(){
    Tone.Transport.bpm.rampTo(200, 5);
    console.log("BPM");
});

document.getElementById("400").addEventListener('click', function(){
    Tone.Transport.bpm.rampTo(400, 5);
    console.log("BPM");
});

document.getElementById("600").addEventListener('click', function(){
    Tone.Transport.bpm.rampTo(600, 5);
    console.log("BPM");
});

document.getElementById("800").addEventListener('click', function(){
    Tone.Transport.bpm.rampTo(800, 5);
    console.log("BPM");
});

document.getElementById("pitch1").addEventListener('click', function(){
    console.log("PITCH");
    shift.pitch = shift.pitch + 10;
});

document.getElementById("pitch2").addEventListener('click', function(){
    console.log("PITCH");
    shift.pitch = shift.pitch - 10;
});

document.getElementById("stop").addEventListener('click', function(){
    loopBeat.stop(0);
});