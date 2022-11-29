export default {
  // 常用的有集成到
  // import CNAdbLocale from '@adber/adber-ui/lib(src)/locale/lang/zh-cn.js'
  common: {
    todo: 'common 中文 todo'
  },
  validate: {
    todo: 'validate 中文 todo'
  },
  message: {
    todo: 'message 中文 todo'
  },
  route: {
    location: '库位',
    inventory: '库存管理'
  },
  outboundOrder: {
    table: {
      user: '客户',
      orderNo: '订单号',
      skuQty: '商品数',
      outboundNo: '出库单号',
      location: '库位',
      multiple: '一票多件',
      store: '店铺',
      // action: '操作',
      picker: '拣货员',
      sku: '商品编码',
      size: '尺寸',
      weight: '重量',
      package: '包材',
      trackingNo: '追踪号',
      service: '服务',
      creator: '创建者',
      createTime: '创建时间',
      batchNo: '批次号',
      reason: '原因',
      status: '状态',
      submittedBy: '上报人员',
      submittedTime: '上报人员',
      shipmentNum: '打印'
    },
    btn: {
      CreateBatch: '创建批次',
      CreateBatchTip: '创建批次必须是相同类型的订单',
      BulkPicking: '批量拣货',
      ConfirmShipment: '批量发货',
      Print: '打印',
      PickingList: '拣货单',
      PackingList: '装箱单',
      Label: '面单',
      PackingAndLabel: '装箱单 + 面单',
      picking: '拣货',
      packing: '打包',
      confirmShipment: '发货',
      view: '查看',
      review: '审核'
    },
    filter: {
      pattern: {
        placeholder: '搜索出库单号、订单号或商品编码'
      },
      type: {
        title: '类型',
        Multi: '多件',
        OneItem: '单件'
      },
      store: {
        title: '店铺'
      },
      user: {
        title: '客户',
        placeholder: '输入客户名称'
      },
      creator: {
        title: '创建者',
        placeholder: '输入创建者名称'
      },
      picker: {
        title: '拣货员',
        placeholder: '输入拣货员名称'
      },
      package: {
        title: '包材'
      },
      createTime: {
        title: '创建时间'
      },
      reason: {
        title: '原因',
        OutOfStock: '缺件',
        Damaged: '损坏',
        Others: '其他'
      }
    },
    dialog: {
      test1: 't1_客户',
      test2: 't2_订单号',
      test3: 't3_商品数',
      test4: 't4_出库单号',
      test5: 't5_库位',
      test6: 't6_一票多件',
      test7: 't7_店铺'
    }
  }
}
