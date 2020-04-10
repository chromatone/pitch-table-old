
export default {
  template: `
  <div
    :class="{active:active}"
    @mousedown.prevent="mouseDown"
    @touchstart.prevent="activate"
    @dblclick="reset()"
    class="sqnob">
    <div class="num">{{value | round}}</div>
    <div class="info">
      {{param}}
    </div>
    <div class="value" :style="{height:internalValue+'%'}"></div>
  </div>
  `,
  props: ["max", "min", "value", "step", "param","unit","log"],
  data() {
    return {
      internalValue: this.mapInput(this.value),
      initialValue: this.mapInput(this.value),
      logValue: 0,
      active: false,
      initialX: undefined,
      initialY: undefined,
      initialDragValue: undefined,
      shiftPressed: false,
      activeTouch:undefined,
    };
  },
  watch: {
    value: function(newVal) {
      this.internalValue = this.mapInput(newVal)
    }
  },
  filters: {
    round(val) {
      return val.toFixed(1);
    }
  },
  methods: {
    mouseDown(ev) {
			this.initialX=ev.pageX;
			this.initialY=ev.pageY;
      this.active = true;
      this.initialDragValue = this.internalValue;
			document.onmousemove = this.mouseMove;
			document.onmouseup = this.mouseUp;
		},
		mouseMove(ev) {
			let {pageY} = ev;
			let diff = 2;
      if (this.shiftPressed) { diff=10 }
      this.internalValue = this.initialDragValue + (this.initialY - pageY) / diff;
      if (this.internalValue > 100) this.internalValue = 100;
      if (this.internalValue < 0) this.internalValue = 0;
      if (isNaN(this.internalValue)) this.internalValue = this.initialDragValue;
      this.$emit( "input", this.mapOutput(this.internalValue) );
		},
		mouseUp(ev){
			document.onmouseup = undefined;
      document.onmousemove = undefined;
      this.active = false;
		},
    reset() {
      this.internalValue=this.initialValue;
      this.$emit("input", this.mapOutput(this.internalValue) );
    },
    mapInput(value) {
      return mapNumber(value, this.min, this.max, 0, 100, this.step)
    },
    mapOutput(value) {
      return mapNumber(value, 0, 100, this.min, this.max, this.step)
    },
    activate(ev) {
      this.activeTouch = ev.changedTouches[0].identifier
      this.initialY = ev.changedTouches[0].pageY;
      this.active = true;
      this.initialDragValue = this.internalValue;
      document.addEventListener("touchend", this.deactivate);
      document.addEventListener("touchmove", this.dragHandler);
    },
    dragHandler(ev) {
      let theTouch;
      for (let touch of ev.changedTouches) {
        if (touch.identifier==this.activeTouch) {
          theTouch=touch
        }
      }
      let {pageY} = theTouch;
      let diff = 2;
      if (this.shiftPressed) { diff=10 }
      this.internalValue = this.initialDragValue + (this.initialY - pageY) / diff;
      if (this.internalValue > 100) this.internalValue = 100;
      if (this.internalValue < 0) this.internalValue = 0;
      if (isNaN(this.internalValue)) this.internalValue = this.initialDragValue;
      this.$emit( "input", this.mapOutput(this.internalValue) );
    },
    deactivate() {
      document.removeEventListener("touchmove", this.dragHandler);
      document.removeEventListener("touchend", this.deactivate);
      this.active = false;
    }
  },
  created() {
    document.addEventListener("keydown", e => {
      if (e.key == "Shift") this.shiftPressed = true;
    });
    document.addEventListener("keyup", e => {
      if (e.key == "Shift") this.shiftPressed = false;
    });
  },
  beforeDestroy() {
    document.removeEventListener('keydown')
    document.removeEventListener('keyup')
  }
}

function mapNumber(value, inputmin=0, inputmax=100, rangemin=0, rangemax=100, step) {
  rangemax = parseFloat(rangemax);
  rangemin = parseFloat(rangemin);
  inputmax = parseFloat(inputmax);
  inputmin = parseFloat(inputmin);
  let result = (value - inputmin) * (rangemax - rangemin) / (inputmax - inputmin) + rangemin;
  return result * (step || 100) / (step || 100);
}
