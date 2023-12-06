document.addEventListener("DOMContentLoaded", function(event) {

    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const waveform = document.getElementById("waveform");
    //const dot = document.getElementById('dot');

    const keyboardFrequencyMap = {
        '90': 261.625565300598634,  //Z - C
        '83': 277.182630976872096, //S - C#
        '88': 293.664767917407560,  //X - D
        '68': 311.126983722080910, //D - D#
        '67': 329.627556912869929,  //C - E
        '86': 349.228231433003884,  //V - F
        '71': 369.994422711634398, //G - F#
        '66': 391.995435981749294,  //B - G
        '72': 415.304697579945138, //H - G#
        '78': 440.000000000000000,  //N - A
        '74': 466.163761518089916, //J - A#
        '77': 493.883301256124111,  //M - B
        '81': 523.251130601197269,  //Q - C
        '50': 554.365261953744192, //2 - C#
        '87': 587.329535834815120,  //W - D
        '51': 622.253967444161821, //3 - D#
        '69': 659.255113825739859,  //E - E
        '82': 698.456462866007768,  //R - F
        '53': 739.988845423268797, //5 - F#
        '84': 783.990871963498588,  //T - G
        '54': 830.609395159890277, //6 - G#
        '89': 880.000000000000000,  //Y - A
        '55': 932.327523036179832, //7 - A#
        '85': 987.766602512248223,  //U - B
    }

    const positionMap = {
        '90': 0.0,  //Z - C
        '83': 0.5, //S - C#
        '88': 1.0,  //X - D
        '68': 1.5, //D - D#
        '67': 2.0,  //C - E
        '86': 3.0,  //V - F
        '71': 3.5, //G - F#
        '66': 4.0,  //B - G
        '72': 4.5, //H - G#
        '78': 5.0,  //N - A
        '74': 5.5, //J - A#
        '77': 6.0,  //M - B
        '81': 7.0,  //Q - C
        '50': 7.5, //2 - C#
        '87': 8.0,  //W - D
        '51': 8.5, //3 - D#
        '69': 9.0,  //E - E
        '82': 10.0,  //R - F
        '53': 10.5, //5 - F#
        '84': 11.0,  //T - G
        '54': 11.5, //6 - G#
        '89': 12.0,  //Y - A
        '55': 12.5, //7 - A#
        '85': 13.0,  //U - B
    }

    const dots = {
        '90': document.getElementById('dot'),  //Z - C
        '83': document.getElementById('dot2'), //S - C#
        '88': document.getElementById('dot3'),  //X - D
        '68': document.getElementById('dot4'), //D - D#
        '67': document.getElementById('dot5'),  //C - E
        '86': document.getElementById('dot6'),  //V - F
        '71': document.getElementById('dot7'), //G - F#
        '66': document.getElementById('dot8'),  //B - G
        '72': document.getElementById('dot9'), //H - G#
        '78': document.getElementById('dot10'),  //N - A
        '74': document.getElementById('dot11'), //J - A#
        '77': document.getElementById('dot12'),  //M - B
        '81': document.getElementById('dot13'),  //Q - C
        '50': document.getElementById('dot14'), //2 - C#
        '87': document.getElementById('dot15'),  //W - D
        '51': document.getElementById('dot16'), //3 - D#
        '69': document.getElementById('dot17'),  //E - E
        '82': document.getElementById('dot18'),  //R - F
        '53': document.getElementById('dot19'), //5 - F#
        '84': document.getElementById('dot20'),  //T - G
        '54': document.getElementById('dot21'), //6 - G#
        '89': document.getElementById('dot22'),  //Y - A
        '55': document.getElementById('dot23'), //7 - A#
        '85': document.getElementById('dot24'),  //U - B
    }
    window.addEventListener('keydown', keyDown, false);
    window.addEventListener('keyup', keyUp, false);

    activeOscillators = {}
    activeGains = {}

    function keyDown(event) {
        const key = (event.detail || event.which).toString();
        if (keyboardFrequencyMap[key] && !activeOscillators[key]) {
            const dot = dots[key];
            console.log(dot.style.left);
            dot.style.top = "690px";
            if(positionMap[key]%1 != 0){
                dot.style.top = "405px";
            }
            value = 25 + (positionMap[key] * 107)
            dot.style.left = value + "px";
            console.log("positionMap[key]", positionMap[key])
            dot.style.display = 'block';
            playNote(key);

        }
    }

    function keyUp(event) {
        const key = (event.detail || event.which).toString();
        if (keyboardFrequencyMap[key] && activeOscillators[key]) {
            releaseStep(key);
            const dot = dots[key];
            console.log("here!");
            dot.style.display = 'none';
        }
    }

    function playNote(key) {
        if(activeOscillators[key]){
            releaseStep(key);
        }
        
        const osc = audioCtx.createOscillator();
        const wave = waveform.value;
        osc.type = wave //choose your favorite waveform

        //Follow the instructions here
        const gainNode = audioCtx.createGain(); //this will control the volume of all notes
        osc.frequency.setValueAtTime(keyboardFrequencyMap[key], audioCtx.currentTime)

        gainNode.gain.setValueAtTime(0.001, audioCtx.currentTime)
        osc.connect(gainNode).connect(audioCtx.destination);
        

        //gainNode.gain.exponentialRampToValueAtTime(0.5, audioCtx.currentTime + 0.001);
        gainNode.gain.setTargetAtTime(0.4, audioCtx.currentTime + 0.01, 0.2);

        //
        //osc.connect(audioCtx.destination)
        osc.start();
        activeOscillators[key] = osc;
        activeGains[key] = gainNode;
        //
        
        length = object.keys.activeGains[key].length + 1;
        Object.keys(activeGains).forEach(function(key){
            activeGains[key].gain.setTargetAtTime(0.4 / length,audioCtx.currentTime + 0.01,0.2); 
        })
        
        gainNode.gain.exponentialRampToValueAtTime(0.5/ length,audioCtx.currentTime + 0.02); 
        gainNode.gain.setTargetAtTime(0.4/ length,audioCtx.currentTime + 0.01,0.2); 
    }


    function releaseStep(key){
        //const releaseTime = audioCtx.currentTime + 0.1; 

        activeGains[key].gain.cancelScheduledValues(audioCtx.currentTime);
        activeGains[key].gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.1);
        activeGains[key].gain.setTargetAtTime(0.001, audioCtx.currentTime, 0.01); 

        setTimeout(function(){
            activeOscillators[key].stop(audioCtx.currentTime + 0.2); 
            delete activeOscillators[key];
            delete activeGains[key]; 
        }, 100)
    }

})
