<script lang="jsx">
import { t } from '@adber/adber-ui/src/locale'
import DraggableNest from '@adber/adber-ui/packages/DraggableNest'
import NoData from '@adber/adber-ui/packages/NoData'

const render = function (h) {
  const { title, tips, visible, options, selectedMax, checkedList, checkedOptions, submitLoading } = this
  const slotTips = this.$slots.tips
  return <el-dialog
    visible={visible}
    on={this.dialogListeners}
    title={t(title)}
    closeOnClickModal={false}
    append-to-body
    custom-class="ad-dialog ad-selected-items-sort-dialog"
    width="472px"
  >
    {/* 提示文字 */}
    {slotTips || (tips && <div class="tips">{t('adb.filter.filtersSettingTips', {
      num: selectedMax
    })}</div>)}
    <div class="box-wrapper">
      <div class="box-left">
        <div class="title">{ t('adb.filter.availableFilters') }</div>
        <el-scrollbar class="checkbox-wrapper">
          <el-checkbox-group
            value={checkedList}
            max={selectedMax}
            onInput={this.onChange}
          >
            {options.map(opt => {
              const label = opt.t_label ? t(opt.t_label) : opt.label
              return <el-checkbox
                key={opt.prop}
                label={opt.prop}
                disabled={!!opt.fixed}
                title={label}
              >{label}</el-checkbox>
            })}
          </el-checkbox-group>
        </el-scrollbar>
      </div>
      <div class="box-right">
        <div class="title">
          {t('adb.filter.filterSelected')}
          <span class="txt">{checkedOptions.length}/{selectedMax}</span>
        </div>
        <DraggableNest
          v-model={this.checkedOptions}
          move={this.onMove}
          removeHandler={this.deleteCheckedOptions}
        />
        <NoData v-show={!checkedOptions.length} isFull />
      </div>
    </div>
    <div slot="footer" class="footer">
      <el-button class="cancel-button" onClick={this.visibleChange.bind(null, false)}>
        {t('adb.btn.cancel')}
      </el-button>
      <el-button
        class="submit-button"
        type="primary"
        disabled={!checkedOptions.length}
        loading={submitLoading}
        onClick={this.submit.bind(null, this)}
      >
        {t('adb.btn.save')}
      </el-button>
    </div>
  </el-dialog>
}

export default {
  name: 'AdSelectedItemsSortDialog',
  components: {
    DraggableNest,
    NoData
  },
  render,
  props: {
    title: {
      type: String,
      default: 'adb.filter.arrangeFilters'
    },
    tips: {
      type: String,
      default: 'adb.filter.arrangeFilters'
    },
    visible: {
      type: Boolean,
      required: true
    },
    selectedMax: {
      type: Number,
      default: 5
    },
    // 可选的筛选项(eg: forms)
    options: {
      type: Array,
      default: () => []
      /**
       * eg:
       [
         {
            prop: 'prop',
            t_label: '翻译的label展示',
            label: '不翻译的label展示',
            fixed: boolean // 不可选标记(同:disabled)
          }
       ]
       */
    },
    value: {
      // checkedOptions
      type: Array,
      default: () => []
      // todo dynamic
      /**
       *  type Options = { t_label: string; label: string; prop: string; fixed: boolean|string }[]
       */
    },
    submit: {
      type: Function,
      default: function (childComp) {
        // 示例
        console.error('childComp', childComp)
        // 接口请求 然后 处理...
        childComp.submitLoading = true
        setTimeout(() => {
          console.warn('todo...... checkedOptions', childComp.checkedOptions)
          childComp.submitLoading = false
          childComp.visibleChange(false)
        }, 500)
      }
    }
  },
  data() {
    const _this = this
    return {
      dialogListeners: {
        'update:visible': _this.visibleChange
      },
      checkedList: [],
      checkedOptions: [],
      submitLoading: false
    }
  },
  watch: {
    value: {
      immediate: true, // options item Group
      handler(value) {
        if (this.visible) {
          this.initCheckedOptions()
        }
      }
    },
    visible(bool) {
      // 每次展示使用保存的选中值
      if (bool) {
        this.initCheckedOptions()
      }
    }
  },
  methods: {
    initCheckedOptions() {
      const checkedOptions = this.value || []
      this.getCheckedOptions(checkedOptions)
    },
    visibleChange(bool = false) {
      this.$emit('update:visible', bool)
    },
    onMove({ relatedContext, draggedContext }) {
      const relatedElement = relatedContext.element
      const draggedElement = draggedContext.element
      // fixed 表示 固定的项
      return (
        (!relatedElement || !relatedElement.fixed) && !draggedElement.fixed
      )
    },
    onChange(list) {
      const options = this.options
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
      checkedOptions.push(...list.map(value => options.find(v => v.prop === value)))
      this.getCheckedOptions(checkedOptions)
    },
    getCheckedOptions(checkedOptions) {
      this.checkedList = checkedOptions.map(v => v.prop)
      this.checkedOptions = checkedOptions
    },
    deleteCheckedOptions(item, idx, local_list) {
      if (!item.fixed) {
        local_list.splice(idx, 1)
        this.getCheckedOptions(local_list)
      }
    }
  }
}
</script>
