# Siteswap to MIDI web app

Clone and run [index.html](webapp/index.html) in your browser (supported and tested in Chrome).

**Note:** You need to leave the browser open in order to play the MIDI notes.

# Setup and build

To build the app you need to have [Node.js](https://nodejs.org/en/) installed.

Install yarn globally with `npm install -g yarn`.\
Go to sani.js folder and run `yarn` to install dependencies.\
Then run `yarn build` to build the app.

Then you can run the webapp [index.html](webapp/index.html).
## Setup MIDI device

To adjust MIDI device edit [midi.js](sani.js/src/midi.js) and change the `midiDriver` variable and build.

## Setup MIDI notes and channels

To adjust MIDI notes and channels edit [midi.js](sani.js/src/Ball.js) and change the `midi` variables in the Ball object and build.

# Contribution
Based on [`sani.js`](https://github.com/neunato/sani.js) by Jan Ivica.