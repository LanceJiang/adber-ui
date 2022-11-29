<script lang="jsx">
import { t } from '@adber/adber-ui/src/locale'
import NoData from '@adber/adber-ui/packages/NoData'

const render = function(h) {
  const { visible, selectOption, modelValue, value, comp_Options } = this
  const on = {
    ...this.listeners,
    'visible-change': this.visibleChange,
    'command': this.onCommand
  }
  let local_label = ''
  let showClear = true
  if (modelValue) {
    local_label = selectOption.label || t(selectOption.t_label)
    if (!local_label) {
      local_label = <span class="placeholder">{t(this.placeholder)}</span>
      showClear = false
    }
  } else {
    local_label = t(this.label)
  }
  showClear = showClear && this.clearable
  const scopedSlots_btn = this.$scopedSlots.btn
  return <el-dropdown
    class={['ad-dropdown', visible ? 'ad-dropdown--open' : '']}
    props={this.$attrs}
    trigger={this.comp_trigger}
    on={on}
  >
    {scopedSlots_btn ? scopedSlots_btn({ selectOption, showClear }) : <span class="ad-dropdown-link">
      {local_label}
      <i class={['action el-icon-arrow-down', showClear ? 'clear' : '']} onClick={this.actionClick}/>
    </span>}
    <el-dropdown-menu slot="dropdown" class="ad-dropdown-menu" appendToBody={this.appendToBody}>
      {
        this.$slots.options || ((comp_Options && comp_Options.length) ? comp_Options.map(opt => {
          return <el-dropdown-item
            key={opt.value}
            command={opt.command}
            disabled={opt.value === value || opt.disabled}
          >
            { opt.label || t(opt.t_label) }
          </el-dropdown-item>
        }) : <NoData class="local_no-data" />)
      }
    </el-dropdown-menu>
  </el-dropdown>
}
export default {
  name: 'AdDropdown',
  components: {
    NoData
  },
  render,
  props: {
    label: {
      type: String,
      default: '操作'
    },
    trigger: {
      type: String,
      default: 'hover' // hover / click
    },
    // dropdown-menu 下拉外壳是否放置 body
    appendToBody: {
      type: Boolean,
      default: true
    },
    // 双向绑定value 时 需要配置 modelValue:true
    value: {
      default: ''
    },
    // placeholder展示 需要配置 modelValue:true
    placeholder: {
      type: String,
      default: 'el.select.placeholder'
    },
    // clearable 清空value处理， 双向绑定value 时 需要配置 modelValue:true
    clearable: {
      type: Boolean,
      default: false
    },
    // 是否双向绑定value
    modelValue: {
      type: Boolean,
      default: false
    },
    options: {
      type: Array,
      default: () => []
      // eg: []{ label, t_label(可以转译的 label), value, command: 'modelValue 下会自定义value', disabled, }
    }
  },
  data() {
    return {
      visible: false
    }
  },
  computed: {
    comp_trigger() {
      if (this.modelValue) {
        return 'click'
      }
      return this.trigger
    },
    comp_Options() {
      if (this.modelValue) {
        return this.options.map((v) => {
          return {
            ...v,
            command: v.value
          }
        })
      }
      return this.options
    },
    selectOption() {
      const { value } = this
      return (this.comp_Options || []).find((v) => v.value === value) || {}
    }
  },
  methods: {
    visibleChange(bool) {
      this.visible = bool
    },
    onCommand(cmd) {
      this.$emit('input', cmd)
      this.$emit('command', cmd)
    },
    actionClick(e) {
      if (this.clearable) {
        e.stopPropagation()
        e.preventDefault()
        this.$emit('input', undefined)
      }
    }
  }
}
</script>
