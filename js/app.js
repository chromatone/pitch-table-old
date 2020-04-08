import pitchTable from './components/pitch-table.js'
import controlRow from './components/control-row.js'

const ct = new Vue({
  el:"#pitch-app",
  components:{
    pitchTable,
    controlRow,
  },
  data: {
    channels:{},
    params:{
      oscType:'sawtooth',
      tuning:'equal',
      rootFreq:440,
      filterFreq: 350,
    },
  },
  methods: {
  
  }
})
