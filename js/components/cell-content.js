export default {
  name:'cell-content',
  props:['note','octave','frequency'],
  data() {
    return {
    }
  },
  template:`
  	<div class="note-grid">
      <div class="begin">
        {{note.name}}<br />{{octave}}
      </div>
      <div class="note-freq">
        {{frequency | round}}&nbsp;Hz
      </div>
      <div class="note-freq">
        {{bpm | round}}&nbsp;BPM
      </div>
    </div>
  `,
  computed: {
    bpm() {
      return (this.frequency*60).toFixed(1)
    },
  },
  filters: {
    round(value) {
      if (value>1e6) {
        value = (value/1e6).toFixed(2) + 'M'
      }
      if (value>1e3) {
        value = (value/1e3).toFixed(2) + 'k'
      }
      return value
    }
  },
}
