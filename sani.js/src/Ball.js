import { ballEvent } from './midi'
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
         note: 40 + id,
         channel: id + 1,
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

      if (animation.type === "throw" && !this.midi.noteOn) {
         this.midi.noteOn = true;
         ballEvent(this);
      }
      if (animation.type === "catch" && this.midi.noteOn) {
         this.midi.noteOn = false;
         ballEvent(this);
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

