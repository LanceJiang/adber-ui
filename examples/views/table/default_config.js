import { getOrders, getOrdersCount, getTableConfig } from '@/views/table/queryApi'
// import { cellSlot_price } from './testSlots.jsx'
// import { cellSlot_price } from '@adber/adber-ui/src/utils/cellSlots.vue'
// import { cellSlot_price } from '@adber/adber-ui/packages/sys_cellSlots'
import { cellSlot_price } from '@adber/adber-ui/packages/sys_cellSlots/index.jsx'
// import { cellSlot_price } from '@/../src/utils/cellSlots.vue'

const tPrefix = 'outboundOrder.table.'

/**
 *  不同组件下配置的区别
 *  adTable slots.default: ({row, column, (index...)}, h){ return <element> } 为方便 ad(Vxe)Table 之间 slots共用 建议使用 return [<element>] 兼容table间的公用
 *  adVxeTable slots.default: ({row, column, (rowIndex, $rowIndex, columnIndex, $columnIndex, _columnIndex)}, h){ return [<element>]}
 */
const slot_user = (scope, h) => {
  // $rowIndex 指 vxeTable Cell  $index 指 elTable Cell
  if (scope.$rowIndex === 0 || scope.$index === 0) console.error(scope, 'slot_user scope 第一条数据')
  const { row, column } = scope
  return [<div style={'background: #f0f;'}>slot:default <br/><el-button>row[column.property]: {row[column.property]}</el-button>   </div>]
}

const userConfig = {
  t_label: `${tPrefix}user`,
  prop: 'local_user',
  /** 渲染自定义 可以使用 slots  && formatter */
  slots: {
    default: slot_user,
    header: 'slotName_title'
  },
  minWidth: '185px',
  showOverflowTooltip: false
  // // 暂时没有该功能（column 配置 column children） 配置仅做参考
  // children: [
  //   {
  //     label: 'child0_001',
  //     prop: 'child0_001'
  //   },
  //   {
  //     label: 'child0_002',
  //     prop: 'child0_002'
  //   }
  // ]
}
const testColumns = Array.from({ length: 20 }).map((_, i) => ({
  label: `${tPrefix}test_${i}`,
  // title: `${tPrefix}test_${i}`,
  prop: `test_${i}`,
  // field: `test_${i}`,
  minWidth: '130px'
}))
export const columns = [
  userConfig,
  {
    t_label: `${tPrefix}orderNo`,
    // title: `${tPrefix}orderNo`,
    prop: 'orderNo',
    // field: 'orderNo',
    minWidth: '220px',
    // 用户提示配置
    titleHelp: {
      icon: 'ad-iconfont ad-check_1', // todo 自定义icon
      message: `<span style='background: #f00'>wo的 <br/>sssssssssss</span>`
    },
    slots: {
      /**
       *  不同组件下配置的区别
       *  adTable slots.default: ({row, column, (index...)}, h){ return [<element>] || <element> } 为方便 ad(Vxe)Table 之间 slots共用 建议使用 return [<element>] 兼容table间的公用
       *  adVxeTable slots.default: ({row, column, (rowIndex, $rowIndex, columnIndex, $columnIndex, _columnIndex)}, h){ return [<element>]}
       */
      default: ''
    },
    sortable: true,
    showOverflow: 'tooltip',
    formatter(maybeRow, ...others) {
      /**
       * 不同组件下配置的区别
       *  adTable formatter: (row, column, cellValue, index){}
       *  adVxeTable formatter: ( {row, column, cellValue, rowIndex} ){}
       */
      // console.error(maybeRow, 'maybeRow ', others, 'others')
      const row = maybeRow.row || maybeRow
      return 'orderNo: formatter: ' + row.orderNo
    }
  },
  {
    label: 'slotPrice',
    // title: `${tPrefix}orderNo`,
    prop: 'priceValue',
    minWidth: '240px',
    slots: {
      // default: cellSlot_price() // 默认 金额单位 currency, 再是 非 prop 的数据渲染
      default: cellSlot_price('currency', 'priceValue')
    }
  },
  ...testColumns,
  {
    t_label: 'adb.table.action',
    // title: 'adb.table.action',
    // label: '测试的 action label 非 t_label',
    prop: 'action',
    // field: 'action',
    slots: {
      default: 'action'
    },
    fixed: 'right',
    minWidth: '150px'
  }
]

// 初始化 checkedOptions (用于 接口还没获取到 之前保存的columns 配置)
export const checkedOptions = columns.map((v) => v)

// 若有特殊的 默认配置 (产品特殊要求 含: column 展示配置  和 展示 顺序)
export const defaultCheckedOptions = [userConfig] // columns.map((v) => v).reverse()

// 搜索的表单配置 示例
// 表单对象值
export const formParams = {
  render: 'testXXX',
  pattern: 'input 搜索',
  input: 'testInput',
  adSelect: '选项1',
  adSelectMore: '选项2',
  adSelectMultiple: ['选项3'],
  adSelectMultipleMore: ['选项4'],
  radio: 0,
  inputMore: 'inputMore_init',
  dateRange: ['11/10/2022', '11/25/2022'],
  dateRangeMore: [],
  datePickerMore: '11/25/2022'
  // datePickerMore: '2022-11-25'
  // inputNumber: undefined
}
// 表单配置类目
export const formOptions = {
  forms: [
    {
      visible: true, // 只要不为false 就是 展示
      isMore: false, // 只要不为true 就是 默认展示
      prop: 'input', // 提交的 params 的字段
      label: 'input', // label 标签
      itemType: 'input' // form-item 类型
      // prepend: 'Http://', // 额外form-item配置
      // append: '.com' // 额外form-item配置
      // placeholder: '请输入input..............' // 额外form-item配置
    },
    {
      visible: true, // 只要不为false 就是 展示
      isMore: true, // 只要不为true 就是 默认展示
      prop: 'inputMore', // 提交的 params 的字段
      label: 'inputMore', // label 标签
      itemType: 'input' // form-item 类型
      // prepend: 'Http://', // 额外form-item配置
      // append: '.com' // 额外form-item配置
    },
    {
      // visible: true, // 只要不为false 就是 展示
      // isMore: true, // 只要不为true 就是 默认展示
      prop: 'adSelect', // 提交的 params 的字段
      label: 'adSelect', // label 标签
      itemType: 'adSelect', // form-item 类型
      labelKey: 'label_1',
      valueKey: 'value_1',
      options: Array.from({ length: 20 }).map((_, i) => {
        return {
          value_1: '选项' + i,
          label_1: 'adSelect单选' + i
        }
      }),
      // slot template（$scopedSlots）  方式1
      slotOption: 'adSelectSlot'
      // slot function 方式2
      // slotOption(h, { option, label }) {
      //   return label + '_____'
      // }
      /** !!!! defaultValue 不再使用  如需 初始化 请在 对应的 双向绑定 对象 searchParams 中进行定义 */
      // defaultValue: 1 // eg: searchParams = {select: 1} todo delete
      // showSearch: true,
    },
    {
      // visible: true, // 只要不为false 就是 展示
      isMore: true, // 只要不为true 就是 默认展示
      prop: 'adSelectMore', // 提交的 params 的字段
      label: 'adSelectMore', // label 标签
      itemType: 'adSelect', // form-item 类型
      labelKey: 'label_1',
      valueKey: 'value_1',
      options: Array.from({ length: 20 }).map((_, i) => {
        return {
          value_1: '选项' + i,
          label_1: 'adSelectMore单选' + i
        }
      })
      /** !!!! defaultValue 不再使用  如需 初始化 请在 对应的 双向绑定 对象 searchParams 中进行定义 */
      // defaultValue: 1 // eg: searchParams = {select: 1} todo delete
      // showSearch: true,
    },
    {
      // visible: true, // 只要不为false 就是 展示
      // isMore: true, // 只要不为true 就是 默认展示
      prop: 'adSelectMultiple', // 提交的 params 的字段
      label: 'adSelectMultiple', // label 标签
      itemType: 'adSelect', // form-item 类型
      multiple: true,
      labelKey: 'label_1',
      valueKey: 'value_1',
      options: Array.from({ length: 20 }).map((_, i) => {
        return {
          value_1: '选项' + i,
          label_1: 'adSelect多选' + i
        }
      })
      /** !!!! defaultValue 不再使用  如需 初始化 请在 对应的 双向绑定 对象 searchParams 中进行定义 */
      // defaultValue: 1 // eg: searchParams = {select: 1} todo delete
      // showSearch: true,
    },
    {
      // visible: true, // 只要不为false 就是 展示
      isMore: true, // 只要不为true 就是 默认展示
      prop: 'adSelectMultipleMore', // 提交的 params 的字段
      label: 'adSelectMultipleMore', // label 标签
      itemType: 'adSelect', // form-item 类型
      multiple: true,
      labelKey: 'label_1',
      valueKey: 'value_1',
      options: Array.from({ length: 20 }).map((_, i) => {
        return {
          value_1: '选项' + i,
          label_1: 'adSelectMore多选' + i
        }
      })
      /** !!!! defaultValue 不再使用  如需 初始化 请在 对应的 双向绑定 对象 searchParams 中进行定义 */
      // defaultValue: 1 // eg: searchParams = {select: 1} todo delete
      // showSearch: true,
    },
    {
      visible: true, // 只要不为false 就是 展示
      isMore: false, // 只要不为true 就是 默认展示
      prop: 'dateRange', // 提交的 params 的字段
      label: 'dateRange', // label 标签
      itemType: 'datePicker', // form-item 类型
      type: 'daterange', // form-item 类型
      change(params, options, isMore) {
        // // 模拟针对 change 事件 对 其他formItem 进行调整 (success) to do...
        // that.searchParams2.rangePicker = undefined // 测试only
        console.log(params, options, isMore, 'value, options, isMore')
      }
    },
    {
      visible: true, // 只要不为false 就是 展示
      isMore: true, // 只要不为true 就是 默认展示
      prop: 'dateRangeMore', // 提交的 params 的字段
      label: 'dateRangeMore', // label 标签
      itemType: 'datePicker', // form-item 类型
      // type: 'daterange', // form-item 类型
      type: 'datetimerange',
      valueFormat: 'yyyy-MM-dd HH:mm:ss', // 提交 数据
      format: 'MM/dd/yyyy HH:mm:ss' // label 展示
    },
    {
      visible: true, // 只要不为false 就是 展示
      isMore: false, // 只要不为true 就是 默认展示
      prop: 'datePicker', // 提交的 params 的字段
      label: 'datePicker', // label 标签
      itemType: 'datePicker' // form-item 类型
    },
    {
      visible: true, // 只要不为false 就是 展示
      isMore: true, // 只要不为true 就是 默认展示
      prop: 'datePickerMore', // 提交的 params 的字段
      label: 'datePickerMore', // label 标签
      // valueFormat: 'yyyy-MM-dd', // 提交 数据
      // format: 'MM/dd/yyyy', // label 展示
      itemType: 'datePicker' // form-item 类型
    },
    {
      visible: true, // 只要不为false 就是 展示
      isMore: false, // 只要不为true 就是 默认展示
      prop: 'inputNumber', // 提交的 params 的字段
      label: 'inputNumber', // label 标签
      itemType: 'inputNumber', // form-item 类型
      prefix: '展示前缀',
      suffix: '展示后缀',
      change: (val) => {
        console.log('inputNumber   change.....', val)
      }
    },
    {
      visible: true, // 只要不为false 就是 展示
      isMore: true, // 只要不为true 就是 默认展示
      prop: 'inputNumberMore', // 提交的 params 的字段
      label: 'inputNumberMore', // label 标签
      itemType: 'inputNumber' // form-item 类型
    },
    /* {
      // visible: true, // 只要不为false 就是 展示
      // isMore: true, // 只要不为true 就是 默认展示
      prop: 'select', // 提交的 params 的字段
      label: 'select', // label 标签
      itemType: 'select', // form-item 类型
      options: [
        { value: 0, label: '小三' },
        { value: 1, label: '小四' }
      ]
    }, */
    {
      prop: 'radio',
      label: 'radio',
      itemType: 'radio',
      // itemType: 'adSelect', // form-item 类型
      // filterable: true,
      // multiple: true,
      options: [
        { value: 0, label: '未结算' },
        { value: 1, label: '已结算' },
        { value: 2, label: '全部' }
      ],
      change: (val) => {
        console.log('radio   change.....', val)
      }
    },
    {
      isMore: true, // 只要不为true 就是 默认展示
      prop: 'radioMore',
      label: 'radioMore',
      itemType: 'radio',
      options: [
        { value: 10, label: '1未结算' },
        { value: 11, label: '1已结算' },
        { value: 12, label: '1全部' }
      ],
      change: (val) => {
        console.log('radio   change.....', val)
      }
    },
    { // 可用于特殊场合中 tagList 需要结合tagRender 做支持
      prop: 'render',
      label: '自定义Render',
      itemType: 'render',
      render: (h, extendsParams) => {
        const { form, params } = extendsParams
        return <div style="background: #f0f;">
          <el-input v-model={params[form.prop]} placeholder="placeholder render"/>
          <el-input v-model={params.others} placeholder="placeholder others"/>
        </div>
      },
      tagRender(h, { searchParams, transLabel, deleteFn }) {
        console.error(searchParams, transLabel, deleteFn, 'searchParams, label, value')
        const render = searchParams['render'] || ''
        const others = searchParams['others']
        let showValue = render
        if (others) {
          showValue += (showValue ? '-and-' : '') + others
        }
        let tag = ''
        if (showValue) {
          tag = <el-tag disable-transitions>
            {`${transLabel}：`}
            {showValue ? `<span class="el-tag__label">${showValue}</span>` : ''}
            {others ? `others：<span class="el-tag__label">${showValue}</span>` : ''}
            <i class="icon-delete" onClick={deleteFn} />
          </el-tag>
        }
        return {
          showValue,
          tag
        }
      }
    }
    /* {
      // isMore: true, // 只要不为true 就是 默认展示
      prop: 'inputNumberRange', // 若不添加 propStart  propEnd 自动变为 `${prop}Start` `${prop}End`
      // propStart: 'inputNumberRange_start',
      // propEnd: 'inputNumberRange_end',
      label: 'inputNumberRange',
      itemType: 'inputNumberRange',
      placeholderStart: 'xxxx最小值',
      placeholderEnd: 'xxxx最大值',
      change(params, _options, isMore, propKey) {
        console.log(params, _options, isMore, propKey, 'params, _options, isMore, propKey')
      }
    } */
  ]
}

export const tableBaseMixin = {
  data() {
    return {
      formParams,
      formOptions,
      searchParams: {
        page: 1,
        pageSize: 20
      },
      list: [],
      total: 0,
      options: {
        // rowKey: 'value',
        loading: false,
        // showIndex: true,
        multipleSelect: true
      },
      dropdownList: ['PickingList', 'PackingList'],
      // 列配置对象
      curColumnsConfig: {
        // 所有的 columns 配置
        columns,
        // 默认展示配置
        defaultCheckedOptions
      },
      checkedOptions: JSON.parse(JSON.stringify(checkedOptions)),
      // todo  后续 对于新增的搜索类型可能有需要参照用到 (后续去 delete)
      filterOptions: [
        {
          label: 'Test',
          key: 'test',
          type: 'radio',
          // slot: 'checkbox',
          options: [
            { label: 'test', value: 'test' },
            { label: 'UPS', value: 'abc' },
            { label: 'Pitnet Bowers', value: 'PB' }
          ],
          is_hide: true
        },
        {
          label: 'Checkbox',
          key: 'Checkbox',
          type: 'checkbox',
          // is_hidden_selectAll: true,
          // slot: 'checkbox',
          options: [
            { label: 'Fedex', value: 'FEDEX' },
            { label: 'UPS', value: 'UPS' },
            { label: 'Pitnet Bowers', value: 'PB' },
            { label: 'STAMPS', value: '1' }
          ]
        },
        {
          label: 'Amount Range',
          key: 'Amount',
          type: 'amount-range',
          date_options: {
            min: 0,
            max: 1
          }
        },
        {
          label: 'Number Range',
          key: 'Number',
          type: 'number-range',
          date_options: {
            min: -1,
            max: 0
          }
        },
        {
          label: 'Picker',
          key: 'Picker',
          type: 'date-picker',
          date_options: {
            type: 'daterange'
          }
        },
        {
          label: 'Select',
          key: 'Select',
          type: 'select',
          options: [
            { label: 'Fedex', value: 'FEDEX' },
            { label: 'UPS', value: 'UPS' },
            { label: 'Pitnet Bowers', value: 'PB' },
            { label: 'STAMPS', value: 'STAMPS' }
          ],
          is_button: true
        },
        {
          label: 'Radio',
          key: 'Radio',
          type: 'radio',
          options: [
            { label: 'Fedex', value: 'FEDEX' },
            { label: 'UPS', value: 'UPS' },
            { label: 'Pitnet Bowers', value: 'PB' },
            { label: 'STAMPS', value: 'STAMPS' },
            { label: 'Fedex', value: 'FEDEX1' },
            { label: 'UPS', value: 'UPS1' },
            { label: 'Pitnet Bowers', value: 'PB1' },
            { label: 'STAMPS', value: 'STAMPS1' },
            {
              label: 'Range',
              value: 'Range',
              date_options: {
                min: -99999,
                max: 99999
              },
              range_data: this.radio_data, // 范围的数据
              range: true
            }
          ],
          is_button: true
        },
        {
          label: '1234',
          key: '1234567',
          type: 'radio',
          options: [
            { label: 'Fedex', value: 'FEDEX' },
            { label: 'UPS', value: 'UPS' },
            { label: 'Pitnet Bowers', value: 'PB' },
            { label: 'STAMPS', value: 'STAMPS' },
            { label: 'Fedex', value: 'FEDEX1' },
            { label: 'UPS', value: 'UPS1' },
            { label: 'Pitnet Bowers', value: 'PB1' },
            { label: 'STAMPS', value: 'STAMPS1' },
            {
              label: 'Range',
              value: 'Range',
              date_options: {
                min: -99999,
                max: 99999
              },
              range_data: this.radio_data, // 范围的数据
              range: true
            }
          ],
          is_button: true
        }
      ]
    }
  },
  computed: {
    localList() {
      // 相关数据组装处理
      return this.list
    },
    localColumns() {
      // 为保险起见 拿到接口的配置数据 需要过滤 已失效的配置项 [checkedOptions]
      const { checkedOptions } = this
      const columns = this.curColumnsConfig.columns
      if (!checkedOptions.length) return columns
      return checkedOptions.map((v) => {
        const cur = columns.find((column) => column.prop === v.prop)
        if (cur) {
          const fixedFlag = cur.fixed
          if (fixedFlag) {
            v.fixed = fixedFlag
          }
          return cur
        }
        return false
      }).filter(Boolean)
    }
  },
  watch: {
    // 监听数据对象变更 重新做请求
    searchParams() {
      // searchParams 变更 重新做请求
      this.queryList()
    },
    // 更新formParams
    formParams: 'updateParams'
  },
  created() {
    window.test = this
    this.queryTableConfig()
    this.updateParams()
    // this.queryList()
  },
  methods: {
    testSortChange(sortParams) {
      // 默认会更新 searchParams 有额外处理 在此添加
      console.error(sortParams, 'testSortChange sortParams')
    },
    updateParams() {
      console.error(JSON.stringify(this.formParams), 'updateParams  去请求接口 todo....')
      this.searchParams = {
        ...this.searchParams,
        ...this.formParams,
        page: 1
      }
    },
    getRequestParams(e) {
      // console.error('getRequestParams', e)
      return {
        ...this.searchParams,
        ...this.formParams
      }
    },
    // table配置请求
    queryTableConfig() {
      // 可能存在多个 table 配置 此处制作一个进行模拟
      return getTableConfig().then((res) => {
        // 对失效的 配置做剔除 todo
        let checkedOptions = res.columns
        const { columns, defaultCheckedOptions } = this.curColumnsConfig
        /** defaultCheckedOptions 必须与columns 配置修改做 同步更新 */
        if (!Array.isArray(checkedOptions) || !checkedOptions.length) {
          checkedOptions = defaultCheckedOptions
        }
        // 对之前接口存储的 checkedOptions 做过滤更新（必要的处理）
        for (let i = 0; i < checkedOptions.length; i++) {
          const option = checkedOptions[i]
          const column = columns.find((_column) => option.prop === _column.prop)
          if (!column) {
            // 删除上次保存的无效column配置
            checkedOptions.splice(i, 1)
            i--
          } else if (option.t_label !== column.t_label) {
            // 以columns的配置 更新最新 t_label 保证 ColumnsPopover 展示的选中值 和 最新的columns 名称一致
            option.t_label = column.t_label
          }
        }
        // this.checkedOptions = res.columns
        this.checkedOptions = checkedOptions

        // todo searchForms todo....
      })
    },
    // 修改 快捷forms 的提交操作
    selectedSettingSubmit(group, dialog) {
      // group: searchGroup 组件实例
      // dialog: 配置快捷forms 弹窗实例
      dialog.submitLoading = true
      setTimeout(() => {
        console.warn('todo...... checkedOptions 提交 commit', dialog.checkedOptions)
        dialog.submitLoading = false
        // dialog.visibleChange(false)
        this.$message.success(this.$t('adb.message.editSuccess'))
        // const forms = JSON.parse(JSON.stringify(this.formOptions.forms))
        const moreForms = this.formOptions.forms
        moreForms.forEach(v => {
          v.isMore = true
        })
        const defaultForms = dialog.checkedOptions.reduce((items, cur) => {
          const idx = moreForms.findIndex(v => v.prop === cur.prop)
          if (idx > -1) {
            // forms 内删除 确定的快捷方式
            const [item] = moreForms.splice(idx, 1)
            item.isMore = false
            // defaultForms 内添加 该item
            items.push(item)
          }
          return items
        }, [])
        // 重置 formOptions.forms
        this.formOptions.forms = defaultForms.concat(moreForms)

        // group.selectedSettingVisible = false
        group.selectedSettingVisibleChange(false)
      }, 500)
    },
    // 接口存储当前筛选数据 为tab
    saveFilterSubmit(group) {
      console.error('group, searchParams, saveFilterSubmit todo...', group, JSON.stringify(this.formParams))
      this.$message.error('保存一个新的 tab  && 提交接口 相关交互 等做对应的模块在说')
    },
    // 列表请求
    queryList() {
      this.options.loading = true
      const input = this.getRequestParams()
      console.warn('input', JSON.stringify(input))
      const p1 = getOrders(input).then((list) => {
        this.list = list
      })
      const p2 = getOrdersCount(input.filter).then((total) => {
        this.total = total
      })
      Promise.all([p1, p2])
        .catch((e) => {
          this.$message.error(e.response?.errors?.[0].message)
        })
        .finally(() => {
          this.options.loading = false
        })
    },
    // 目前删除只针对 标签删除(未兼容 popoverItem 和 moreItem 的 clear)
    deleteTag(form, searchParams) {
      console.log('deleteTag ', form, searchParams)
      if (form.prop === 'render') {
        // 额外处理逻辑
        searchParams.others = ''
        // searchParams.render = 'render reset.........'
      }
    }
  }
}
