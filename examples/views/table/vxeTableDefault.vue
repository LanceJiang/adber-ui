<template>
  <div class="flex-column-page-wrap pageWrap">
    <AdVxeTable
      class="local_table"
      :class='`cellHeightWrap_${cellHeightWrap}`'
      :searchParams.sync="searchParams"
      :list="localList"
      :total="total"
      :options="options"
      :tableOptions="tableOptions"
      :columns="localColumns"
      :checkedOptions.sync="checkedOptions"
      :columnsConfig="curColumnsConfig"
      @sortChange='testSortChange'
    >
      <template #toolLeft>
<!--        <AdSearchGroup/>-->
        <ad-search-group
          v-bind="formOptions"
          v-model="formParams"
          :selectedSettingSubmit="selectedSettingSubmit"
          :saveFilterSubmit="saveFilterSubmit"
          :deleteTag="deleteTag">
          <template #prepend>
            <el-input
              class="ad-input-search"
              v-model="formParams.pattern"
              size="medium"
              :placeholder="$t('outboundOrder.filter.pattern.placeholder')"
              clearable
              @keyup.enter.native="updateParams"
            >
              <i slot="suffix" class="el-input__icon el-icon-search" @click="updateParams"/>
            </el-input>
          </template>
          <template #adSelectSlot="{option, label}">
            <div style="background: #A0AAB7;">{{label}} + {{ option.value_1 }}</div>
          </template>
        </ad-search-group>
      </template>
<!--      <template #top>-->
      <template #top>
        <!-- 按钮集合 -->
        <div class="ad-button-wrap">
          <template v-if="true">
            <el-tooltip
              placement="top"
              :content="$t('outboundOrder.btn.CreateBatchTip')"
            >
              <el-button
                type="primary"
                :class="{ 'is-disabled_test': true }"
              >
                {{ $t('outboundOrder.btn.CreateBatch') }}
              </el-button>
            </el-tooltip>

            <el-button
              style="margin-right: 10px"
            >
              {{ $t('outboundOrder.btn.BulkPicking') }}
            </el-button>
          </template>
<!--          :disabled="!selectList.length"-->
          <el-dropdown>
            <el-button>
              {{ $t('outboundOrder.btn.Print') }}
              <i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item v-for="v of dropdownList" :key="v" :command="v">
                {{ $t(`outboundOrder.btn.${v}`) }}
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </template>
      <!-- 自定义slot title -->
      <template #slotName_title>
        <el-tooltip placement="top" :content="$t('outboundOrder.btn.view')">
          <span>slotName_title by localUser</span>
        </el-tooltip>
      </template>
      <!-- 操作 -->
      <template #action="{ row }">
        <el-tooltip placement="top" :content="$t('outboundOrder.btn.view')">
          <el-button class="ad-icon-button">
            <AdIcon icon-class="ad-view"></AdIcon>
          </el-button>
        </el-tooltip>
        <el-button class="ad-icon-button">
          <AdIcon icon-class="ad-hide_column"></AdIcon>
        </el-button>
        <el-button class="ad-icon-button" disabled>
          <AdIcon icon-class="ad-hide_column"></AdIcon>
        </el-button>
      </template>
    </AdVxeTable>
  </div>
</template>

<script>
import {
  // columns,
  tableBaseMixin
} from './default_config'

export default {
  name: 'vxeTableDefault',
  mixins: [tableBaseMixin],
  components: {
  },
  data() {
    return {
      // 针对 虚拟滚动 且存在 fix left 或 right 的情况， 将错位， 为了不错位 另做的 特殊 vxe-cell 高度设置
      cellHeightWrap: '',
      // vxeTableOptions 额外配置
      tableOptions: {
        // 虚拟滚动 模式配置 (建议使用)
        scrollY: { mode: 'wheel' },
        gt: 50
      }
    }
  },
  computed: {
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

      // todo... delete
      /* const hiddenColumns = columns.map(v => {
        return {
          ...v,
          visible: false
        }
      })
      const visibleColumns = checkedOptions.map((v) => {
        const index = columns.findIndex((column) => column.prop === v.prop)
        if (index > -1) {
          const cur = columns[index]
          const fixedFlag = cur.fixed
          if (fixedFlag) {
            v.fixed = fixedFlag
          }
          cur.visible = true
          hiddenColumns.splice(index, 1)
          return cur
        }
        return false
      }).filter(Boolean)
      return visibleColumns.concat(hiddenColumns) */
    }
  },
  watch: {
    // 虚拟滚动错位 通过高度从高到低排列 匹配设置vxe-cell 高度 纠正vxeTable 的样式错位问题 todo
    localColumns(columns) {
      if (columns.find(v => v.prop === 'local_user')) {
        this.cellHeightWrap = 'local_user'
        return
      }
      if (columns.find(v => v.prop === 'value')) {
        this.cellHeightWrap = 'value'
        return
      }
      if (columns.find(v => v.prop === 'action')) {
        this.cellHeightWrap = 'action'
      }
    }
  },
  beforeCreate() {
    console.error('before create vxeTableDefault VxeTable')
    // columns.find(v => v.prop === 'local_user').slots.default = (scope, h) => {
    //   return [<div style={'background: #f0f; height: 68px; overflow: hidden;'}>slot_user 函数渲染 slot:default <el-button>button</el-button>   </div>]
    // }
  },
  methods: {
  }
}
</script>

<style scoped lang="scss">
.pageWrap {
  padding-top: 12px;
  overflow: auto;
}
// 其他样式
.local_table {
  padding: 0 12px;
}
// 触发table 的 虚拟滚动时，需要根据当前 table 的选中项 处理 vxe-cell 的高度
.cellHeightWrap {
  &_local_user {
    ::v-deep {
      //68
      .vxe-table--body .vxe-cell {
        height: 68px;
        min-height: 68px !important;
      }
    }
  }
  &_value {
    ::v-deep {
      //68
      .vxe-table--body .vxe-cell {
        //height: 32 + 22;
        height: 54px;
        min-height: 54px !important;
      }
    }
  }
  &_action {
    ::v-deep {
      .vxe-table--body .vxe-cell {
        //height: 32 + 22;
        height: 32px;
        min-height: 32px !important;
      }
    }
  }
}
</style>
