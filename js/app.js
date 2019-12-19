import StartAudioContext from '../assets/StartAudioContext.js'

Vue.use(Buefy.default)

Vue.prototype.$midiBus = new Vue(); // Global event bus

import pitchTable from './components/pitch-table.js'
import {midiBus} from './components/midi-bus.js'

const ct = new Vue({
  el:"#pitch-app",
  components:{
    pitchTable,
    midiBus,
  },
  data: {
    channels:{},
  },
  mounted: function() {
    if (
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      )
    ) {
      StartAudioContext(Tone.context, "button").then(function() {});
    }
  }

})
