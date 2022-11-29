<template>
  <el-drawer
    :visible="visible"
    @update:visible="visibleChange"
    :withHeader="false"
    class="ad-filter-drawer"
  >
    <div class="ad-filter-drawer__header">
      <div class="title">
        <slot name="header">
          {{ t(title) }}
          <!-- <i
            class="el-icon-setting action"
            style="margin-left: 8px;"
            @click="settingVisibleChange(true)"
          />-->
        </slot>
      </div>
      <div class="action" @click="visibleChange(false)">
        <i class="el-icon-close" />
      </div>
    </div>
    <div class="ad-filter-drawer__main">
      <slot/>
    </div>
    <div v-if="$slots.footer" class="ad-filter-drawer__footer">
      <slot name="footer"/>
    </div>
    <!--  选中的 项 排序... -->
<!--    <SelectedItemsSortDialog
      :visible.sync="selectedSettingVisible"
      :options="options"
      v-model="testSelect"
    >
      &lt;!&ndash;<template slot="tips">
        <div class="tips" style="background: #f00;">tips</div>
      </template>&ndash;&gt;
    </SelectedItemsSortDialog>-->
  </el-drawer>
</template>

<script lang="jsx">
// import { t } from '@adber/adber-ui/src/locale'
// import Icon from '@adber/adber-ui/packages/Icon'
import Locale from '@adber/adber-ui/src/mixins/locale'
// import SelectedItemsSortDialog from './SelectedItemsSortDialog'

export default {
  name: 'AdSearchFilterDrawer',
  components: {
    // SelectedItemsSortDialog
    // Icon
  },
  mixins: [Locale],
  props: {
    // options: {
    //   type: Array,
    //   default: () => []
    // },
    visible: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: 'adb.filter.filterLabel'
    }
  },
  // render,
  data() {
    const _this = this
    return {
      selectedSettingVisible: false,
      drawerListeners: {
        'update:visible': _this.visibleChange
      }
    }
  },
  computed: {
  },
  watch: {
  },
  created () {
    window.testDrawer = this
  },
  methods: {
    visibleChange (bool) {
      this.$emit('update:visible', bool)
    }
  }
}
</script>
