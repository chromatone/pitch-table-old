export default {
	props:['note','octave','root', 'tuning','type','filter'],
	data() {
		return {
			active:false,
			started:false,
			justCents:[0,112,204,316,386,498,590,702,814,884,1017,1088],
			activeTouches:{},
			gain:0,
			volume: new Tone.Volume(-Infinity),
		}
	},
	mounted() {
		this.volume.connect(this.filter.input);
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
	template:`
	<td	class="note-button"
				:style="{backgroundColor:color, color:textColor}"
				@mousedown.prevent=""
				@touchmove="move(event,octave+note.name)"
		    @touchstart="activate(event,octave+note.name)" @dblclick="reset()"
				:class="{'active-cell':active}"
				>
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

	</td>
	`,
	methods:{
		copyTouch(touch) {
		  return { identifier: touch.identifier, pageX: touch.pageX, pageY: touch.pageY };
		},
		activate(ev,note) {
			for (let i=0; i<ev.changedTouches.length; i++) {
				let touch = ev.changedTouches[i];
				this.activeTouches[touch.identifier]=this.copyTouch(touch)
			}
		},
		move(ev) {
			for (let i=0; i<ev.changedTouches.length; i++) {
				let touch = this.copyTouch(ev.changedTouches[i]);
				let prevTouch = this.activeTouches[touch.identifier];
				if (prevTouch) {
					let dx=touch.pageX-prevTouch.pageX;
					let dy=-touch.pageY+prevTouch.pageY;
					if(Math.abs(dy)>Math.abs(dx)) {
						ev.preventDefault();
						console.log(this.note.name+this.octave,dy/100,dx)
						prevTouch=touch
					}

				}
			}
		},
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

					this.osc.connect(this.volume);
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
