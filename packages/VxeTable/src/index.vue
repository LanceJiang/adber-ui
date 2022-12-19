<!--
 申明： 本组件通过 vxe-table 插件 兼容目前项目 修整
 相关配置参考： https://xuliangzhan_admin.gitee.io/vxe-table/v3/#/table/api
 注意：
 1. columns: AdVxeTable 为了更方便兼容 AdTable(基于el-table 的封装组件) 将会默认对 没有设置 title(t_label > label -> title) 和 field(prop -> field) 做转译
 2. options: AdVxeTable 配置对象: tableOptions(vxeTable的配置) 和 options(除vxeTable配置以外的配置) 两个配置  AdTable只有一个options
 3. slots: slot fn 不同
    AdVxeTable:  default: (scope, h) => [<div>1</div> , <div>2</div>]
    AdTable:  default: (h, scope) => <div>1</div>
 -->
<script lang='jsx'>
import NoData from '@adber/adber-ui/packages/NoData'
import Icon from '@adber/adber-ui/packages/Icon'
import TableColumnsPopover from '@adber/adber-ui/packages/Table/src/TableColumnsPopover'
// import _ from 'lodash/lodash.min'
import { xeUtils, getDeepValue } from '@adber/adber-ui/src/utils'
import { t } from '@adber/adber-ui/src/locale'
export const tableProps = {
  list: {
    type: Array,
    default: () => []
  },
  /**
   * [{
   *     prop, // 属性名 field
   *     label, // 列名 (t_label) || title
   *     align, // 对齐方式
   *     width, // 列宽
   *     minWidth, // 最小列宽
   *     sortable, // 是否允许排列顺序
   *     formatter: function({row, column, cellValue}){}, // 格式化 [Function, Array, String]
   // *     （slots.default > formatter）
   *     slots: {
   *       // slots不同类型 scope 关键数据项描述
            // header: '#slotName || render function', // { $columnIndex, $rowIndex, rowIndex, $table, columnIndex, column } // rowIndex 是实际的 index $rowIndex 为虚拟渲染的 index
            // default: '#slotName || render function', // { $columnIndex, $rowIndex, $table, columnIndex, column, data, items, row, rowIndex } // items data
            // footer: '#slotName || render function', // { $columnIndex, $rowIndex, $table, columnIndex, column, data, items } // items [当前 行 的 内容数据列表] data [所有的footer行数据数组]
            default: 'imageView',
              // header: 'num_footer', // slot 写法
              footer: (args, h) => {
                const { items, _columnIndex } = args
                // 渲染类型1： 使用渲染函数
                // return [
                //   h('a-button', {
                //     style: {
                //       color: 'green'
                //     },
                //     on: {
                //     }
                //   }, `[累计]: ${items[_columnIndex]}`)]
                // 渲染类型2： 使用 JSX 渲染/
                return [
                  <a-button status="primary" size="mini">按钮</a-button>,
                  <span>累计：{ items[_columnIndex] }</span>
                ]
              }
   *     }
   * }]
   */
  columns: {
    // 可以配置(嵌套类型) [{title: '有children 的父级(类型一)', children: [{field, title,width....}]}, {field,title,width...}]
    type: Array,
    default: () => []
  },

  // 列表搜索参数
  searchParams: {
    type: Object,
    default: () => ({
      page: 1, // 页数
      pageSize: 20 // 页面条目
    })
  },
  // 选中column的配置参数
  checkedOptions: {
    type: Array,
    default: () => []
  },
  // 自定义配置列 相关参数
  columnsConfig: {
    type: Object,
    default: () => ({
      // defaultCheckedOptions: [], // [{t_label, prop, selected}]// Array 没有存储数据时 系统给予的默认配置
      columns: []
    })
  },
  total: {
    type: Number,
    default: 0
  }, // 总数
  /**
   * table 表格的控制参数
   * 具体配置参考 localTableOptions > defaultTableOptions
   */
  tableOptions: {
    type: Object,
    default: () => {
      return {}
    }
  },
  /**
   * table 额外自定义的表格控制参数
   * 具体配置参考 computedOptions > defaultOptions
   */
  options: {
    type: Object,
    default: () => ({})
  },
  // 选中行的数据
  // curRow: {
  //   type: Object
  // },
  sortConfig: {
    type: Object,
    default: () => ({
      trigger: 'cell',
      remote: true
    })
  }
}
/** 针对默认的 header 展示添加slot 并支持 字段提示: titleHelp */
const defaultRenderHeader = function($titleHelp = {}, props, h) {
  const { title } = props.column
  // console.error(props.column, 'column')
  // 1.针对 column 配置有 titleHelp 对象的 进行默认提示处理
  const { message, icon } = $titleHelp || {}
  let TitleHelp = ''
  if (message) {
    /* eslint-disable */
    // @ts-ignore
    TitleHelp = <el-tooltip placement="top">
      <div slot="content" domPropsInnerHTML={message}/>
      <i class={['tip-icon', icon || 'el-icon-question']}/>
    </el-tooltip>
    /* eslint-enable */
  }
  const _title = (title + '').includes('.') ? t(title) : title
  // console.log(_title, 'title...')
  return [
    <div class='slot_title-wrap'>
      <el-tooltip placement='top' content={_title}>
        <span class='label'>{_title}</span>
      </el-tooltip>
      {TitleHelp}
    </div>
  ]
}
// 针对默认的数据展示添加slot
const slotDefault = ({ row, column }, h) => {
  const val = row[column.property]
  // console.log('slotDefault VxeTable')
  // const _params = getDeepValue(column, ['params']) || {} // params: { ellipsis_line, placement }
  if (typeof val !== 'number') {
    return val || '-'
  }
  return val
}
const render = function(h) {
  const {
    curPageSelectLength,
    computedOptions,
    seqConfig,
    localTableOptions,
    total,
    list,
    tableOptions,
    searchParams
  } = this
  const tableOn = {
    'cell-click': ($event) => this.$emit('cellClick', $event), // args: { row, rowIndex, column } 当前点选即会触发
    'toggle-row-expand': ($event) => this.$emit('toggleRowExpand', $event),
    'sort-change': this.tableSortChange,
    'filter-change': this.filterChangeEvent,
    'checkbox-change': this.checkboxChange,
    'checkbox-all': this.checkboxChange,
    'current-change': this.currentChange,
    'hook:mounted': this.tableMounted
  }

  const scopedSlots_toolLeft = this.$scopedSlots.toolLeft
  return <div class='ad-vxe-table-warp'>
    {/* <div v-show={computedOptions.loading} v-loading={computedOptions.loading} class='tableLoading'></div> */}
    <div class='tableBody'>
      <vxe-toolbar class='toolBarWrap' ref='vxeToolBar'>
        <template slot='buttons'>
          {scopedSlots_toolLeft && scopedSlots_toolLeft({ curPageSelectLength })}
        </template>
        <div class='toolRight' slot='tools'>
          {/* 刷新 */}
          <el-tooltip placement="top" content={t('adb.refresh')}>
            <el-button type="default" class="icon-button" onClick={this.refreshHandler}>
              <Icon iconClass="ad-refresh" />
            </el-button>
          </el-tooltip>
          {/* columns过滤 */}
          <TableColumnsPopover
            value={this.checkedOptions}
            onInput={this.checkedOptionsChange}
            props={this.columnsConfig}
          />
        </div>
      </vxe-toolbar>
      {this.$slots.top}
      <div class='vxeTableParentEl'>
        {/* scroll-y={{ mode: 'wheel' }} todo height 问题是否可以解决 */}
        <vxe-table
          ref='vxeTable'
          class='vxeTable'
          v-loading={computedOptions.loading}
          seq-config={seqConfig}
          props={localTableOptions}
          data={list}
          filter-config={tableOptions.filterConfig}
          tree-config={tableOptions.treeConfig}
          on={tableOn}>
          <template slot='empty'>
            <NoData
              v-show={!computedOptions.loading}
              size={computedOptions.size}/>
          </template>
        </vxe-table>
      </div>
    </div>
    {/* 自定义 footerLeft */}
    <div class='tableFooterWrap'>
      <div class='footerLeft'>
        {this.$slots.footerLeft ||
          <div v-show={curPageSelectLength} class='selectedWrap'><span>{curPageSelectLength}</span>{t('adb.table.hasChecked')}</div>}
      </div>
      {/* --分页-- */}
      {
        total > 0 && computedOptions.showPagination && (<el-pagination
          total={total}
          currentPage={searchParams.page}
          pageSize={searchParams.pageSize}
          pageSizes={computedOptions.pageSizes}
          layout={computedOptions.layout}
          on={this.paginationListeners}
        >
        </el-pagination>)
      }
    </div>
    {/* 可以放弹窗/底部自定义 */}
    {this.$slots.default}
  </div>
}

export default {
  name: 'AdVxeTable',
  componentName: 'AdVxeTable',
  components: {
    TableColumnsPopover,
    NoData,
    Icon
  },
  props: tableProps,
  render,
  data() {
    const _this = this
    return {
      storageArr: [], // 临时存储的数组
      curPageSelect: [], // 当前列表选中的数据
      seqConfig: {
        seqMethod: ({
          // row,
          rowIndex,
          $seq,
          seq
          // ...opts
          // column,
          // columnIndex
        }) => {
          // console.log(rowIndex, $seq, seq, 'rowIndex, $seq, seq')
          const searchParams = this.searchParams
          if (rowIndex >= 0) {
            let _index = ++rowIndex
            if (searchParams.pageSize) {
              _index = searchParams.pageSize * (searchParams.page - 1) + _index
            }
            return _index
          } else if ($seq) {
            // (rowIndex 为 -1)$seq 为字符串(非子级为 '') 有这个表示为子级 对应的上级的 第几项
            // $seq: '2', seq: 1 // 2级
            // $seq: '2.1.1', seq: 1 // 多级
            // const []
            let _index = parseInt($seq) // '2.1.1' ->  2
            let $seq_suffix = ''
            if (searchParams.pageSize) {
              _index = searchParams.pageSize * (searchParams.page - 1) + _index
            }
            if ($seq.includes('.')) {
              // '2.1.1' -> .1.1
              $seq_suffix = $seq.replace(/^\d+(.*)$/, '$1')
            }
            return `${_index}${$seq_suffix}.${seq}`
          }
        }
      },
      paginationListeners: {
        'size-change': _this.handleSizeChange,
        'current-change': _this.handleIndexChange
      }
      // customDialogVisible: false,
    }
  },
  computed: {
    localTableOptions() {
      const defaultTableOptions = {
        // rowId: 'id', // 唯一id
        border: false,
        resizable: true, // 是否允许拖动
        highlightHoverRow: true,
        highlightCurrentRow: true, // 是否要高亮当前行
        // height: 'auto',
        height: '100%',
        showOverflow: 'tooltip', // 超出内容 省略号 同时添加 tooltip [纯展示数据才使用（若有其他功能加上这个 展示会有问题!!!!）] // todo./..
        showHeaderOverflow: 'tooltip', // 超出内容 省略号 同时添加 tooltip // title, ellipsis
        // showHeaderOverflow: false, // 超出内容 省略号 同时添加 tooltip // title, ellipsis
        showFooterOverflow: 'tooltip', // 超出内容 省略号 同时添加 tooltip // title, ellipsis
        autoResize: true
        // scrollX: {
        //   oSize: 50
        //   // gt: 100
        // },
        // scrollY: {
        //   oSize: 50
        //   // gt: 100
        // }
      }
      return { ...defaultTableOptions, rowClassName: this.customRowBgc, sortConfig: this.sortConfig, ...this.tableOptions }
    },
    localColumns() {
      const { showIndex, multipleSelect } = this.computedOptions //  showFilling,
      const _columns = []

      // 序号
      showIndex && _columns.push({
        type: 'seq',
        title: 'No.',
        resizable: false,
        align: 'left',
        width: 60,
        fixed: 'left'
      })
      // 多选
      multipleSelect && _columns.push({
        showHeaderOverflow: false,
        showOverflow: false,
        resizable: false,
        type: 'checkbox',
        // width: '30px',
        width: '40px',
        fixed: 'left'
      })

      const realColumns = this.$_.cloneDeep(this.columns.filter(Boolean))

      // 空白格填充
      let fillSpaceColumns = [{ minWidth: 0, slots: { default: () => '' } }]
      if (realColumns.some(v => !v.fixed)) {
        fillSpaceColumns = []
      }
      // console.error('重新渲染生成 localColumns')
      // 优化：涉及到columns 中 column 的 slots 是 string 类型 进行 slotScope 替换的 由于引用关系 导致 渲染相互覆盖的问题
      return _columns.concat(realColumns, fillSpaceColumns)/* , showFilling ? [{
        title: '',
        align: 'center',
        minWidth: 0,
        slots: { default: () => '' }
      }] : []) */
    },
    computedOptions() {
      const defaultOptions = {
        // el-table 配置
        size: 'medium', // 仅针对无数据配置 尺寸类型 (弹窗建议使用 mini)

        // 分页器参数
        showPagination: true, // 是否展示 分页器栏
        pageSizes: [20, 50, 100, 500, 1000, 10000], // 页面配置 todo
        layout: 'total, sizes, prev, pager, next, jumper',

        // 额外table自定义参数
        showIndex: false, // 是否展示序号
        showFilling: true, // 是否默认填充空白
        multipleSelect: false, // 是否多选
        // multipleSelectedKey: 'id', // 根据 该值 查找当前页面数据是否包含当前数据 添加 多选被选中的状态
        // multipleSelectedLabel: 'name', // 多选展示的 label
        // curRowKey: 'id', // 根据 该值 查找当前页面数据是否包含当前数据 添加 高亮状态
        loading: false // 是否展示loading
      }
      return {
        ...defaultOptions,
        ...this.options
      }
    },
    curPageSelectLength() {
      // if (!this.computedOptions.multipleSelect) return 0
      const curPageSelect = this.curPageSelect
      if (Array.isArray(curPageSelect)) return curPageSelect.length
      return 0
    }
  },
  created() {
    // 有用到默认功能后放出 联接
    /* this.$nextTick(() => {
      // 手动将表格和工具栏进行关联
      this.$vxeTable.connect(this.$refs.vxeToolBar)
    }) */

    // 监听 父级调用 AdVxeTable 的 内部方法 触发
    this.$on('AdVxeTableAction', (handlerArr = [], params) => {
      // console.log(handlerArr, 'XTableAction handlerArr params', params)
      this.$nextTick(() => {
        const fn = getDeepValue(this, handlerArr)
        if (typeof fn === 'function') {
          if (params !== undefined) {
            fn(params)
          } else {
            fn()
          }
        }
      })
    })
  },
  mounted() {
    if (this.columns && this.columns.length) {
      this.loadColumn(this.localColumns)
    }
  },
  watch: {
    list: {
      // 监听 list发生变化  （多选时 切换页面做触发...）
      handler: function(newList, oldList) {
        // this.updateSelectedRow()
        this.$nextTick().then(this.handleDefaults)
      }
      // deep: true
    },
    // curRow: {
    //   handler: function(newList, oldList) {
    //     this.updateSelectedRow()
    //   }
    // },
    //  columns 动态支持
    columns: {
      handler: function(newList, oldList) {
        if (this.$vxeTable) {
          this.loadColumn(this.localColumns)
        } else {
          this.$nextTick(() => {
            this.loadColumn(this.localColumns)
            // setTimeout(() => {
            //   this.updateSelectedRow()
            // }, 10)
          })
        }
      }
      // deep: true
    },
    searchParams(val) {
      // 重新请求后 更新选中的records
      this.checkboxChange({ records: [] })
    },
    // 对于options中多选配置项值的变化触发loadColumn方法（如动态变更是否展示多选框）
    'options.multipleSelect': {
      handler(val) {
        this.$nextTick(() => {
          this.loadColumn(this.localColumns)
        })
      }
    }
  },
  methods: {
    handleDefaults() {
      // this.sortConfig && this.handleDefaultSort()
      const localTableOptions = this.localTableOptions
      const treeConfig_expandAll = getDeepValue(localTableOptions, ['treeConfig', 'expandAll'])
      treeConfig_expandAll && this.$vxeTable.setAllTreeExpand(true)
      // console.log('default 渲染 后期对其他相关 再进一步优化 todo...')
    },
    /**
     * 对列表的 sort 进行更新（使用场景：table columns 删除 新增 替换）
     * // sortConfigs: string | { field: string | ColumnInfo, order: 'desc' | 'asc' | null } | { field: string | ColumnInfo, order?: 'desc' | 'asc' | null }[],
     * // order?: 'desc' | 'asc' | null
     */
    handleDefaultSort(sortConfig, order) {
      this.$vxeTable.sort(sortConfig, order)
    },
    loadColumn(columns) {
      // 跨层级 传入 会变成 renderFunction
      const $scopedSlots = this.$scopedSlots
      const _this = this
      // console.error(this.columns, 'columns', _this)
      // console.log('loadColumn $scopedSlots', columns, $scopedSlots)
      xeUtils.eachTree(columns, function(column) {
        // if (!column) return
        if (!column.title) { // 是否在外部通过包装函数处理 title && field todo...  && 若不通过该 loadColumn 方法加载， 是否可以得到优化 todo （children 处理） 待验证
          column.title = column.t_label || column.label // todo ???
        }
        if (!column.field) {
          column.field = column.prop // todo ???
        }
        // 对非组件级内置的 column类型 且 未定义formatter 进行默认 default处理
        if (!column.type && !column.formatter) {
          if (!column.slots) {
            column.slots = { default: slotDefault }
          } else if (!column.slots.default) {
            // 针对没有 column slot default 的 数据进行处理
            column.slots.default = slotDefault
          }
        } else {
          column.slots = column.slots || {}
        }
        // console.log(column, 'column.slots .....', column.slots)
        const setSlotFn = (() => {
          return process.env.NODE_ENV === 'development' ? (_slots, type, fn, _slotName) => {
            if (!fn) {
              _this.$log(`当前定义的 slots:${type} [${_slotName}] 没有设置`, 'warning', 'orange')
            }
            _slots[type] = fn || null
          } : (_slots, type, fn) => {
            _slots[type] = fn || null
          }
        })()
        const slots_key = Object.keys(column.slots || {})
        // headerName slot header 提示
        let slots_headerName = ''
        if (slots_key.length) {
          const slots = column.slots
          // const field = column.field
          slots_key.map(type => {
            // 如果是 string 类型 使用 slotScope
            const slotName = slots[type]
            let _slotName = ''
            if (typeof slotName === 'string') {
              if (type === 'header') {
                slots_headerName = slotName
              }
              _slotName = slotName
            }
            if (_slotName) {
              const fn = $scopedSlots[_slotName]
              setSlotFn(column.slots, type, fn, _slotName)
            }
          })
        }
        column.titleHelp && console.warn(column, 'column', JSON.stringify(column))
        const slots_header = column.slots.header
        const $titleHelp = column.titleHelp // || column._titleHelp
        delete column.titleHelp
        if (slots_header) {
          // 若自定义过 header 将不做额外处理
          $titleHelp && process.env.NODE_ENV === 'development' && _this.$log(`当前定义的 slots:header [${slots_headerName}] 已与默认 titleHelp 提示冲突 请在 header 定义 div.slot_title-wrap 添加 设置`, 'warning', 'orange')
        } else {
          // if (!column.type)
          column.slots.header = defaultRenderHeader.bind(_this, $titleHelp)
        }
      })
      // console.log(columns, 'columns', defaultRenderHeader, xeUtils, slotDefault)
      return this.$vxeTable.loadColumn(columns)
    },
    updateDialogVisible(bool) {
      this.customDialogVisible = bool
    },
    tableMounted() {
      this.$vxeTable = this.$refs.vxeTable
    },
    // 更新选中行
    updateSelectedRow() {
      const { curRowKey = 'id' } = this.computedOptions
      const curRow = this.curRow || {}
      if (!curRow[curRowKey]) return // 没有选中项的不做处理
      // 高亮数据判断
      if (curRow && Object.keys(curRow).length) {
        let curRowIndex = -1
        curRowIndex = this.list.findIndex(_item => {
          return _item[curRowKey] === curRow[curRowKey]
        })
        this.$nextTick(() => {
          // eslint-disable-next-line
          curRowIndex > -1 && this.$vxeTable.setCurrentRow(this.list[curRowIndex]) // 高亮原本被选中的数据
        })
      }
    },
    // 排序
    tableSortChange({ column, property: prop, order }) {
      // console.error(arguments, 'tableSortChange.... desc:降序(el-table: descending),  asc:升序(el-table: ascending), null')
      const sortParams = {
        prop,
        // 升序/降序的 描述不同 el-table 为了统一 改为el的order描述
        order: order ? `${order}ending` : order
      }
      this.$emit('update:searchParams', { ...this.searchParams, ...sortParams })
      // this.$vxeTable.sort(sort, order)
      this.$emit('sortChange', sortParams)
    },
    filterChangeEvent({ column, values }) {
      if (!this.tableOptions.filterConfig || !this.tableOptions.filterConfig.remote) {
        return
      }
      const _searchParam = {}
      _searchParam[column.property] = values
      this.$emit('update:searchParams', { ...this.searchParams, ..._searchParam })
    },
    resetAllCheckboxRow() {
      // 全部清空 并 触发 checkboxChange
      this.$vxeTable.triggerCheckAllEvent(null, false)
    },
    // 切换每页显示的数量
    handleSizeChange(pageSize) {
      // console.error(' handleSizeChange pageSize', pageSize)
      this.$emit('update:searchParams', {
        ...this.searchParams,
        pageSize
      })
    },
    // 切换页码
    handleIndexChange(index) {
      // console.error(' handleIndexChange index', index)
      this.$emit('update:searchParams', {
        ...this.searchParams,
        page: index
      })
      // this.searchParams.page = index
    },
    // 支持多选时 行选中触发
    checkboxChange({ records }) {
      // console.warn(records.concat(this.storageArr), 'currentChange')
      console.log('checkboxChange', records)
      this.curPageSelect = records
      // this.$emit('checkboxChange', records.concat(this.storageArr)) // 用于多切换页 保存的情况
      this.$emit('checkboxChange', records)
    },
    // 当选中行发生变化才会触发
    currentChange(args) {
      // { newValue, oldValue, row, rowIndex, column, columnIndex, $columnIndex, $event }
      // console.log('currentChange...............', args)
      // 更新当前选中行
      this.$emit('update:curRow', args.row)
      // 选中当前列 触发
      this.$emit('currentChange', args)
    },
    // 可用于父级 通过 ref 获取该实例 手动切换
    toggleCheckboxRowByIndex(index, bool) {
      this.$vxeTable.toggleCheckboxRow(this.list[index])
    },
    // 用于父级 关于 不在当前页的选中数据 处理 删除 使用 $ref[父级定义的key].storageArrRemove()
    storageArrRemove(row) {
      const {
        multipleSelectedKey = 'id'
      } = this.computedOptions
      const index = this.storageArr.findIndex(item => item[multipleSelectedKey] === row[multipleSelectedKey])
      if (index > -1) {
        this.storageArr.splice(index, 1)
      }
    },
    // 列表配置相关操作项方法集合
    refreshHandler() {
      // 默认刷新 param 参数
      this.$emit('update:searchParams', { ...this.searchParams, page: 1 })
      // 额外相关操作
      this.$emit('refreshHandler')
    },
    checkedOptionsChange(options) {
      console.log(options, 'options')
      this.$emit('update:checkedOptions', options)
    },
    // 自定义表格行的颜色--表格展开的子级设置为灰色
    customRowBgc({ level }) {
      return level === 0 ? 'parent_row_bgc' : 'sub_row_bgc'
    },
    // 自定义筛选配置 提交
    customSortSubmit(newSearchParams) {
      // 清除排序
      this.$vxeTable.clearSort()
      this.$emit('update:searchParams', newSearchParams)
    }
  }
}
/**
 AdVxeTable的 组件配置
 // 需要展示的列配置
 columns = [
 {
        field: '同 elTable 的 prop',
        title: '同 elTable 的 label',
        align: 'center',
        width: 100,
        titleHelp: { message: 'titleHelp 测试' }, // 自定义用户提示
        params: {
          // 如果有多行省略号处理 ellipsis_line 后续是否处理todo
          ellipsis_line: 2 // Number
        }
    },
 {
        field: 'field',
        title: 'title',
        width: '160',
        slots: {
          // slots不同类型 scope 关键数据项描述
          // header: '#slotName || render function', // { $columnIndex, $rowIndex, rowIndex, $table, columnIndex, column } // rowIndex 是实际的 index $rowIndex 为虚拟渲染的 index
          // default: '#slotName || render function', // { $columnIndex, $rowIndex, $table, columnIndex, column, data, items, row, rowIndex } // items data
          // footer: '#slotName || render function', // { $columnIndex, $rowIndex, $table, columnIndex, column, data, items } // items [当前 行 的 内容数据列表] data [所有的footer行数据数组]
          default: 'imageView',
            // header: 'num_footer', // slot 写法
            footer: (args, h) => {
              const { items, _columnIndex } = args
              // 渲染类型1： 使用渲染函数
              // return [
              //   h('el-button', {
              //     style: {
              //       color: 'green'
              //     },
              //     on: {
              //     }
              //   }, `[累计]: ${items[_columnIndex]}`)]
              // 渲染类型2： 使用 JSX 渲染/
              return [
                <el-button status="primary" size="mini">按钮</el-button>,
                <span>累计：{ items[_columnIndex] }</span>
              ]
          }
       }
    }
 ]
 */
/*
<XTable
    :searchParams.sync='searchParams'  请求列表的参数对象({page:1, pageSize: 20})
    :list="list" // 后台请求的列表数据
    :total="total" // 该列表总共有多少数据
    :options='options' // 针对XTable 这个组件本身 自定义 的相关配置
    :tableOptions="tableOptions" // table相关的 配置对象
    :columns="columns" // 需要展示的列配置 // 参考上面的 columns
    @refreshHandler="refreshHandler" 刷新功能额外操作 (已经内置刷新列表功能 page:1)
    :columnsConfig="columnsConfig" // 自定义配置列表 展示控制 { defaultCheckedOptions: [], columns: []}
    @checkboxChange="checkboxChange" // 若存在多选的情况 将目前被选中的数据 传递给父组件
    :curRow="testCurRow" // 当前高亮的 数据  【需要高亮上次数据必传】
/>
*/
</script>
