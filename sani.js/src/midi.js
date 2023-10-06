import { WebMidi } from 'webmidi'

const midiDriver = "IAC Driver Bus 1";

export const midiInit = () => {
   console.log('init midi');
   WebMidi.enable(function (err) {
    if (err) {
      console.log("WebMidi could not be enabled.", err);
    } else {
      console.log("WebMidi enabled!");
      WebMidi.outputs.forEach(output => console.log(output.manufacturer, output.name));
    }
  });
}

export const ballEvent = ball => {
    if (WebMidi.enabled) {
        const output = WebMidi.getOutputByName(midiDriver).channels[ball.midi.channel];
        if (output) {
           ball.midi.noteOn ? output.playNote(ball.midi.note) : output.stopNote(ball.midi.note);
        }
     }
     outputBallEvent(ball);
}

const outputBallEvent = (ball) => {
    console.log('%c Ball! 🎱 %s %s', 'color: '+ball.color+'; background: #222; font-size: 12px;', ball.midi.noteOn ? 'noteON' : 'noteOFF', ball.midi.note);
    document.getElementById('midi-output').innerHTML += `<span style="color: ${ball.color};">Ball! 🎱 ${ball.midi.noteOn ? 'noteON' : 'noteOFF'} ${ball.midi.note}</span> `;
    document.getElementById('midi-output').innerHTML += `<br>`;
}