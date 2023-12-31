
<template>
   <transition appear appear-class="intro-enter" appear-active-class="intro-enter-active">
      <div id="app">
         <nav :class="{ collapsed }">
            <app-siteswap @update:siteswap="siteswap = arguments[0]"></app-siteswap>
            <app-settings @update:settings="settings = arguments[0]" @update:collapsed="collapsed = arguments[0]"></app-settings>
         </nav>

         <main @mousedown.left="pause()" :style="{ 'width': right }">
            <canvas id="animator-canvas" ref="canvas"></canvas>
            <app-resize @update:resize="resize = arguments[0]"></app-resize>
         </main>
         <!-- insert output of midi messages from sani.js into textarea -->
         <div id="midi-output-wrapper">
            <div id="midi-output"></div>
         </div>
      </div>
   </transition>
</template>


<script>

import AppSiteswap from "./app-siteswap.vue"
import AppSettings from "./app-settings.vue"
import AppResize   from "./app-resize.vue"

const _balls = Symbol.for("balls")


export default {

   components: {
      AppSiteswap,
      AppSettings,
      AppResize
   },

   data: () => ({
      animator: null,         // Animator instance.
      siteswap: null,         // Siteswap instance, forwarded by AppSiteswap component.
      settings: {},           // Animator settings, forwarded by AppSettings component.
      collapsed: null,        // Boolean showing if settings are collapsed.
      resize: null            // X coordinate of resize line.
   }),

   computed: {
      right(){
         return (window.innerWidth - this.resize) + 'px'
      }
   },

   mounted(){

      // Once our canvas is ready, we create and start the animator.
      this.animator = new Animator(this.$refs.canvas, this.settings)
      this.juggle()

      //bind this 

      document.addEventListener("keypress", (e) => {

         // Restart juggling on enter.
         if( e.keyCode === 13 ){
            this.juggle()
         }
         
         // Toggle pause on space.
         else if( e.keyCode === 32 && document.activeElement.tagName !== "INPUT" ){
            this.pause()
         }
      })
   },

   methods: {

      juggle(){
         try{
            this.animator.play(this.siteswap)
         } catch(e){}
      },

      pause(){
         if (this.animator.paused)
            this.animator.play()
         else
            this.animator.pause()
      }

   },
   
   watch: {

      // Update animator whenever siteswap changes.

      siteswap( siteswap, old ){

         if( !this.animator )
            return

         if( siteswap && siteswap.valid && siteswap.equals(old) )
            return

         this.juggle()

      },

      // Update animator whenever settings change.

      settings( settings, old ){

         if( !this.animator )
            return

         this.animator.configure(settings)

         // Not all settings require a restart.
         const changed = Object.keys(settings).filter( key => settings[key] !== old[key] )
         const restart = changed.some(key => key !== "ballColor" && key !== "slowdown")

         if( !restart ){
            if( changed.includes("ballColor") )
               this.animator[_balls].forEach((ball, index)=> {
                  ball.color = '#'+Math.floor(Math.random()*16777215).toString(16);
               });
            return
         }

         this.juggle()

      }

   }

}

</script>