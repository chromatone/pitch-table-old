export default {
	template:`
	<td	class="note-button"
				:style="{backgroundColor:color, color:textColor}"
				@click="toggle()"
				:class="{'active-cell':active}"
				>
		<div class="note-grid">

			<div class="begin">
				{{note.name}}<br />{{octave}}
			</div>
			<div class="note-freq">
				{{frequency}}&nbsp;Hz
			</div>
			<div class="note-freq">
				{{bpm}}&nbsp;BPM
			</div>

		</div>

	</td>
	`,
	props:['note','octave','root', 'tuning','type','filter'],
	data() {
		return {
			active:false,
			started:false,
			justCents:[0,112,204,316,386,498,590,702,814,884,1017,1088],
		}
	},
	computed: {
		frequency() {
			return this.calcFreq(this.note.pitch, this.octave)
		},
		bpm() {
			return (this.frequency*60).toFixed(1)
		},
		textColor() {
			if (Math.abs(this.octave+2)*8>40) {
				return 'hsla(0,0%,0%,'+(this.active  ? '1' : '0.8')+')'
			} else {
				return 'hsla(0,0%,1000%,'+(this.active  ? '1' : '0.8')+')'
			}
		},
		color() {
			return 'hsla('+this.note.pitch*30+','+ (this.active  ? '100' : '75') +'%,'+Math.abs(this.octave+2)*8+'%)'
		}
	},
	watch: {
		root() {
			this.refresh()
		},
		tuning() {
			this.refresh()
		},
		type(val) {
			if(this.osc) {
				this.osc.type=val;
			}
		}
	},
	methods:{
		refresh() {
			if(this.osc) {
				this.osc.frequency.setValueAtTime(this.calcFreq(this.note.pitch, this.octave),Tone.context.currentTime)
			}
		},
		toggle() {
			if(!this.active) {
				if(Tone.context.state=='suspended') {Tone.context.resume()}

					this.osc = Tone.context.createOscillator();
					this.osc.type=this.type;
					this.osc.frequency.value=this.frequency;

					this.osc.connect(this.filter.input);
					this.osc.start();
					this.started=true;

				this.active=true;
			} else {
				this.active=false;
				this.osc.stop();
				this.osc.disconnect();
			}
		},
		calcFreq(pitch, octave=3, root=this.root) {
			let hz=0;
			if (this.tuning=='equal') {
				hz = Number(root * Math.pow(2, octave - 4 + pitch / 12)).toFixed(2)
			}
			if(this.tuning=='just') {
				let diff = Number(Math.pow((Math.pow(2,1/1200)),this.justCents[pitch]));
				hz = Number(root*Math.pow(2,(octave-4))*diff).toFixed(2)

			}
			 return hz
		},
	}
}
