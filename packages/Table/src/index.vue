<script lang="jsx">
import NoData from 'adber-ui-demo/packages/NoData'
import Icon from 'adber-ui-demo/packages/Icon'
import Locale from 'adber-ui-demo/src/mixins/locale'
// import { t } from 'adber-ui-demo/src/locale'

import TableColumnsPopover from './TableColumnsPopover'

export const tableProps = {
  // 数据列表
  list: {
    type: Array,
    default: () => []
  },
  /**
   * [{
   *     prop, // 属性名
   *     label, // 列名
   *     align, // 对齐方式
   *     width, // 列宽
   *     minWidth, // 最小列宽
   *     sortable, // 是否允许排列顺序
   *     formatter: function(row, column){}, // 返回需要展示的数据
   *     slots: { header: fn || slotName, default: fn || slotName } （slots.default > formatter）
   * }]
   */
  columns: {
    type: Array,
    default: () => []
  },

  // 列表搜索参数
  searchParams: {
    type: Object,
    default: () => ({
      page: 1, // 页数
      pageSize: 20, // 页面条目
      sortParams: {} // 排序额外参数
    })
  },
  // 选中column的配置参数
  checkedOptions: {
    type: Array,
    default: () => []
  },
  columnsConfig: {
    type: Object,
    default: () => ({
      // defaultCheckedOptions: [], // [{t_label, prop, selected}]// Array 没有存储数据时 系统给予的默认配置
      // checkedOptions: [], // [{t_label, prop, selected}]
      columns: []
    })
  },
  total: {
    type: Number,
    default: 0
  }, // 总数
  /**
   * table 表格的控制参数
   * 具体配置参考 computedOptions 默认参
   */
  options: {
    type: Object,
    default: () => ({})
  }
}

/** 针对默认的 header 展示添加slot */
/*
const slotHeader = function (titleHelp = {}, props) {
  // console.error(props, 'props.column...', titleHelp)
  // const { titleHelp, label } = props.column
  // const { label } = props.column
  const label = t(props.column.label)
  // 1.针对 column 配置有 titleHelp 对象的 进行默认提示处理
  const { message, icon } = titleHelp || {}
  let TitleHelp = ''
  if (message) {
    /!* eslint-disable *!/
    // @ts-ignore
    TitleHelp = <el-tooltip placement="top" content={message}>
      ??
    </el-tooltip>
    /!* eslint-enable *!/
    // 若有 iconfont 样式
    // <i class={['iconfont', icon || 'icon-question']}/>
  }
  // 2.若有自定义筛选配置
  // todo...
  return (
    <div class="slot_title-wrap">
      <el-tooltip placement="top" content={label}>
        <span class="label">{label}</span>
      </el-tooltip>
      {TitleHelp}
    </div>
  )
}
*/
const slotDefault = ({ row, column }) => {
  // if (Object.keys(column).length) console.error(row, column, '     row, column, slotDefault')
  const val = row[column.property]
  if (typeof val !== 'number') {
    return val || '-'
  }
  return val
}

const columnSlots = (column, _this) => {
  // const { $slots } = _this
  const { $scopedSlots, $createElement } = _this
  let local_slots = {}
  // 针对未设置 formatter 的添加默认 slotDefault
  if (!column.formatter) {
    local_slots = {
      // default: slotDefault(column)
      default: slotDefault
    }
  }
  // 新增默认header 超出隐藏&提示(?&问号提示)
  // local_slots.header = slotHeader.bind(_this, column.titleHelp)
  const slots_key = Object.keys(column.slots || {})
  // let slots_headerName = ''
  if (slots_key.length) {
    slots_key.forEach((type) => {
      const slotName = column.slots[type]
      switch (typeof slotName) {
        case 'string':
          /* if (type === 'header') {
           slots_headerName = slotName
         } */
          // local_slots[type] = $slots[slotName] || null
          local_slots[type] = $scopedSlots[slotName] || null
          break
        case 'function': // 非 vue3 无法直接通过全局获取到 createElement 进行强制绑定
          local_slots[type] = slotName.bind(null, $createElement)
          break
        default:
      }
    })
  }

  return local_slots
}
const render = function (h) {
  const { computedOptions, list, total, searchParams, checkedOptions, columnsConfig, t } = this
  // console.error(checkedOptions, 'checkedOptions')
  // todo 测试...
  // const listeners = {
  //   // 事件
  //   onSortChange: this.tableSortChange,
  //   onRowClick: this.handleCurrentChange,
  //   onSelectionChange: this.handleSelectionChange,
  // }
  const paginationListeners = {
    'size-change': this.handleSizeChange,
    'current-change': this.handleIndexChange
  }
  return (
    <div class="ad-table-warp">
      <div class="tableBody">
        {computedOptions.showTools && (
          <div class="toolBarWrap">
            <div class="toolLeft">{this.$slots.toolLeft}</div>
            <div class="toolRight">
              {/* 刷新 */}
              <el-tooltip placement="top" content={t('adb.refresh')}>
                <el-button type="default" class="icon-button" onClick={this.refreshHandler}>
                  <Icon icon="refresh" />
                </el-button>
              </el-tooltip>
              {/* columns过滤 PFilterColumn */}
              <TableColumnsPopover
                value={checkedOptions}
                onInput={this.checkedOptionsChange}
                props={columnsConfig}
              />
            </div>
          </div>
        )}
        {this.$slots.top}
        <div class="tableParentEl">
          <el-table
            ref="ELTable"
            class="ad-table"
            tooltip-effect="dark"
            border
            size={computedOptions.size}
            v-loading={computedOptions.loading}
            props={computedOptions}
            data={list}
            style={`height: ${computedOptions.height}`}
            on-sort-change={this.tableSortChange}
            on-row-click={this.handleCurrentChange}
            on-selection-change={this.handleSelectionChange}
          >
            isSelection multipleSelect
            {computedOptions.multipleSelect && (
              <el-table-column type="selection" width="40" fixed="left" />
            )}
            {this.localColumns.map((column, index) => {
              const {
                label,
                t_label,
                align,
                resizable,
                showOverflowTooltip,
                slots,
                adb_slots,
                ...opts
              } = column
              const label_ = t_label ? t(t_label) : label
              return (
                <el-table-column
                  key={index}
                  props={opts}
                  label={label_}
                  scopedSlots={adb_slots}
                  align={align ?? computedOptions.align}
                  resizable={resizable ?? computedOptions.resizable}
                  showOverflowTooltip={showOverflowTooltip ?? computedOptions.showOverflowTooltip}
                ></el-table-column>
              )
            })}
            <template slot="empty">
              <NoData />
            </template>
          </el-table>
        </div>
      </div>
      {/* --分页-- */}
      {computedOptions.showPagination && (
        <el-pagination
          total={total}
          currentPage={searchParams.page}
          pageSize={searchParams.pageSize}
          pageSizes={computedOptions.pageSizes}
          layout={computedOptions.layout}
          on={paginationListeners}
        />
      )}
    </div>
  )
}
export default {
  name: 'Table',
  mixins: [Locale],
  components: {
    NoData,
    Icon,
    // PFilterColumn,
    TableColumnsPopover
  },
  props: tableProps,
  render,
  computed: {
    computedOptions() {
      return {
        ...{
          // el-table参数
          height: '100%', // 高度
          maxHeight: '100%', // 最大高度
          size: 'medium', // 尺寸类型 (弹窗建议使用 mini)
          // sortOrders: ['ascending', 'descending'], null

          // 分页器参数
          pageSizes: [10, 20, 40, 100],
          layout: 'total, sizes, prev, pager, next, jumper',

          // 额外table参数
          loading: false, // 是否展示 tableLoading
          multipleSelect: false, // 是否多选 table
          rowKey: 'id', // 根据 该值 查找当前页面数据是否包含当前数据 添加 多选被选中的状态: Function(row)/string
          currentRowKey: 'id', // 根据 该值 查找当前页面数据是否包含当前数据 添加 高亮状态: string/number
          align: 'left', // columnItem 对齐方式
          resizable: true, // ColumnItem 是否允许拖动
          showOverflowTooltip: true, // columnItem 超出内容 省略号 同时添加 tiptool
          updateSort: false, // 列表变更 是否更新 sort 排序的 column

          showPagination: true, // 是否加载table 分页栏
          showTools: true // 是否展示table tools栏目
        },
        ...this.options
      }
    },
    localColumns() {
      return this.columns.map((column) => {
        return {
          ...column,
          adb_slots: columnSlots(column, this)
        }
      })
    }
  },
  watch: {
    list() {
      this.$nextTick().then(this.handleDefaults)
    }
  },
  methods: {
    handleDefaults() {
      // 更新 列表 sort
      const sortParams = this.searchParams.sortParams || {}
      if (this.computedOptions.updateSort && sortParams.prop) {
        this.tableUpdateSort(sortParams)
      }
    },
    // 排序
    tableSortChange({ column, prop, order }) {
      // console.error(column, prop, order, 'column, prop, order tableSortChange', ...arguments)
      const sortParams = {
        prop,
        order
        // order: order && order === 'ascending' ? 1 : -1,
        // order: order && order === 'ascending' ? 'ASC' : 'DESC',
      }
      this.$emit('update:searchParams', {
        ...this.searchParams,
        sortParams
      })
      // this.$emit('sort-change', searchParam)
    },
    handleCurrentChange(row) {
      // console.warn(row, 'handleCurrentChange row')
      // 选中当前列 触发
      this.$emit('handleCurrentChange', row)
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
    // 刷新列表
    refreshHandler() {
      this.handleIndexChange(1)
      // 额外相关操作
      this.$emit('refreshHandler')
    },
    handleSelectionChange(row) {
      this.$emit('selection-change', row)
    },
    checkedOptionsChange(props) {
      // console.error('checkedOptionsChange props', props)
      this.$emit('update:checkedOptions', props)
    },
    // 可用于父级 通过 ref 获取该实例 手动切换
    toggleRowSelectionByIndex(index, bool = true) {
      this.$refs.ELTable.toggleRowSelection(this.list[index], bool)
    },
    // 更新选中行
    updateSelectedRow() {
      const { currentRowKey = 'id' } = this.computedOptions
      const curRow = this.curRow || {}
      if (!curRow[currentRowKey]) return // 没有选中项的不做处理
      // 高亮数据判断
      if (curRow && Object.keys(curRow).length) {
        let curRowIndex = -1
        curRowIndex = this.list.findIndex((item) => {
          return item[currentRowKey] === curRow[currentRowKey]
        })
        this.$nextTick(() => {
          // eslint-disable-next-line no-unused-expressions
          curRowIndex > -1 && this.$refs.ELTable.setCurrentRow(this.list[curRowIndex]) // 高亮原本被选中的数据
        })
      }
    },
    // sort { prop: string, order: ascending/descending/null }
    tableUpdateSort(sortParams = { prop: '', order: 'ascending' }, init = true) {
      try {
        // // 会做更新
        // this.$refs.ELTable.sort(config.sort, config.order)
        // init 则不更新 tableSortChange
        this.$refs.ELTable.store.commit('sort', {
          ...sortParams,
          init
        })
        // eslint-disable-next-line no-empty
      } catch (e) {}
    }
  }
  // created() {
  //   window.TableComponent = this
  // },
  // updated() {
  //   // 仅用于测试 success todo
  //   console.error(t('adb.noData'), 'adb.noData  adb 内部公用项目')
  //   console.error(t('route.location'), 'route.location   外部项目')
  // }
}
</script>