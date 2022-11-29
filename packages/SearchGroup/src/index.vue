<script lang="jsx">
import { t } from '@adber/adber-ui/src/locale'
// import InputNumberRange from './customizeFormItem/InputNumberRange'
import Popover from '@adber/adber-ui/packages/Popover'
import CustomRender from '@adber/adber-ui/packages/CustomRender'
import InputNumber from '@adber/adber-ui/packages/InputNumber'
import Icon from '@adber/adber-ui/packages/Icon'
import AdSelect from '@adber/adber-ui/packages/Select'
import SearchFilterDrawer from './SearchFilterDrawer'
import SelectedItemsSortDialog from './SelectedItemsSortDialog'
import { renderSelectOption } from '@adber/adber-ui/src/utils/slotsUtils'

const render = function(h) {
  // const _this = this
  const { defaultForms, moreForms, searchParams, more_searchParams, tagList, local_deleteTag, drawerIsExpand, getFormLabelValue, selectedSettingSubmit, saveFilterSubmit } = this
  let warpClass = 'ad-search-group-wrap'
  const itemRender = (item, searchObj, isMore = false) => {
    const { prop, itemType, itemWidth, options, change, itemStyle = '', placeholder, t_placeholder, ...formOthers } = item
    const _options = options || []
    const defaultWidth = isMore ? '100%' : '280px'
    const _itemStyle = itemStyle + (itemWidth ? `width: ${itemWidth || defaultWidth};` : '')
    const _placeholder = t_placeholder ? t(t_placeholder) : placeholder
    let disabled = item.disabled
    if (disabled === undefined) {
      disabled = false // isEdit === false
    }
    // 优化后的 change事件
    const formatterChange = async () => {
      if (change) {
        return change(searchObj, _options, isMore)
      }
    }
    const render_selectOptions = () => {
      return _options.map((option) => {
        let value = option
        let label = option
        let disabled = false
        if (typeof option === 'object') {
          value = option[item.valueKey || 'value']
          label = option[item.labelKey || 'label']
          if (item.i18n) label = t(label)
          disabled = option.disabled
        }
        return <el-option
          key={value}
          value={value}
          label={label}
          disabled={disabled}
          title={label}>
          {renderSelectOption.call(this, item.slotOption, option, label)}
        </el-option>
      })
    }
    switch (itemType) {
      case 'adSelect' :
        // v-model={(isMore ? more_searchParams : searchParams)[prop]}
        let filterable = item.filterable
        if (filterable === undefined && (item.options || []).length >= 5) {
          filterable = true
        }
        return <AdSelect
          v-model={searchObj[prop]}
          props={item}
          filterable={filterable}
          on={{
            'update:selected_label': this.adSelectTagsUpdate.bind(null, item, isMore)
            // (label) => {
            //   adSelectTags[prop] = label
            //   this.$forceUpdate()
            // }
          }}
          onChange={formatterChange}
          disabled={disabled}
          placeholder={_placeholder}
          width={itemWidth || defaultWidth}
        >
          {render_selectOptions()}
        </AdSelect>

      // <!-- 自定义render -->
      case 'render' :
        return <CustomRender
          form={item}
          params={searchObj}
        />
      // <!-- 下拉框 -->
      case 'select':
        return <el-select
          v-model={searchObj[prop]}
          props={{ ...formOthers }}
          popper-append-to-body={formOthers.popperAppendToBody || false}
          onChange={formatterChange}
          disabled={disabled}
          style={_itemStyle}
        >
          {render_selectOptions()}
        </el-select>
      // <!-- 单选 -->
      case 'radio':
        return <el-radio-group
          class="search-radio-group"
          props={{ ...formOthers }}
          v-model={searchObj[prop]}
          onChange={formatterChange}
          disabled={disabled}
          style={`${itemStyle} width:${itemWidth || '100%'};`}
        >
          {_options.map((option, optionIndex) => {
            let value = option
            let label = option
            let disabled = false
            if (typeof option === 'object') {
              value = option[item.valueKey || 'value']
              label = option[item.labelKey || 'label']
              if (item.i18n) label = t(label)
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
      // <!-- 单日期 || 日期区间 ... -->
      case 'datePicker':
        let dateOpts = {}
        // 区间类型
        if (/range$/.test(item.type || '')) {
          dateOpts = {
            startPlaceholder: t(item.startPlaceholder || 'adb.filter.startDate'),
            endPlaceholder: t(item.endPlaceholder || 'adb.filter.endDate')
          }
        } else {
          dateOpts.placeholder = _placeholder || t('adb.filter.selectDate')
        }
        return <el-date-picker
          v-model={searchObj[prop]}
          props={{
            ...formOthers,
            ...dateOpts
          }}
          onChange={formatterChange}
          disabled={disabled}
          clearable={item.clearable !== false}
          format={item.format || 'MM/dd/yyyy'}
          valueFormat={item.valueFormat || 'MM/dd/yyyy'}
          type={item.type || 'date'}
          style={_itemStyle}
        />

      // <!-- 数值文本框 -->
      case 'inputNumber':
        return <InputNumber
          class="rate100"
          v-model={searchObj[prop]}
          attrs={{ ...formOthers }}
          onChange={formatterChange}
          disabled={disabled}
          placeholder={_placeholder}
          precision={item.precision || 0}
          style={_itemStyle}
        />
      /* // <!-- 数值文本框 范围 -->
      case 'inputNumberRange':
        var precision = item.precision || 0
        var localStyle = `${itemStyle} width:${_itemWidth || defaultWidth || '100px'};`
        var numberChange = (e, propKey) => {
          change && change(searchObj, _options, isMore, propKey)
        }
        return <InputNumberRange
          v-model={searchObj}
          prop={prop}
          attrs={{ ...formOthers }}
          onChange={numberChange}
          disabled={disabled}
          precision={precision}
          itemStyle={localStyle}
        >
        </InputNumberRange> */
      // <!-- 文本框 -->
      case 'input':
      default:
        return <el-input
          v-model={searchObj[prop]}
          props={{ ...formOthers }}
          maxlength={formOthers.maxlength}
          onChange={formatterChange}
          disabled={disabled}
          placeholder={_placeholder || t('adb.el.input.placeholder')}
          clearable={item.clearable !== false}
          style={_itemStyle}
        >
          <template slot="prepend">{formOthers.prepend}</template>
          <template slot="append">{formOthers.append}</template>
        </el-input>
    }
  }
  const itemWrapRender = (item, isMore = false) => {
    const label = item.t_label ? t(item.t_label) : item.label
    const searchObj = isMore ? more_searchParams : searchParams
    const prop = item.prop
    let showValue = getFormLabelValue(item, searchObj)
    if (Array.isArray(showValue)) {
      showValue = showValue.join(',')
    }
    // 更多
    if (isMore) {
      return <el-collapse-item
        key={prop}
        name={prop}
      >
        <template slot="title">
          <span class="title">{label}</span>
          <div v-show={showValue} class="tag-value">{ showValue }</div>
        </template>
        {itemRender(item, more_searchParams, true)}
        <div class="filters-footer">
          <el-button
            type="text"
            class="filters-clear"
            title="clear filter"
            onClick={this.clearMoreHandler.bind(null, prop)}
          >
            <Icon icon-class="ad-clear"/>
          </el-button>
        </div>
      </el-collapse-item>
    }
    // 默认快捷方式
    return [
      <el-button
        slot="reference"
        class={`ad-popover-box__btn ${showValue ? 'active' : ''}`}>
        <span>
          <span class="ad-popover-box__btn__label">{label}</span>
          <i class="el-icon-arrow-down ad-popover-box__btn__suffix" slot="suffix"/>
        </span>
      </el-button>,
      <div class="ad-popover--select_content">
        {itemRender(item, searchParams, false)}
      </div>,
      <div class="ad-popover--select_footer">
        <el-button title={t('adb.btn.reset')} size='small' onClick={this.clearItemHandler.bind(null, prop)}>
          <ad-icon icon-class="ad-clear"/>
        </el-button>

        <el-button title={t('adb.btn.confirm')} size='small' type="primary" onClick={this.searchHandler.bind(null, prop)}>
          <ad-icon icon-class="ad-confirm"/>
        </el-button>
      </div>
    ]
  }
  // 找出展示的更过筛选长度
  const moreFormsFlag = moreForms.filter(v => v.visible !== false).length

  // const slot_prepend = this.$slots.prepend
  return <div class={warpClass}>
    <div class="ad-search-group-main">
      {this.$slots.prepend}
      <el-button-group>
        {
          defaultForms.filter(item => item.visible !== false).map((item, idx) => {
            return <Popover ref={`popover_${item.prop}`} key={item.prop + idx} popperClass="ad-popover--select" placement="bottom">
              {itemWrapRender(item, false)}
            </Popover>
          })
        }
        {/* 更多筛选条件 */}
        {
          moreFormsFlag ? <span class="ad-popover-box">
            <span class="el-popover__reference-wrapper">
              <el-tooltip placement="top" content={t('adb.filter.filterLabel')}>
                <el-button onClick={this.showMore}>
                  <ad-icon icon-class="ad-filter"/>
                </el-button>
              </el-tooltip>
            </span>
          </span> : ''
        }
      </el-button-group>
    </div>
    {/* 更多标签 start */ }
    <div v-show={tagList.length > 0 || this.$slots.extreaTags} class="ad-search-group-tags">
      <div class="tags-wrap">
        {this.$slots.extreaTags}
        {
          tagList.map((item, index) => {
            // 针对特殊类型 根据搜索的数据 进行自定义tag展示
            if (item.local_tagHTML) {
              return item.local_tagHTML
            }
            const _value = item.value
            const local_label = t(item.label)
            const key = item.form.prop || index
            if (Array.isArray(_value)) {
              const _valueLength = _value.length
              const labels = _value.join(',')
              return <el-tag key={key} disable-transitions>
                {local_label}：
                <span title={labels} class="el-tag__label">
                  {labels}
                </span>
                <span class="el-tag__total">{`(${_valueLength})`}</span>
                <i class="icon-delete" onClick={local_deleteTag.bind(null, item, index)}/>
              </el-tag>
            } else {
              return <el-tag key={key} disable-transitions>
                {local_label}：
                <span title={_value} class="el-tag__label">
                  {_value}
                </span>
                <i class="icon-delete" onClick={local_deleteTag.bind(null, item, index)} />
              </el-tag>
            }
          })
        }
      </div>
      <div class="tags-action">
        {/* 保存 */}
        {
          saveFilterSubmit && [
            <el-tooltip
              content={t('adb.filter.saveFilter')}
              placement="top"
            ><el-button
                type="text"
                class="btn btn-save"
                onClick={this.group_saveFilterSubmit}
              >
                <Icon icon-class="ad-save"/>
              </el-button></el-tooltip>,
            <span class="line">|</span>
          ]
        }

        {/* 清除 */}
        <el-tooltip
          content={t('adb.filter.clearAll')}
          placement="top"
        ><el-button type="text" class="btn btn-clear" onClick={this.clearAllTagsHandler}>
            <Icon icon-class="ad-clear" />
          </el-button></el-tooltip>
      </div>
    </div>
    { /* 更多标签 end */}
    {/* 更多弹窗 */}
    <SearchFilterDrawer
      class="filter-drawer"
      v-model={more_searchParams}
      visible={this.drawerVisible}
      on={this.drawerListeners}
    >
      {/* header */}
      <template slot="header">
        {t('adb.filter.filterLabel')}
        {
          selectedSettingSubmit && <i
            class="el-icon-setting action ml-8"
            onClick={this.settingVisibleChange.bind(null, true)}
          />
        }
      </template>
      {/* main */}
      <div class="filters-tool">
        <span class="filters-tool__btn" onClick={this.clearMoreHandler.bind(null, 'all')}>
          <Icon class="mr-8" icon-class="ad-clear" />
          { t('adb.filter.clearAllFilters') }
        </span>
        <span
          class={`filters-tool__btn ${drawerIsExpand ? 'active' : ''}`}
          onClick={() => { this.drawerIsExpand = !drawerIsExpand }}
        >
          { t(`adb.filter.${drawerIsExpand ? 'collapseAll' : 'expandAll'}`) }
          <Icon class="icon-rotate ml-8" icon-class="ad-arrow_down" />
        </span>
      </div>
      <div class="filters-contents">
        <el-scrollbar>
          <el-collapse v-model={this.drawerExpandCollapse} class="filters-collapse">
            {this.moreForms.map((item, i) => {
              return itemWrapRender(item, true)
            })}
          </el-collapse>
        </el-scrollbar>
      </div>
      {/* footer */}
      <div slot="footer" class="footer">
        <el-button type="primary" onClick={this.moreSearch}>
          {t('adb.btn.confirm')}
        </el-button>
      </div>
    </SearchFilterDrawer>
    { /* 修改快捷forms搜索弹窗 */ }
    {
      selectedSettingSubmit && <SelectedItemsSortDialog
        visible={this.selectedSettingVisible}
        value={this.defaultForms}
        options={this.forms}
        on={this.selectedSettingListeners}
        submit={this.group_selectedSettingSubmit}
      >
      </SelectedItemsSortDialog>
    }
  </div>
}
// import { getDeepValue } from '@/utils'

export default {
  name: 'AdSearchGroup',
  componentName: 'AdSearchGroup',
  components: {
    Popover,
    CustomRender,
    InputNumber,
    Icon,
    SearchFilterDrawer,
    SelectedItemsSortDialog,
    AdSelect
    // InputNumberRange,
    // InputTextArea
  },
  render,
  model: {
    prop: 'searchParams',
    event: 'update:searchParams'
  },
  props: {
    forms: {
      type: Array,
      required: true,
      default: () => []
    },
    // 后台传递的初始值 以及 双向绑定 对象
    searchParams: {
      // required: true,
      type: Object,
      default: () => ({})
    },
    // 多选标签 展示
    tagsVisible: {
      type: Boolean,
      default: true
    },
    // 是否允许修改 快捷forms 的提交操作
    selectedSettingSubmit: {
      type: Function
      // eg: function (group, dialog) {
      //   // group: searchGroup 组件实例
      //   // dialog: 配置快捷forms 弹窗实例
      //   /* dialog.submitLoading = true
      //      setTimeout(() => {
      //        // todo
      //        console.warn('checkedOptions', dialog.checkedOptions)
      //        dialog.submitLoading = false
      //        // dialog.visibleChange(false)
      //        this.$message.success(t('adb.message.editSuccess'))
      //        // group.selectedSettingVisible = false
      //        group.selectedSettingVisibleChange(false)
      //      }, 500) */
      // }
    },
    // 接口存储当前筛选数据 记录 （保存后 可能会 更新 tabs 以及其他联动操作 todo...）
    saveFilterSubmit: {
      type: Function
      // eg: function (group) {
      //   // group: searchGroup 组件实例
      // }
    },
    // 删除标签后的 额外操作(用于： 可能对searchParams 数据进行调整)
    deleteTag: {
      type: Function // (form, newSearchParams) => {} // 当前的 form配置, 最新的 searchParams
    }
  },
  data () {
    const _this = this
    return {
      defaultForms: [],
      moreForms: [],
      more_searchParams: {},
      tagList: [],
      adSelectTags: {}, // adSelect 存储
      drawerVisible: false,
      drawerExpandCollapse: [],
      selectedSettingVisible: false,
      selectedSettingListeners: {
        'update:visible': _this.selectedSettingVisibleChange
      },
      drawerListeners: {
        'update:visible': _this.drawerVisibleChange
      }
      // AdSelectListeners: {
      //   'update:selected_label': label => {}
      // }
    }
  },
  computed: {
    drawerIsExpand: {
      get() {
        return this.drawerExpandCollapse.length >= this.moreForms.length
      },
      set(bool) {
        if (bool) {
          this.drawerExpandCollapse = this.moreForms.map(v => v.prop)
        } else {
          this.drawerExpandCollapse = []
        }
      }
    }
  },
  watch: {
    searchParams: {
      handler (data, old) {
        if (!this.initSearchParams) {
          this.initSearchParams = { ...data }
        }
        this.more_searchParams = { ...data }
        // this.more_searchParams = this.moreFormKeys.reduce((res, k) => {
        //   res[k] = data[k]
        //   return res
        // }, {})
        // this.more_searchParamsReset()
        this.$nextTick(this.updateTagList)
      },
      immediate: true
    },
    forms: {
      handler() {
        // 对forms 根据 isMore 判断 进行分类
        const defaultForms = []
        const moreForms = []
        // const adSelectTags = {}
        this.forms.map(form => {
          if (form.isMore) {
            moreForms.push(form)
            // get moreForms keys
          } else {
            defaultForms.push(form)
          }
          // if (form.itemType === 'adSelect') {
          //   adSelectTags[form.prop] = this.adSelectTags[form.prop] || undefined
          // }
        })
        this.defaultForms = defaultForms
        this.moreForms = moreForms
        this.moreFormKeys = moreForms.reduce((keys, form) => {
          return keys.concat(this.queryItemTypeKey(form))
        }, [])
        // 避免updateTagList初始化 刷新两次的问题
        if (this.canUpdateTagList) {
          this.$nextTick(this.updateTagList)
        } else {
          this.canUpdateTagList = true
        }
        // this.adSelectTags = adSelectTags
        // this.more_searchParamsReset()
      },
      immediate: true
    },
    '$i18n.locale': 'updateTagList'
  },
  created() {
    window.searchGroup = this
    // this.more_searchParamsReset()
    // 监听 父级调用AdSearchGroup 的 内部方法 触发
    this.$on('AdSearchGroupAction', (handlerArr = [], params) => {
      // console.log(handlerArr, 'AdSearchGroupAction handlerArr params', params)
      /* setTimeout(() => {
        const fn = getDeepValue(this, handlerArr)
        if (typeof fn === 'function') {
          if (params !== undefined) {
            fn(params)
          } else {
            fn()
          }
        }
      }, 0) */
    })
  },
  methods: {
    selectedSettingVisibleChange(bool) {
      this.selectedSettingVisible = bool
    },
    drawerVisibleChange (bool) {
      if (bool) {
        this.moreReset()
      }
      this.drawerVisible = bool
    },
    group_selectedSettingSubmit(dialog) {
      this.selectedSettingSubmit(this, dialog)
      /* dialog.submitLoading = true
      setTimeout(() => {
        // todo
        console.warn('...... checkedOptions', dialog.checkedOptions)
        dialog.submitLoading = false
        // dialog.visibleChange(false)
        console.error()
        this.defaultForms = dialog.checkedOptions // JSON.parse(JSON.stringify(dialog.checkedOptions))
        this.$message.success(t('adb.message.editSuccess'))
        this.selectedSettingVisibleChange(false)
      }, 500) */
    },
    queryItemTypeKey(item) {
      const { prop, itemType } = item
      switch (itemType) {
        case 'render':
          /** !!! 暂不对render类型 进行更多标签处理 todo */
          return []
        // 对Number区间进行特殊处理
        case 'inputNumberRange':
          var propStart = item.propStart || `${prop}Start`
          var propEnd = item.propEnd || `${prop}End`
          return [propStart, propEnd]
        case 'adSelect':
        case 'select':
        case 'radio':
        case 'datePicker':
        case 'inputNumber':
        case 'input':
        default:
          return [prop]
      }
    },
    more_searchParamsReset() {
      const keys = this.moreFormKeys || []
      const searchParams = this.searchParams || {}
      this.more_searchParams = keys.reduce((res, key) => {
        res[key] = searchParams[key]
        return res
      }, {})
    },
    // prop   label   value
    getFormLabelValue(form, formData = this.searchParams) {
      const { prop, itemType, options: _options } = form
      const options = _options || []
      const val = formData[prop]
      let localValue
      switch (itemType) {
        // 对应的 prop 进行 提取 select_label
        case 'render':
          /** render类型 需要结合 tagRender(h,{searchParams, transLabel, deleteFn}){}处理 */
          localValue = form.local_labelValue
          break
        case 'adSelect':
          localValue = this.adSelectTags[prop]
          if (typeof localValue !== 'undefined') {
            if (Array.isArray(localValue) && !localValue.length) {
              localValue = undefined
              return localValue
            }/* else if (localValue === '') {
              localValue = undefined
            } */
            return localValue
          }
        // 若 adSelectTags[prop] 找不到 再通过options 再查一次
        // break
        // eslint-disable-next-line no-fallthrough
        case 'select':
        case 'radio':
          if (Array.isArray(val)) {
            localValue = []
            // 如果当前选中的值为空，或者有值且没有一项都存在于当前下拉选项中（如由于换账号，或者删除账号导致），则删除或不处理
            if (val.length) {
              val.map(_val => {
                options.map(option => {
                  const value = (typeof option === 'object') ? option[form.valueKey || 'value'] : option
                  if (value === _val) {
                    const label = (typeof option === 'object') ? option[form.labelKey || 'label'] : option
                    localValue.push(t(label))
                  }
                })
              })
              // 若获取不到数据强制去除
              if (!localValue.length) localValue = undefined
            }
          } else {
            options.find(option => {
              const value = (typeof option === 'object') ? option[form.valueKey || 'value'] : option
              if (value === val) {
                localValue = t((typeof option === 'object') ? option[form.labelKey || 'label'] : option)
              }
            })
          }
          break
        // 对Number区间进行特殊处理
        case 'inputNumberRange':
          var varStart = formData[form.propStart || `${prop}Start`]
          var varEnd = formData[form.propEnd || `${prop}End`]
          if (typeof varStart === 'number') {
            localValue = (!varEnd) ? ('>= ' + varStart) : varStart
          }
          if (typeof varEnd === 'number') {
            if (localValue === undefined) {
              localValue = '<= ' + varEnd
            } else {
              localValue += '~' + varEnd
            }
          }
          break
        case 'datePicker':
          // 兼容 dateragne datetimerange 相关
          if (Array.isArray(val) && val.length) {
            return val.join('-')
          }
        // eslint-disable-next-line no-fallthrough
        case 'inputNumber':
        case 'input':
        default:
          localValue = val
          break
      }
      return localValue
    },
    // 更新标签展示
    updateTagList() {
      if (!this.tagsVisible) return
      // const tags_forms = this.forms
      // 保证展示的 tagList 默认优先展示 然后再展示 more类型
      const tags_forms = [].concat(this.defaultForms, this.moreForms)
      // this.defaultForms.map(v => {
      //   // if (v.itemType === 'adSelect') {
      //   tags_forms.push(v)
      //   // }
      // })
      // tags_forms.push(...this.moreForms)
      // 对需要渲染的 forms 进行遍历

      const searchParams = this.searchParams
      this.tagList = tags_forms.reduce((res, item) => {
        let labelValue
        if (typeof item.tagRender === 'function') {
          const { showValue, tag } = item.tagRender(this.$createElement, {
            searchParams,
            transLabel: item.t_label ? t(item.t_label) : item.label,
            deleteFn: () => this.local_deleteTag(item, res.length)
          }) || {}
          // 定义可通过 formLabelValue 获取的 labelValue(more展示&&default active)
          item.local_labelValue = showValue
          item.local_tagHTML = tag
          // console.warn(showValue, tag, 'showValue, tag', item)
          // eg: tag
          // 类似这样的格式：
          // return <el-tag>
          //   {`${transLabel}：<span class="el-tag__label">${searchParams[yourProp]}</span>`}
          //   <i class="icon-delete" onClick={deleteFn} />
          // </el-tag>
        }
        labelValue = this.getFormLabelValue(item, searchParams)

        // forms
        if (labelValue !== undefined) {
          res.push({
            label: item.t_label || item.label,
            value: labelValue,
            form: item
          })
        }
        return res
      }, []).filter(v => {
        const _value = v.value
        if (_value === '' || (Array.isArray(_value) && !_value.length)) {
          return false
        }
        return true
      })
      this.drawerVisibleChange(false)
      // this.drawerVisible = false
    },
    // 标签参数重置
    tagResetParams(form) {
      let extraParams = {}
      const { prop, itemType } = form
      // 清空数据 是否针对不同的类型进行 reset??? todo...
      switch (itemType) {
        case 'inputNumberRange':
          var propStart = form.propStart || `${prop}Start`
          var propEnd = form.propEnd || `${prop}End`
          extraParams = { [propStart]: undefined, [propEnd]: undefined }
          break
        case 'adSelect':
          // 清空上次缓存记录
          this.adSelectTags[prop] = undefined
        // eslint-disable-next-line no-fallthrough
        default:
          extraParams = { [prop]: undefined }
      }
      return extraParams
    },
    // 删除标签展示 以及相关数据
    async local_deleteTag(item, index) {
      // const form = this.tagList[index].form
      const { form } = item
      const extraParams = this.tagResetParams(form)
      const new_searchParams = { ...this.searchParams, ...extraParams }
      // 关闭tag 后涉及到的额外联动操作(用于：对即将生成的新 searchParams 数据进行调整)
      // if (typeof form.deleteTag === 'function') {
      //   await form.deleteTag(form, new_searchParams)
      // }
      if (typeof this.deleteTag === 'function') {
        await this.deleteTag(form, new_searchParams)
      }
      // 删除当前标签
      this.tagList.splice(index, 1)
      // 对当前的 prop 进行重置
      this.$emit('update:searchParams', new_searchParams)
    },
    // 清空所有标签
    clearAllTagsHandler() {
      const tagResetParams = this.tagResetParams
      let new_searchParams = { ...this.searchParams }
      this.tagList.map(item => {
        const extraParams = tagResetParams(item.form)
        new_searchParams = { ...new_searchParams, ...extraParams }
      })
      // 重置 tagList
      this.tagList = []
      // 重置searchParams
      this.$emit('update:searchParams', new_searchParams)
    },
    // 保存当前筛选搜索
    group_saveFilterSubmit() {
      console.error(' group_saveFilterSubmit')
      this.saveFilterSubmit(this)
    },
    // 清空更多
    async clearMoreHandler (key) {
      // 清空数据 是否针对不同的类型进行 reset  todo...
      if (key === 'all') {
        this.moreFormKeys.map(prop => {
          this.more_searchParams[prop] = undefined
          // todo delete
          // if (typeof this.deleteTag === 'function') {
          //  this.deleteTag(this.moreForms.find(v => v.prop === key), this.more_searchParams)
          // }
        })
      } else {
        this.more_searchParams[key] = undefined
        // todo delete
        // if (typeof this.deleteTag === 'function') {
        //  this.deleteTag(this.moreForms.find(v => v.prop === key), this.more_searchParams)
        // }
      }
    },
    // 清空快捷Filter
    clearItemHandler(key) {
      this.searchParams[key] = undefined
      // todo delete
      // if (typeof this.deleteTag === 'function') {
      //  this.deleteTag(this.defaultForms.find(v => v.prop === key), this.searchParams)
      // }

      // this.$refs[`popover_${key}`].showPopper = false
      // this.searchHandler(key)
    },
    searchHandler (key) {
      this.$emit('update:searchParams', { ...this.searchParams })
      this.$refs[`popover_${key}`].showPopper = false
      this.$nextTick(this.updateTagList)
    },
    moreSearch() {
      this.drawerVisible = false
      // this.drawerVisibleChange(false)
      this.$emit('update:searchParams', { ...this.searchParams, ...this.more_searchParams })
      this.$nextTick(this.updateTagList)
    },
    moreReset() {
      // 搜索更多重置
      this.more_searchParams = { ...this.searchParams }
    },

    showMore() {
      // this.drawerVisible = true
      this.drawerVisibleChange(true)
    },
    adSelectTagsUpdate(item, isMore, label) {
      this.adSelectTags[item.prop] = label
      this.$forceUpdate()
      // this.updateTagList()
    },
    // 配置 SearchItems 快捷展示
    settingVisibleChange (bool) {
      console.error(bool, 'settingVisibleChange')
      this.selectedSettingVisible = bool
    }
  }
}
/**
 AdSearchGroup的 组件配置
 // 表单配置
 forms > form.itemType:(包含类型)
 // adSelect(支持多选/单选 支持本地搜索组件)
 // render(自定义渲染)
 // select(el select类型)
 // radio(el radio (radio-button) 类型)
 // datePicker(el date-picker 类型)
 // inputNumber(el input-number 封装的InputNumber 类型)
 // inputNumberRange(el input-number 封装的InputNumber 区间 类型)
 // input (el input 类型)

 forms = [
 // {
 //        t_label: '展示的label', // 多语言 可转译的 字符串
 //        // label: '展示的label', // 纯展示 非多语言(建议使用 t_label)
 //        // isMore: false, // 是否将当前选项放置 更多当中
 //        // visible: false, // 是否展示当前 form 判断 (可在后期做深度优化)
 //        prop: '提交的model prop',
 //        itemType: 'input', // 渲染类型 (见 form.itemType)
 //        itemWidth: '100px', // String 宽度设置
 //        itemStyle: 'background: #f00;color:#00f;', // 自定义设置样式
 //        t_placeholder: '', // 多语言 placeholder 多语言 可转译的 字符串
 //        placeholder: '', // placeholder 纯展示 非多语言(建议使用 t_placeholder)
 //        // 以上为默认公用配置
 //        // otherProps: ... 涉及到其他的配置相关 请参考对应的类型配置
 //    },

 // otherProps  ↓↓↓
 { // adSelect (支持多选/单选 支持本地搜索组件)
            label: '账号', // t_label
            prop: 'user_account',
            itemType: 'adSelect',
            multiple: true, // 是否多选 判断(默认false)
            options: [], // 下拉配置 {[labelKey]: label, [valueKey]: value, disabled: Bool, visible: Bool(于 adSelect 控制是否隐藏) }
            valueKey: 'user_account', // options 提交的key
            labelKey: 'user_account', // options 展示的key
            // i18n: Boolean 多语言装换
    },
 { // render (自定义渲染)
            label: '自定义render',
            prop: 'renderKey',
            itemType: 'render',
            render: (h, extendsParams) => {
              const { form, params } = extendsParams
              return <el-input v-model={params[form.prop]} placeholder="placeholder test... 666"/>
            }
    },

 { // select (下拉框)
            prop: 'select',
            label: 'select',
            itemType: 'select',
            options: [
              { value: 0, label: '小三' },
              { value: 1, label: '小四' }
            ],
            // labelKey: 'label', // 默认 label
            // valueKey: 'value', // 默认 value
            // i18n: Boolean 多语言装换
            change(param, _options, isMore) {}
            // 其他的 请参考 el-select 的配置
    },
 { // datePicker (单日期)
            prop: 'datePicker',
            label: 'datePicker',
            itemType: 'datePicker',
            // valueFormat: 'MM/dd/yyyy' // 默认
    },
 { // dateRange (日期区间)
            prop: 'dateRange',
            label: 'dateRange',
            itemType: 'datePicker',
            type: 'daterange',
            // valueFormat: 'MM/dd/yyyy' // 默认
    },
 { // inputNumber (数值文本框)
            prop: 'inputNumber',
            label: 'inputNumber',
            itemType: 'inputNumber',
            prefix: '展示前缀',
            suffix: '展示后缀',
            // 其他的 请参考 el-input-number 的配置
    },
 { // inputNumberRange (数值文本框 区间)
            prop: 'inputNumberRange', // 若不添加 propStart  propEnd 自动变为 `${prop}Start` `${prop}End`
            // propStart: 'inputNumberRange_start',
            // propEnd: 'inputNumberRange_end',
            label: 'inputNumberRange',
            itemType: 'inputNumberRange',
            prefix: '展示前缀',
            suffix: '展示后缀',
            // 其他的 请参考 el-input-number 的配置
    },
 { // input (文本框)
            prop: 'input',
            label: 'input',
            itemType: 'input'
          }
 ]
 */
/*
<AdSearchGroup
    :searchParams.sync="searchParams" // 方式1
    v-model="searchParams" // 方式2
    tagsVisible 是否展示 多选标签 展示
    :selectedSettingSubmit="selectedSettingSubmit" // (group, dialog) => { you want to do (是否允许修改 快捷forms 的提交操作) }
    :saveFilterSubmit="saveFilterSubmit" 接口存储当前筛选数据 // (group) => { you want to do }
    :deleteTag="deleteTag" 删除标签后的额外操作 // (form, newSearchParams) => { you want to do }
/>
*/
</script>
