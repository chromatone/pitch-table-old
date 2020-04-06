import noteCell from './note-cell.js'

export default {
	props:['oscType','tuning','filterFreq','rootFreq'],
	components: {
		noteCell,
	},
	template: `
	<div >

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
      oscTypes:['sine','triangle','sawtooth','square'],
      sound:false,
      started:false,
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
