<script type="text/jsx">
import { t } from '@adber/adber-ui/src/locale'
export default {
  name: 'AdInputNumber',
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    value: {},
    params: {
      type: Object
    }
  },
  render () {
    const { prefix, suffix, prop, controlsPosition, placeholder, ...props } = this.$attrs
    const { inputNumberSize, value } = this
    const $slots = this.$slots
    const onEvents = this.$listeners

    const _prefix = prefix ? <span class='ad-addon ad-input-number__prefix'>{prefix}</span> : ''
    const _suffix = suffix ? <span class='ad-addon ad-input-number__suffix'>{suffix}</span> : ''
    return <div class={`ad-input-number ad-input-number--${inputNumberSize} el-input el-input-group
     ${(_prefix || $slots.prefix) ? 'ad-input-number--prefix' : ''}
     ${(_suffix || $slots.suffix) ? 'ad-input-number--suffix' : ''}
     `}>
      {$slots.prefix || _prefix}
      <el-input-number
        props={{ ...props }}
        size={inputNumberSize}
        controlsPosition={controlsPosition || 'right'}
        placeholder={placeholder || t('adb.el.input.placeholder')}
        // value={this.localValue}
        value={value}
        on={onEvents}/>
      {$slots.suffix || _suffix}
    </div>
  },
  data () {
    return {}
  },
  computed: {
    // localValue () {
    //   const { prop } = this.$attrs
    //   const { value, params } = this
    //   if (prop && params) {
    //     return params[prop]
    //   }
    //   return value
    // },
    inputNumberSize() {
      return this.$attrs.size || (this.$ELEMENT || {}).size
    }
  }
}
</script>
