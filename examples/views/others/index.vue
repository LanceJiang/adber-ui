<template>
  <div class="flex-column-page-wrap pageWrap">
    Others[存放 不默认引入的组件集合 && 其他 特殊相关]
    <!--  以下是默认不应用全局的组件  -->
    <div class="common_title">条形码</div>
    <div class="content">
      <BarCode
        class="item bar-code text-overflow-hidden"
        value="12345688"
        :options="codeOpts"
      />
    </div>
    <div class="common_title">PdfPreview pdf 预览</div>
    <div class="content">
      <PdfPreview
        class="local_pdfPreviewWrap"
        ref="Label"
        v-for="url of pdfList"
        :key="url"
        :scale="1.5"
        :url="url"
      >
        <template v-slot:extraContent>no data</template>
      </PdfPreview>
    </div>

    <div class="common_title">todo</div>
    <div class="content">
      ....
    </div>
  </div>
</template>

<script>
// import PdfPreview from '@adber/adber-ui/packages/PdfPreview'
import { PdfPreview, BarCode } from '@adber/adber-ui/packages/extra_load'
// import test from '@adber/adber-ui/packages/extra_load'
// console.error(test)
export default {
  name: 'others',
  components: {
    // PdfPreview: test.PdfPreview,
    PdfPreview,
    BarCode
  },
  data() {
    return {
      // pdf 预览链接
      pdfList: ['https://shipber-label-stage.s3.us-west-2.amazonaws.com/Labels/fedex/fedex_ground/278911092933/merge.pdf?AWSAccessKeyId=AKIAVKD5XIH4LVPFTARC&Expires=1673859442&Signature=B14%2BMUQepwqrf7UbqTGK0oTgH9Y%3D'],
      codeOpts: {
        // format: "pharmacode",
        // lineColor: '#0aa',
        width: 2,
        height: 48,
        displayValue: false
      }
    }
  },
  methods: {
  }
}
</script>
<style lang="scss" scoped>
.pageWrap {
  padding: 10px 12px;
  overflow: auto;
}
.local_pdfPreviewWrap {
  background: #bd9393;
  padding: 10px 0;
  ::v-deep > canvas {
    display: block;
    margin: 0 auto;
    width: 188px;
    & + canvas {
      margin-top: 10px;
    }
  }
}
.bar-code {
  //background: #ff0000;
  width: 100%;
  //width: calc(100% - 30px);
  height: 48px;
}

</style>
