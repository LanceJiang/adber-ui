<script lang="jsx">
import Draggable from 'vuedraggable'
import Icon from '@adber/adber-ui/packages/Icon'
import Locale from '@adber/adber-ui/src/mixins/locale'

export default {
  name: 'AdDraggableNest',
  mixins: [Locale],
  components: {
    Draggable,
    Icon
  },
  props: {
    level: {
      type: Number,
      default: 0
    },
    value: {
      required: false,
      type: Array,
      default: null
    },
    list: {
      required: false,
      type: Array,
      default: null
      /** default: {
        t_label: String, // 多语言关键key
        label?: String, // 若不存在t_label 可使用 label
        prop: String, // 用于 作为唯一值鉴定用
        // checked: Boolean, // 当前配置 是否选中(主要用于 后期有children 的情况)
        fixed?: Boolean||String, // fixed 的不允许删除 disabled
        children?: Option[] // 同上配置
      }[] */
    },
    // todo: 扩展预设 设置定位(置顶/底)
    setFixed: {
      type: Function,
      default: (...args) => {}
    },
    removeHandler: {
      type: Function,
      default: (item, index, inputs) => {
        console.error(item, index, inputs, 'removeHandler')
        // if (!item.fixed) {
        //   inputs.splice(index, 1)
        //   this.$emit('input', inputs)
        // }
      }
    },
    move: {
      type: Function,
      default: (...args) => { console.error(args, 'move') }
    }
  },
  render() {
    const { level, t, emitter, move, $slots } = this
    return <Draggable
      class='ad-draggable-nest'
      props={this.dragOptions}
      animation={280}
      ghost-class='ghost'
      chosen-class='chosen'
      list={this.list}
      value={this.value}
      onInput={emitter}
      move={move}>
      {/* type="transition" name="flip-list" */}
      <transition-group>
        {$slots.default || this.realValue.map((v, index) => {
          const _label = t(v.t_label || v.label)
          return <div
            class="ad-draggable-nest-item"
            key={v.prop}
          >
            <div
              class={['itemWrap', `${(v.fixed) ? 'disabled' : ''}`]}
              // onClick={() => this.removeHandler(v, index, this.realValue)}
            >
              <el-checkbox class={level !== 0 ? 'checkbox-hide' : ''} disabled={!!v.fixed || level !== 0} value={true} onInput={this.removeHandler.bind(null, v, index, this.realValue)} />
              <span class="label_txt" title={_label}>{ _label }</span>
              <Icon class="dragEl" iconClass="ad-drag"/>
              {
                /* (level === 0 && v._fixed) ? <span class='disabled_fixed' onClick={this.setFixed.bind(null, v, this.level)}>置{v._fixed === 'left' ? '底' : '顶'}</span>
                  : '' */
              }
            </div>
            {
              (v.children || []).length ? <AdDraggableNest
                move={move}
                // removeHandler={this.removeHandler}
                level={level + 1}
                list={v.children}
              /> : ''
            }
          </div>
        })}
      </transition-group>
    </Draggable>
  },
  data() {
    return {
      dragOptions: {
        animation: 280,
        group: 'description',
        disabled: false,
        ghostClass: 'ghost',
        chosenClass: 'chosen'
      }
    }
  },
  computed: {
    realValue() {
      return this.value ? this.value : this.list
    }
  },
  // created() {
  //   console.error(this.realValue, 'this.realValue created')
  // },
  // updated() {
  //   console.error(this.realValue, 'this.realValue  updated  ')
  // },
  methods: {
    emitter(value) {
      // console.error(value, 'emitter')
      this.$emit('input', value)
    }
  }
}
</script>
