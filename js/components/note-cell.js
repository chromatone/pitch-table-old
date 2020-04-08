import cellContent from './cell-content.js'

export default {
	props:['note','octave','root', 'tuning','type','filter'],
	components:{
		cellContent,
	},
	data() {
		return {
			active:false,
			started:false,
			justCents:[0,112,204,316,386,498,590,702,814,884,1017,1088],
			activeTouches:{},
			gain:0,
			osc:new Tone.Oscillator(440, this.type),
		}
	},
	mounted() {
		this.osc.frequency.value=this.frequency;
		this.osc.volume.value=-Infinity;
		this.osc.connect(this.filter.input);
	},
	template:`
	<td	class="note-button"
				:style="{backgroundColor:color, color:textColor}"
				@mousedown.prevent=""
				@touchmove="move"
		    @touchstart="tap"
				@touchend="untap"
				@dblclick="reset()"
				:class="{'active-cell':active}"
				>

			<cell-content
				:note="note"
				:octave="octave"
				:frequency="frequency"></cell-content>

	</td>
	`,
	methods:{
		tap(ev) {
			if (Tone.context.state=='suspended') {
					Tone.context.resume()
			}
			for (let i=0; i<ev.changedTouches.length; i++) {
				let touch = ev.changedTouches[i];
				this.activeTouches[touch.identifier]=this.copyTouch(touch)
			}
			if (!this.started) {
				this.osc.start();
				this.started=true;
			}
		},
		untap() {
			if (this.active && !this.moved) {
				this.gain=0;
			}
			if (this.moved) {
				this.moved=false;
			}
		},
		move(ev) {
			for (let i=0; i<ev.changedTouches.length; i++) {
				let touch = this.copyTouch(ev.changedTouches[i]);
				let prevTouch = this.activeTouches[touch.identifier];
				if (!prevTouch) { continue }
				this.moved=true;
				let dx=touch.pageX-prevTouch.pageX;
				let dy=-touch.pageY+prevTouch.pageY;
				if(Math.abs(dy)+3>Math.abs(dx)) {
					let dys = dy/1000
					ev.preventDefault();
					if (this.gain+dys<0) {
						this.gain=0
						prevTouch.pageY=touch.pageY
					} else if (this.gain+dys>1) {
						this.gain=1
						prevTouch.pageY=touch.pageY
					} else {
						this.gain=this.gain+dys
					}
					prevTouch.pageX=touch.pageX
				}
			}
		},
		reset() {
			this.gain=0
		},
		refresh() {
			if(this.osc) {
				this.osc.frequency.setValueAtTime(this.calcFreq(this.note.pitch, this.octave),Tone.context.currentTime)
			}
		},
		copyTouch(touch) {
			return { identifier: touch.identifier, pageX: touch.pageX, pageY: touch.pageY };
		},
		calcFreq(pitch, octave=3, root=this.root, tuning) {
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
	computed: {
		frequency() {
			return this.calcFreq(this.note.pitch, this.octave)
		},
		textColor() {
			if (Math.abs(this.octave+2)*8>40) {
				return 'hsla(0,0%,0%,'+(this.active  ? '1' : '0.8')+')'
			} else {
				return 'hsla(0,0%,100%,'+(this.active  ? '1' : '0.8')+')'
			}
		},
		color() {
			return 'hsla('+this.note.pitch*30+','+ (this.active  ? '100' : '75') +'%,'+Math.abs(this.octave+2)*8+'%)'
		}
	},
	watch: {
		gain(val) {
			this.osc.volume.value = Tone.gainToDb(val)
			if (val==0) {this.active=false} else {
				this.active=true;
			}
		},
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
}
