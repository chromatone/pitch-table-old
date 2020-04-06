import sqnob from './sqnob.js'

export default {
	props:['oscType','tuning','filterFreq','rootFreq'],
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
	<div>
		<h3>Intonation</h3>

			<button :class="{active:tuning==type}" v-for="type in tuningTypes" :key="type" @click="$emit('update:tuning',type)">
				{{type.toUpperCase()}}
			</button>

	</div>
	<div>
		<h3>Oscillator type</h3>

		<button :class="{active:oscType==type}" @click="$emit('update:oscType',type)" :key="type" v-for="type in oscTypes">

			<img height="16" :src="'svg/'+type+'.svg'">

		</button>



	</div>
	<div>
		<h3>Filter</h3>

			<sqnob :value="filterFreq" @input="emitFilter" unit=" Hz" param="LP FILTER" :step="1" :min="20" :max="25000"></sqnob>

	</div>

	<div>
		<h3>A4, Hz</h3>

			<sqnob :value="rootFreq" @input="emitRoot" unit=" Hz" param="FREQUENCY" :step="1" :min="415" :max="500"></sqnob>

	</div>

	</div>`,
	methods: {
		emitFilter(value) {
			this.$emit('update:filterFreq',value)
		},
		emitRoot(value) {
			this.$emit('update:rootFreq',value)
		}
	}
}
