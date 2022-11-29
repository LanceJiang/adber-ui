export default {
  // 常用的有集成到
  // import EnAdbLocale from '@adber/adber-ui/lib(src)/locale/lang/en.js'
  common: {
    todo: 'common todo'
  },
  validate: {
    todo: 'validate todo'
  },
  message: {
    todo: 'message todo'
  },
  route: {
    location: 'Location',
    inventory: 'Inventory'
  },
  outboundOrder: {
    table: {
      user: 'User',
      orderNo: 'Order No.',
      skuQty: 'SKU Qty',
      outboundNo: 'Outbound No.',
      location: 'Location',
      multiple: 'Multiple',
      store: 'Store',
      // action: 'Action',
      picker: 'Picker',
      sku: 'Sku',
      size: 'Size',
      weight: 'Weight',
      package: 'Package',
      trackingNo: 'Tracking No.',
      service: 'Service',
      creator: 'Creator',
      createTime: 'CreateTime',
      batchNo: 'Batch No.',
      reason: 'Reason',
      status: 'Status',
      submittedBy: 'Submitted By',
      submittedTime: 'Submitted Time',
      shipmentNum: 'Print'
    },
    btn: {
      CreateBatch: 'Create Batch',
      CreateBatchTip: 'Create batch must be the same type of orders',
      BulkPicking: 'Bulk Picking',
      ConfirmShipment: 'Confirm Shipment',
      Print: 'Print',
      PickingList: 'Picking List',
      PackingList: 'Packing List',
      Label: 'Label',
      PackingAndLabel: 'Packing List + Label',
      picking: 'Picking',
      packing: 'Packing',
      confirmShipment: 'Confirm Shipment',
      view: 'View',
      review: 'Review'
    },
    filter: {
      pattern: {
        placeholder: 'Search by outbound number, order number or SKU'
      },
      type: {
        title: 'Type',
        Multi: 'Multi',
        OneItem: 'OneItem'
      },
      store: {
        title: 'Store'
      },
      user: {
        title: 'User',
        placeholder: 'Search by User Name'
      },
      creator: {
        title: 'Creator',
        placeholder: 'Search by Creator Name'
      },
      picker: {
        title: 'Picker',
        placeholder: 'Search by Picker Name'
      },
      package: {
        title: 'Package'
      },
      createTime: {
        title: 'Create Time'
      },
      reason: {
        title: 'Reason',
        OutOfStock: 'OutOfStock',
        Damaged: 'Damaged',
        Others: 'Others'
      }
    },
    dialog: {
      test1: 't1_User',
      test2: 't2_Order No.',
      test3: 't3_SKU Qty',
      test4: 't4_Outbound No.',
      test5: 't5_Location',
      test6: 't6_Multiple',
      test7: 't7_Store'
    }
  }
}
