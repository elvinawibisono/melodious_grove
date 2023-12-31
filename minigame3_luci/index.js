const audioCtx2 = new (window.AudioContext || window.webkitAudioContext)();
const waveform = document.getElementById("waveform");
//const dot = document.getElementById('dot');

var audioCtx;
var osc;
var timings;
var generatedNotes = [];
const playButton = document.getElementById('playButton');

var level = 1;

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

const indexToFreq = {
    1: '90',  //Z - C
    2: '83', //S - C#
    3: '88',  //X - D
    4: '68', //D - D#
    5: '67',  //C - E
    6: '86',  //V - F
    7: '71', //G - F#
    8: '66',  //B - G
    9: '72', //H - G#
    10: '78',  //N - A
    11: '74', //J - A#
    12: '77',  //M - B
    13: '81',  //Q - C
    14: '50', //2 - C#
    15: '87',  //W - D
    16: '51', //3 - D#
    17: '69',  //E - E
    18: '82',  //R - F
    19: '53', //5 - F#
    20: '84',  //T - G
    21: '54', //6 - G#
    22: '89',  //Y - A
    23: '55', //7 - A#
    24: '85',  //U - B
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

//Generation code

function initAudio() {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)
    osc = audioCtx.createOscillator();
    timings = audioCtx.createGain();
    timings.gain.value = 0;
    osc.connect(timings).connect(audioCtx.destination);
    osc.start();
    scheduleAudio()
}

function scheduleAudio() {
    let timeElapsedSecs = 0;
    generatedNotes.forEach(noteData => {
        timings.gain.setTargetAtTime(1, audioCtx.currentTime + timeElapsedSecs, 0.01)
        osc.frequency.setTargetAtTime(noteData, audioCtx.currentTime + timeElapsedSecs, 0.01)
        timeElapsedSecs += 1;
        timings.gain.setTargetAtTime(0, audioCtx.currentTime + timeElapsedSecs, 0.01)
        timeElapsedSecs += 0.2; //rest between notes
    });
    setTimeout(scheduleAudio, timeElapsedSecs * 1000);
}

function generateRandomNotes() {
    numNotes = 5
    if(level == 2){
        numNotes = 10
    }
    if(level == 3){
        numNotes = 24
    }
    notes = []
    for (var i = 0; i < 7; i++) {
        var randomValue = Math.floor(Math.random() * (numNotes)) + 1;
        notes.push(indexToFreq[randomValue]);
        }
    return notes;
}

function genAudio(data) {
    generatedNotes = data;
}

function generatePattern() {
    var data = generateRandomNotes();
    console.log("Notes generated: ", data)
    genAudio(data);
}

playButton.addEventListener('click', function () {
    if (!audioCtx) {
        initAudio();
    }
    generatePattern();
});


    // end generation