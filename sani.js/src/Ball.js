import { WebMidi } from 'webmidi'
class Ball {

   constructor(color, id = 0) {

      this.id = id
      this.position = { x: NaN, y: NaN }
      this.color = color
      this.canvas = null
      this.animations = []
      this.animationAt = -1
      this.elapsed = 0
      this.midi = {
         note: 0,
         channel: id+1,
         velocity: 0,
         noteOn: false,
      }
   }

   update(delta, reset = false) {

      const { animations } = this

      if (reset) {
         this.animationAt = -1
         this.elapsed = 0
      }

      this.elapsed += delta

      let animation = animations[this.animationAt]
      // send midiOn on animation.type throw
      
      // console.log(WebMidi.getOutputByName("IAC Driver Bus 1"));
      if (animation.type === "throw" && !this.midi.noteOn) {
         this.midi.noteOn = true;
         this.midi.velocity = 127;
         this.midi.note = this.id + 40;
         if (WebMidi.enabled) {
            const output = WebMidi.getOutputByName("IAC Driver Bus 1").channels[this.midi.channel];
            if (output) {
               output.playNote(this.midi.note);
            }
         }
         console.log('%c Ball! 🎱 %s', 'color: '+this.color+'; background: #222; font-size: 12px;', this.midi.noteOn ? 'noteON' : 'noteOFF');
         document.getElementById('midi-output').innerHTML += `<span style="color: ${this.color};">Ball! 🎱 noteON ${this.midi.note}</span> `;
         document.getElementById('midi-output').innerHTML += `<br>`;
      }
      // send midiOff on animation.type catch
      if (animation.type === "catch" && this.midi.noteOn) {
         this.midi.noteOn = false;
         this.midi.velocity = 0;
         this.midi.note = this.id + 40;
         if (WebMidi.enabled) {
            const output = WebMidi.getOutputByName("IAC Driver Bus 1").channels[this.midi.channel];
            if (output) {
               output.stopNote(this.midi.note);
            }
         }
         console.log('%c Ball! 🎱 %s', 'color: '+this.color+'; background: #222; font-size: 12px;', this.midi.noteOn ? 'noteON' : 'noteOFF');
         document.getElementById('midi-output').innerHTML += `<span style="color: ${this.color};">Ball! 🎱 noteOFF ${this.midi.note}</span> `;
         //to previous add a break
         document.getElementById('midi-output').innerHTML += `<br>`;
      }

      while (this.elapsed >= animation.duration) {
         this.animationAt = (this.animationAt + 1) % animations.length
         this.elapsed -= animation.duration
         animation = animations[this.animationAt]
      }

      this.position = animation.getPosition(this.elapsed)

   }

   draw(context, settings, position) {

      const { ballRadius, multiplier } = settings
      const { canvas } = this

      if (!position) {
         position = {
            x: this.position.x * multiplier,
            y: this.position.y * multiplier
         }
      }

      if (canvas) {
         const center = canvas.width / 2
         context.drawImage(canvas, position.x - center, position.y - center)
      }
      else {
         const radius = ballRadius * multiplier
         context.beginPath()
         context.arc(position.x, position.y, radius, 0, Math.PI * 2)
         context.fillStyle = this.color
         context.globalAlpha = 0.9
         context.fill()
         context.closePath()
      }

   }

}

export { Ball }

