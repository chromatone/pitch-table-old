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
			mouse: {x:0, y:0},
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
				@mousedown.prevent="mouseDown"
				@touchmove="move"
		    @touchstart="tap"
				@touchend="untap"
				:class="{'active-cell':active}"
				>
			<div class="level" :style="{height:gain*100+'%'}"></div>
			<cell-content
				:note="note"
				:octave="octave"
				:frequency="frequency"></cell-content>

	</td>
	`,
	methods:{
		mouseDown(ev) {
			this.startContext();
			this.mouse.x=ev.pageX;
			this.mouse.y=ev.pageY;
			this.moved=false;
			document.onmousemove = this.mouseMove;
			document.onmouseup = this.mouseUp;
		},
		mouseMove(ev) {
			let {pageX,pageY} = ev;
			let dy=this.mouse.y-pageY;
			if (Math.abs(dy)>1) {this.moved=true}
			let dys = dy/5000
			if (this.gain+dys<0) {
				this.gain=0
				this.mouse.y=pageY
			} else if (this.gain+dys>1) {
				this.gain=1
				this.mouse.y=pageY
			} else {
				this.gain=this.gain+dys
			}
		},
		mouseUp(ev){
			if (this.active && !this.moved) {this.gain=0}
			document.onmouseup = undefined;
      document.onmousemove = undefined;
		},
		tap(ev) {
			this.startContext();
			for (let i=0; i<ev.changedTouches.length; i++) {
				let touch = ev.changedTouches[i];
				this.activeTouches[touch.identifier]=this.copyTouch(touch)
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
					let dys = dy/5000
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
		startContext() {
			if (Tone.context.state=='suspended') {
					Tone.context.resume()
			}
			if (!this.started) {
				this.osc.start();
				this.started=true;
			}
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
			this.osc.volume.targetRampTo(Tone.gainToDb(val),1)
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
