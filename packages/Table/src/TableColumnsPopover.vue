<template>
  <el-popover popper-class="ad-column-popover" placement="bottom-end" v-model="visible">
    <el-tooltip slot="reference" placement="top" :content="t('adb.column')">
      <el-button type="default" class="icon-button">
        <Icon iconClass="ad-hide_column"/>
      </el-button>
    </el-tooltip>
    <div class="columns-contents" v-loading="loading">
      <div class="title">{{ t('adb.columnsPop.title') }}</div>
      <div class="label">{{ t('adb.columnsPop.selected') }}</div>
      <el-checkbox class="el-select-dropdown__item title" @change="onCheckAllChange" :indeterminate="indeterminate" v-model="checkAll">
        {{ t('adb.selectAll') }}
      </el-checkbox>
      <div class="divider"/>
      <el-scrollbar>
        <ul class="el-scrollbar__view el-select-dropdown__list">
          <!-- 暂时没有嵌套的需求 若有 后续再做调整优化 -->
            <DraggableNest
              class="draggableWrap"
              v-model="checkedOptions"
              :move="onMove"
              :removeHandler="deleteCheckedOptions"
            />
            <NoData v-show="!checkedOptions.length" />
        </ul>
      </el-scrollbar>
      <div class="divider"/>
      <div class="label">{{ t('adb.columnsPop.options') }}</div>
      <el-scrollbar>
        <ul class="el-scrollbar__view el-select-dropdown__list">
          <el-checkbox-group :value="checkedList" @input="onChange">
<!--            columns-->
            <el-checkbox
              class="el-select-dropdown__item"
              v-for="item in columns"
              v-show="!checkedList.includes(item.prop)"
              :title="t(item.t_label || item.label)"
              :key="item.prop"
              :label="item.prop"
              :disabled="!!item.fixed"
            >
              {{ t(item.t_label || item.label) }}
            </el-checkbox>
          </el-checkbox-group>
        </ul>
      </el-scrollbar>
      <div class="footer">
        <el-button size="small" @click="handleReset">
          {{ t('adb.btn.restore') }}
        </el-button>
        <el-button type="primary" size="small" @click="handleSubmit">
          {{ t('adb.btn.save') }}
        </el-button>
      </div>
    </div>
  </el-popover>
</template>
<script>
import Icon from '@adber/adber-ui/packages/Icon'
import NoData from '@adber/adber-ui/packages/NoData'
import DraggableNest from '@adber/adber-ui/packages/DraggableNest'
import Locale from '@adber/adber-ui/src/mixins/locale'

// const API = {}
export default {
  name: 'AdTableColumnsPopover',
  mixins: [Locale],
  components: {
    Icon,
    NoData,
    DraggableNest
  },
  props: {
    columns: {
      // required: true, // 即 tableColumns的 配置
      type: Array,
      default: () => []
    },
    /* // 选中的 columns
    /!**
     * 由于 当时找carp 确认的时候，
     * 可能一个页面多个tabs 有多个table 会同时请求 那接口请求将直接放置外部父级组件
     *
     * 则： 页面初始化 获取相关配置的请求， 然后等接口获取成功 做赋值，
     *     若 不成功 使用默认的 defaultCheckedOptions 或者 columns 进行转换一
     *!/
    checkedOptions */
    value: {
      type: Array,
      default: () => []
      // todo dynamic: 标记column是否根据本地的column进行label替换【Boolean】
      /* type Options = { t_label: string; label: string; prop: string; fixed: boolean|string }[]
 */
    },
    // 默认的展示列配置
    defaultCheckedOptions: {
      // 同value 配置
      type: Array,
      default: null
    },
    // todo delete maybe
    type: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      // 选择全部
      checkAll: false,
      indeterminate: false,
      visible: false,
      loading: false,
      checkedList: [],
      checkedOptions: []
    }
  },
  computed: {
    // unsetColumns() {
    //   return this.columns.filter(v => {
    //     checkedList
    //   })
    // }
  },
  watch: {
    value: {
      immediate: true, // columns
      handler(value) {
        if (this.visible) {
          this.initCheckedOptions()
        }
      }
    },
    visible(bool) {
      // console.error('visible change', bool)
      if (bool) {
        // 展示的时候初始化
        this.initCheckedOptions()
      }
    }
  },
  created() {
    window.Popover = this
  },
  methods: {
    initCheckedOptions() {
      // 本地留存
      const checkedOptions = this.checkedOptions = JSON.parse(JSON.stringify(this.value || []))
      this.getCheckedOptions(checkedOptions)
      this.getCheckedSelectAll()
    },
    onMove({ relatedContext, draggedContext }) {
      const relatedElement = relatedContext.element
      const draggedElement = draggedContext.element
      // fixed 表示 固定的项
      return (
        (!relatedElement || !relatedElement.fixed) && !draggedElement.fixed
      )
    },
    deleteCheckedOptions(item, idx, local_list) {
      // console.error(item, idx, local_list, 'prop, idx, local_list deleteCheckedOptions ')
      if (!item.fixed) {
        local_list.splice(idx, 1)
        this.getCheckedOptions(local_list)
        this.getCheckedSelectAll()
      }
    },
    onCheckAllChange(checked) {
      this[checked ? 'onCheckAllSelect' : 'onCheckAllClear']()
    },
    onCheckAllSelect() {
      const columns = this.columns
      // 标记fixed的项目 表示始终保留
      const checkedOptions = JSON.parse(JSON.stringify(columns.filter(v => v.fixed)))
      // 将原来不存在的配置项按照默认的排序进行添加
      columns.map(v => {
        if (checkedOptions.every(_v => _v.prop !== v.prop)) {
          checkedOptions.push(v)
        }
      })
      this.getCheckedOptions(checkedOptions)
      // 总控制器状态更新
      this.indeterminate = false
      this.checkAll = true
    },
    onCheckAllClear() {
      const columns = this.columns
      // 标记fixed的项目 表示始终保留
      const checkedOptions = JSON.parse(JSON.stringify(columns.filter(v => v.fixed)))
      this.checkedList = checkedOptions.map(v => v.prop)
      this.checkedOptions = checkedOptions
      this.getCheckedSelectAll()
    },

    onChange(list) {
      const columns = this.columns
      const checkedOptions = this.checkedOptions
      // 删除 已被取消的项目
      for (let i = 0; i < checkedOptions.length; i++) {
        const option = checkedOptions[i]
        const _index = list.findIndex(value => option.prop === value)
        // 如果当前项目在 新的 checkedOptions 找不到 进行删除
        if (_index === -1) {
          checkedOptions.splice(i, 1)
          i--
        } else {
          // 找的到相同的 就把该项目删除 减少下次遍历的次数
          list.splice(_index, 1)
        }
      }
      checkedOptions.push(...list.map(value => columns.find(v => v.prop === value)))
      this.getCheckedOptions(checkedOptions)
      this.getCheckedSelectAll()
    },
    getCheckedOptions(options = this.checkedOptions) {
      // const topFixed = []
      // const bottomFixed = []
      const fixed = []
      const checkedOptions = JSON.parse(JSON.stringify(options))
      for (let i = 0; i < checkedOptions.length; i++) {
        const v = checkedOptions[i]
        if (v.fixed) {
          // left: 置顶, right: 置底
          // (v.fixed === 'left' ? topFixed : fixed).push(v)
          fixed.push(v)
          checkedOptions.splice(i, 1)
          i--
        }
      }
      const res = checkedOptions.concat(fixed)
      // console.log(res.map(v => v.prop), 'checkedList ............. checkedOptions', checkedOptions)
      this.checkedList = res.map(v => v.prop)
      this.checkedOptions = res
      return res
    },
    getCheckedSelectAll() {
      const columns = this.columns
      const checkedOptions = this.checkedOptions
      const listLen = checkedOptions.length
      // 总控制器状态更新
      this.indeterminate = !!listLen && listLen < columns.length
      this.checkAll = listLen === columns.length
    },
    // 提交最新的列配置
    async handleSubmit() {
      // todo 提交接口处理
      this.$emit('input', this.checkedOptions)
      this.visible = false
      /* const { checkedOptions, type } = this
      const filterOptions = {
        filterColumn: JSON.stringify(checkedOptions)
      }
      this.loading = true
      try {
        await API.BaseApi.saveTableFilter({
          type,
          filterJson: filterOptions
        })
        this.$message.success('message.saveSuccess')
      } catch (error) {
        console.log(error)
      } finally {
        this.loading = false
        this.visible = false
      } */
      // this.$emit('input', this.columnProps)
    },

    // 重置列默认
    handleReset() {
      const columns = this.columns
      const defaultCheckedOptions = this.defaultCheckedOptions
      let checkedOptions = JSON.parse(JSON.stringify(columns))
      if (Array.isArray(defaultCheckedOptions)) {
        checkedOptions = JSON.parse(JSON.stringify(defaultCheckedOptions))
      }
      this.getCheckedOptions(checkedOptions)
      this.getCheckedSelectAll()
    }
  }
}

</script>
