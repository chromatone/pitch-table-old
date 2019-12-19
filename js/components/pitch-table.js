import sqnob from '../sqnob.js'
import noteCell from './note-cell.js'

export default {
	components: {
		noteCell,
		sqnob
	},
	template: `  <div id="pitch-table">

	<div class="control-row">
	<div>
		<h3>Intonation</h3>
		<b-field grouped group-multiline  >

			<b-radio-button  size="is-small" native-value="equal" v-model="tuning" >EQUAL</b-radio-button>
			<b-radio-button  size="is-small" native-value="just" v-model="tuning">JUST</b-radio-button>
		</b-field>
	</div>
	<div>
		<h3>Oscillator type</h3>
		<b-field grouped group-multiline>
			<b-radio-button :key="type"  size="is-small" v-for="type in oscTypes"
				:native-value="type" v-model="oscType">{{type}}</b-radio-button>
		</b-field>
	</div>
	<div>
		<h3>Filter</h3>
		<b-field>
			<sqnob v-model="filterFreq" unit=" Hz" param="LP FILTER" :step="1" :min="20" :max="25000"></sqnob>
		</b-field>
	</div>

	<div>
		<h3>A4, Hz</h3>
		<b-field>
			<sqnob v-model="rootFreq" unit=" Hz" param="FREQUENCY" :step="1" :min="415" :max="500"></sqnob>
		</b-field>
	</div>


	</div>

		<div class="table-holder">
			<table class="pitch-table">
				<tr v-for="note in reversedNotes" class="note-block" >
					<td is="note-cell" v-for="octave in octaves" :key="octave" :root="rootFreq" :note="note" :octave="octave" :tuning="tuning" :filter="filter" :type="oscType"></td>
				</tr>
			</table>
		</div>
	</div>`,
	data() {
    return {
      notes:[
						  {
						    name: "A",
						    pitch: 0,
						  },
						  {
						    name: "A#",
						    pitch: 1,
						  },
						  {
						    name: "B",
						    pitch: 2,
						  },
						  {
						    name: "C",
						    pitch: 3,
						  },
						  {
						    name: "C#",
						    pitch: 4,
						  },
						  {
						    name: "D",
						    pitch: 5,
						  },
						  {
						    name: "D#",
						    pitch: 6,
						  },
						  {
						    name: "E",
						    pitch: 7,
						  },
						  {
						    name: "F",
						    pitch: 8,
						  },
						  {
						    name: "F#",
						    pitch: 9,
						  },
						  {
						    name: "G",
						    pitch: 10,
						  },
						  {
						    name: "G#",
						    pitch: 11
						  }
			],
      octaveRange:[-6,9],
      frequency:1,
      oscType:'sawtooth',
      oscTypes:['sine','triangle','sawtooth','square'],
      tuning:'equal',
      sound:false,
      started:false,
      rootFreq:440,
			filterFreq: 350,
      osc:'',
			filter: new Tone.AutoFilter()
	  }
  },
	computed: {
		reversedNotes() {
			let notes=[...this.notes]
			return notes.reverse();
		},
		octaves() {
			let octaves=[];
			for(let i=this.octaveRange[0];i<=this.octaveRange[1];i++) {
				octaves.push(i)
			}
			return octaves
		}
	},
	methods: {

	},
	watch: {
		frequency() {
			this.osc && this.osc.frequency.setValueAtTime(this.frequency,Tone.context.currentTime)
		},
		filterFreq (val) {
			this.filter.filter.frequency.setValueAtTime(val);
		}
	},
	mounted() {
    this.filter.toMaster();
  },
  beforeDestroy() {
		this.filter.disconnect();
	}
}
