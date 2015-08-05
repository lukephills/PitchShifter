import PitchShifter = require('./PitchShifter');
import Tone = require("./Tone");



const tone = new Tone();
/*const audioContext = tone.au*/
const pitchShift = new PitchShifter(tone.audioContext);

var osc = tone.audioContext.createOscillator();
var gain = tone.audioContext.createGain();
gain.gain.value = 0.3;
osc.connect(pitchShift.input);
pitchShift.output.connect(gain);
gain.connect(tone.audioContext.destination);
osc.start();

setInterval(()=> {
    pitchShift.PitchOffset = getRandomArbitrary(-1, 1)
}, 1000);


function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}
