import sqnob from './sqnob.js'

export default {
	props:['oscType','tuning','filterFreq','rootFreq', 'vol'],
	components: {
		sqnob,
	},
	data() {
		return {
			oscTypes:['sine','triangle','sawtooth','square'],
			tuningTypes:['equal','just'],
		}
	},
	template: `
	<div class="control-row">

		<sqnob :value="vol" @input="emitVol" unit="" param="VOL" :step="0.01" :min="0" :max="1"></sqnob>

		<sqnob :value="filterFreq" @input="emitFilter" unit="Hz" param="LOWPASS" :step="1" :min="20" :max="25000"></sqnob>

		<div>
			Waveform<br>
			<button :class="{active:oscType==type}" @click="$emit('update:oscType',type)" :key="type" v-for="type in oscTypes">
				<img height="16" :src="'svg/'+type+'.svg'">
			</button>
		</div>
		<div>
			Tuning<br>
			<button :class="{active:tuning==type}" v-for="type in tuningTypes" :key="type" @click="$emit('update:tuning',type)">
				{{type.toUpperCase()}}
			</button>
		</div>

			<sqnob :value="rootFreq" @input="emitRoot" unit="Hz" param="A4 FREQ" :step="1" :min="415" :max="500"></sqnob>



	</div>`,
	methods: {
		emitVol(value) {
			this.$emit('update:vol',value)
		},
		emitFilter(value) {
			this.$emit('update:filterFreq',value)
		},
		emitRoot(value) {
			this.$emit('update:rootFreq',value)
		}
	}
}
