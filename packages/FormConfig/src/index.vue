<script lang="jsx">
import { t } from '@adber/adber-ui/src/locale'
import InputNumber from '@adber/adber-ui/packages/InputNumber'
import CustomRender from '@adber/adber-ui/packages/CustomRender'
import AdSelect from '@adber/adber-ui/packages/Select'
import { renderSelectOption } from '@adber/adber-ui/src/utils/slotsUtils'

export default {
  name: 'AdFormConfig',
  components: {
    CustomRender,
    InputNumber,
    AdSelect
  },
  props: {
    forms: {
      type: Array,
      required: true
      // [{
      //   t_label: String,
      //   label: String,
      //   prop: [String, Array],
      //   itemType: String,
      //   size: String,
      //   options: Array,
      //   valueKey: String,
      //   labelKey: String,
      //   format: Function, // 提交前的数据修改
      //   rules: Array
      //   render?: function(h, { form, params }) { JSX || createElement } // itemType === 'render' 专用
      //   i18n: Boolean 多语言装换
      // }]
    },
    formData: {
      // 后台传递的初始值 对象 【后期拿操作的表单数据  请使用 submit 的params】
      type: Object,
      default: () => {
        return {}
      }
    }, // 后台传递过来的 数据
    // form的配置项对象 参考 local_formConfig
    formConfig: {
      type: Object,
      default: () => ({})
    },
    // 是否可以编辑
    isEdit: {
      type: Boolean,
      default: true
    }
  },
  render(h) {
    const { isEdit, forms, params, local_formConfig, itemStyle } = this
    const {
      showLabel,
      size,
      gutter,
      span,
      showFooter,
      submitBtnText,
      cancelBtnText,
      resetBtnText,
      submitLoading,
      showCancelBtn,
      showResetBtn,
      ...form_config
    } = local_formConfig
    const itemRender = (form) => {
      // const propKey = form.prop
      const {
        prop,
        itemType,
        itemWidth,
        options,
        change,
        itemStyle: form_itemStyle = '',
        itemClass,
        size: _size,
        placeholder,
        t_placeholder,
        ...formOthers
      } = form
      const _options = options || []
      const _itemStyle = itemStyle + form_itemStyle + (itemWidth ? `width: ${itemWidth};` : '')
      const _placeholder = t_placeholder ? t(t_placeholder) : placeholder
      let { disabled } = form
      if (disabled === undefined) {
        disabled = isEdit === false
      }
      const render_selectOptions = () => {
        return _options.map((option) => {
          let value = option
          let label = option
          let disabled = false
          if (typeof option === 'object') {
            value = option[form.valueKey || 'value']
            label = option[form.labelKey || 'label']
            if (form.i18n) label = t(label)
            disabled = option.disabled
          }
          return <el-option
            key={value}
            value={value}
            label={label}
            disabled={disabled}
            title={label}>
            {renderSelectOption.call(this, form.slotOption, option, label)}
          </el-option>
        })
      }
      switch (itemType) {
        /* 自定义 adber 自定义Select */
        case 'adSelect' :
          return <AdSelect
            class={itemClass}
            v-model={params[prop]}
            props={formOthers}
            isPopover={formOthers.isPopover ?? true}
            popperAppendToBody={formOthers.popperAppendToBody ?? true}
            onChange={() => change && change(params[prop], _options, params)}
            size={_size ?? size}
            placeholder={_placeholder}
            style={_itemStyle}
          >
            {render_selectOptions()}
          </AdSelect>
        /* 自定义 render */
        case 'render' :
          return <CustomRender
            form={form}
            params={params}
          />
        /* 下拉框 */
        case 'select':
          return (
            <el-select
              class={itemClass}
              props={{ ...formOthers }}
              v-model={params[prop]}
              onChange={() => change && change(params[prop], _options, params)}
              style={_itemStyle}
              disabled={disabled}
              size={_size ?? size}
              placeholder={_placeholder}
            >
              {render_selectOptions()}
            </el-select>
          )
        /* 单选框 */
        case 'radio':
          return (
            <el-radio-group
              class={itemClass}
              props={{ ...formOthers }}
              v-model={params[prop]}
              disabled={disabled}
              size={_size ?? size}
              onChange={() => change && change(params[prop], _options, params)}
              style={_itemStyle}
            >
              {_options.map((option, optionIndex) => {
                let value = option
                let label = option
                let disabled = false
                if (typeof option === 'object') {
                  value = option[form.valueKey || 'value']
                  label = option[form.labelKey || 'label']
                  if (form.i18n) label = t(label)
                  disabled = option.disabled
                }
                return (
                  <el-radio
                    key={`${optionIndex}_local`}
                    label={value}
                    disabled={disabled}
                    title={label}>
                    {label}
                  </el-radio>
                )
              })}
            </el-radio-group>
          )
        /* 级联 */
        case 'cascader':
          return (
            <el-cascader
              class={itemClass}
              props={{ ...formOthers }}
              v-model={params[prop]}
              onChange={() => change && change(params[prop], _options, params)}
              style={_itemStyle}
              disabled={disabled}
              size={_size ?? size}
              clearable={form.clearable ?? true}
              filterable={form.filterable ?? true}
              options={_options}
              placeholder={_placeholder}
            />
          )
        /* 数字 */
        case 'inputNumber':
          return (
            <InputNumber
              class={`rate100 ${itemClass}`}
              attrs={{ ...formOthers }}
              v-model={params[prop]}
              onChange={() => change && change(params[prop], _options, params)}
              style={_itemStyle}
              disabled={disabled}
              placeholder={_placeholder}
              size={_size ?? size}
              precision={form.precision || 0}
            />
          )
        /* 日期选择 */
        case 'date':
          return (
            <el-date-picker
              class={itemClass}
              props={{ ...formOthers }}
              v-model={params[prop]}
              onChange={() => change && change(params[prop], _options, params)}
              style={_itemStyle}
              disabled={disabled}
              size={_size ?? size}
              placeholder={_placeholder}
              value-format={form.valueFormat || 'yyyy-MM-dd'}
            />
          )
        /* 日期区间 */
        case 'dateRange':
          return (
            <el-date-picker
              class={itemClass}
              props={{ ...formOthers }}
              v-model={params[prop]}
              type="daterange"
              startPlaceholder={t(form.t_startPlaceholder)}
              endPlaceholder={t(form.t_endPlaceholder)}
              size={_size ?? size}
              onChange={() => change && change(params[prop], _options, params)}
              style={_itemStyle}
              disabled={disabled}
              value-format={form.valueFormat || 'yyyy-MM-dd'}
            />
          )
        // </el-date-picker>
        /* switch */
        case 'switch':
          return (
            <el-switch
              props={{ ...formOthers }}
              v-model={params[prop]}
              size={_size ?? size}
              onChange={() => change && change(params[prop], _options, params)}
              disabled={disabled}
            />
          )
        case 'input':
        default:
          return (
            <el-input
              class={itemClass}
              props={{ ...formOthers }}
              maxlength={formOthers.maxlength}
              v-model={params[prop]}
              size={_size ?? size}
              onChange={() => change && change(params[prop], _options, params)}
              disabled={disabled}
              placeholder={_placeholder}
              style={_itemStyle}
            />
          )
      }
    }
    const createFooter = () => {
      const { resetForm, cancelHandler, submitHandler } = this
      return (
        <div class="footer">
          {showCancelBtn && (
            <el-button class="cancel-button" size={size} onClick={cancelHandler}>
              {t(cancelBtnText)}
            </el-button>
          )}
          <div class="right-actions">
            {showResetBtn && (
              <el-button class="reset-button" plain size={size} onClick={resetForm.bind(null, undefined)}>
                {t(resetBtnText)}
              </el-button>
            )}
            <el-button class="submit-button" type="primary" size={size} loading={submitLoading} onClick={submitHandler}>
              {t(submitBtnText)}
            </el-button>
          </div>
        </div>
      )
    }

    return (
      <el-form
        ref="baseForm"
        class={`ad-form-config ad-form-config--${size}`}
        props={{ ...form_config, size, model: params }}
      >
        <el-row class={`form_wrap ${showLabel === false && 'hideLabel'}`} gutter={gutter}>
          {forms.map((form, idx) => {
            const { span: _span, t_label, label, ...others } = form
            const _label = t_label ? t(t_label) : label
            return (
              <el-col key={idx} span={_span ?? span}>
                <el-form-item props={{ ...others, label: _label }}>{itemRender(form)}</el-form-item>
              </el-col>
            )
          })}
          {/** 额外的插入内容 */}
          {this.$slots.extraContent}
        </el-row>
        {showFooter && createFooter()}
      </el-form>
    )
  },
  data() {
    const { forms, formData } = this.$props
    const formats = {}
    const params = this.changeFormData(formData, true)
    // 遍历 集成format对象
    forms.forEach((v) => {
      const { prop, format } = v
      if (format) {
        formats[prop] = format
      }
    })

    return {
      params,
      formats
    }
  },
  computed: {
    itemStyle() {
      const { itemWidth } = this.formConfig
      if (itemWidth) {
        return `width: ${itemWidth};`
      }
      return ''
    },
    local_formConfig() {
      const defaultConfig = {
        /** 自定义Config */
        // 默认的formItem内容宽度(eg: input/select/radio...)
        itemWidth: undefined,
        // 默认的formItem 外壳 col之间的 间隔
        gutter: 0,
        // 默认的formItem 对应的 col 外壳 span 配置
        span: 24,
        // 默认的formItem 对应的 label 是否展示
        showLabel: true,
        // 是否展示 底部操作集合
        showFooter: true,
        // footer下的 提交按钮 描述
        submitBtnText: 'adb.btn.confirm',
        // footer下的 提交按钮loading
        submitLoading: false,
        // footer下的 取消按钮 是否显示
        showCancelBtn: true,
        // footer下的 取消按钮 text
        cancelBtnText: 'adb.btn.cancel',
        // footer下的 重置按钮 是否显示
        showResetBtn: false,
        // footer下的 重置按钮 text
        resetBtnText: 'adb.btn.reset',

        /**
         * element中的配置
         * 更多请参考 [https://element-plus.gitee.io/zh-CN/component/form.html#%E8%A1%A8%E5%8D%95-api]
         */
        labelPosition: 'top',
        // 表单域标签的后缀
        // labelSuffix: '',
        // 表单内组件的尺寸
        // size: 'small'
        size: (this.$ELEMENT || {}).size || 'medium'
      }
      return {
        ...defaultConfig,
        ...this.formConfig
      }
    }
  },
  watch: {
    formData: {
      handler(newData) {
        // console.warn(newData, oldData, 'newFormData, oldFormData  formData 发生改变 ... 监听  formData... 触发此处...')
        this.changeFormData(newData)
      }
      // deep: true // 是否深度监测 formData 属性 (可以不使用 请别使用)
    }
  },
  methods: {
    changeFormData(formData, isInit) {
      const { forms } = this
      const params = {}
      const bindProps = []
      forms.forEach((v) => {
        const _prop = v.prop
        const propType = typeof _prop
        const { props } = v // 绑定的其他数据
        if (propType === 'string') {
          params[_prop] = this.setItemData(formData[_prop]) // 数据初始化
          if (v.itemType === 'dateRange') {
            const startKey = v.startKey || `${_prop}Start`
            const endKey = v.endKey || `${_prop}End`
            const hasDate = formData[startKey] && formData[endKey]
            // 仅当 初始日期 和 结束日期 都有的情况下 才赋值 prop值
            // （只有一个值时，存在 rangeDate不展示对应数据，点选日期 也被置回1970年 的问题）
            params[_prop] = hasDate
              ? [formData[startKey], formData[endKey]]
              : formData[_prop] || undefined
          } else if (v.itemType === 'cascader') {
            // 级联数据为数组
            params[_prop] = params[_prop] || [] // 变成数组  // 若不是数组 怎么操作
          }
          // 若该formItem  包含forms列表中未定义的prop 需要从formData取值
          if (Array.isArray(props)) {
            bindProps.push(...props)
          }
        } /* else if (_this.isArray(_prop)) {
          _prop.forEach(vv => {
            params[vv] = formData[vv] || ''
          })
        } */
      })
      // 赋值其他被绑的的值
      bindProps.map((prop) => {
        params[prop] = formData[prop] // 被绑定的其他数据初始化
      })
      if (isInit) {
        return params
      }
      this.params = params
    },
    isArray(value) {
      return typeof value === 'object' && Object.prototype.toString.call(value) === '[object Array]'
    },
    cancelHandler() {
      this.$emit('cancel')
    },
    submitHandler(submitCallback) {
      this.getParams((error, params) => {
        if (!error) {
          // debugger;
          // 若在父级组件使用 自定义的操作按钮， 可调用callback函数 作为提交操作
          if (typeof submitCallback === 'function') {
            return submitCallback(params)
          }
          this.$emit('submit', params)
        } else {
          console.warn(error, '错误rule数组.... 如果需要对该错误数组 操作 请在此处添加')
          // eg:
          /* var errObj = error;
                        // 提示弹窗的 示例代码
                        var keys = Object.keys(errObj);
                        console.log(errObj[keys[0]], 'errObj[keys[0]]');
                        var errTipObj = (errObj[keys[0]][0] || {});
                        debugger;
                        if (errTipObj.message) {
                            this.$message.error(errTipObj.message)
                        } */
        }
      })
    },
    getParams(callback, unValidate = false) {
      const _getParams = () => {
        const { params, formats, forms } = this
        const formattedForm = {} // 最后提交后台使用的params对象
        forms.forEach((form) => {
          const key = form.prop
          if (key) {
            // 对应的form 内部设置有 formats 函数的值做提交前的最后操作 fn(value, key)
            if (form.itemType === 'dateRange' && form.startKey) {
              // 含有startKey 表示拆分出来
              const { startKey } = form // || key + 'Start'
              const { endKey } = form // || key + 'End'
              const [startDate, endDate] = params[key] || []
              formattedForm[startKey] = startDate
              formattedForm[endKey] = endDate
            } else {
              formattedForm[key] = formats[key] ? formats[key](params, key) : params[key]
            }
          }
          // 对含有 其他prop的数据 赋值
          if (Array.isArray(form.props)) {
            form.props.map((_key) => {
              formattedForm[_key] = params[_key]
            })
          }
        })
        if (callback) callback(null, formattedForm)
      }
      if (unValidate) return _getParams()
      this.$refs.baseForm.validate((valid, errObj) => {
        if (valid) {
          _getParams()
        } else {
          // console.error(errObj, 'errObj..................')
          if (callback) callback(errObj)
        }
      })
    },
    resetForm(isAsync) {
      // 是否异步 传入的 formData 重置
      if (isAsync) {
        // 由于 formData 从父级传入后 内部并没有直接使用 固可用做 重置功能
        this.changeFormData(this.formData)
      } else {
        this.$refs.baseForm.resetFields()
      }
    },
    setItemData(value, defaultValue) {
      if (typeof value !== 'boolean' && typeof value !== 'number') {
        return value || defaultValue
      }
      return value
    }
  }
}

/**
 * eg:  示例  实例参考 TestForm.vue
 */
/* <FormConfig
        ref="configForm"
        :forms="formOptions.forms" // 遍历formItem 的数组
        :formData="formOptions.formData" // 初始化 form数据
        @submit="submit" // form 表单提交使用： 会传递 form 对应的值

        @cancel="close" // 取消按钮点击操作

        :isEdit="formOptions.isEdit" // 是否以 纯展示方式 展示数据 //(不可编辑) // 需要传递的 参数也最少

        />

        var formOptions = {
            forms: [
            {
                prop: '邮件标题',
                label: '邮件标题',
                itemType: 'input',
                // span: 11,
                // xs: {span: 20}
            },
            { // 选人
                prop: '传阅人员',
                label: '传阅人员',
                itemType: 'select',
                options: [
                    // '小三', '请选择传阅人员'
                    {value: '', label: '请选择传阅人员'},
                    {value: 0, label: '小三'},
                    {value: 1, label: '小四'}
                ]
            }
        ]
    } */
</script>
