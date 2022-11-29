<script>
import FormConfig from '@adber/adber-ui/packages/FormConfig'
const render = function(h) {
  const { title, visible, width, changeVisible, formOptions, formData } = this
  const on = {
    'update:visible': changeVisible,
    close: changeVisible
  }
  return <el-dialog
    title={title}
    visible={visible}
    props={this.$attrs}
    closeOnClickModal={false}
    width={width}
    customClass="ad-dialog ad-form-config-dialog"
    on={on}
  >
    {
      visible && <FormConfig
        ref="configForm"
        props={formOptions}
        form-data={formData}
        onSubmit={this.onSubmit}
        onCancel={changeVisible}
        scopedSlots={this.$scopedSlots}
      />
    }
  </el-dialog>
}

export default {
  name: 'AdFormConfigDialog',
  components: {
    FormConfig
  },
  emits: ['submit', 'update:visible'],
  props: {
    title: {
      type: String,
      default: '请输入 title 标题'
    },
    formOptions: {
      required: true,
      type: Object,
      default: () => ({
        // form配置数组
        forms: [],
        // form的配置项对象
        formConfig: {}
        /** formConfig: {
          size,
          labelWidth,
          itemWidth,
          span,
          submitLoading,
          submitBtnText,
          showResetBtn,
          resetBtnText,
          showCancelBtn,
        } */
      })
    },
    // 初始化数据对象
    formData: {
      type: Object,
      default: () => ({})
    },
    visible: {
      type: Boolean,
      required: true
    },
    width: {
      type: String
    }
  },
  render,
  data() {
    return {}
  },
  computed: {},
  created() {},
  mounted() {},
  methods: {
    changeVisible(bool = false) {
      this.$emit('update:visible', bool)
    },
    onSubmit(events) {
      this.$emit('submit', events)
    }
  }
}
</script>
