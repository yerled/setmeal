export default {
  zh: {
    discount_price: '优惠价',
    detail: '查看详情',
    expire_dispose: '到期处理方式',
    auto_renewal: '自动续约',
    deleted: '到期删除',
    recover: '到期还原',
    desc_auto_renewal: '自动续约',
    desc_deleted: '删除套餐中资源',
    desc_recover: '套餐资源还原为普通资源',
    expiration_rules: '套餐资源过期处理规则',
    expiration_rules_desc:
      `实例欠费或到期停机后，实例将进入回收期，即实例的计算资源（vCPU+内存）不再保留，
        但云盘数据和分配的公网IP地址会保留15天（自停机当日算起）；
      实例欠费或到期15天后，实例会全部释放，数据和IP地址将无法找回；
      本地磁盘数据欠费或到期后的保留时间仍为7天，停机7天后，本地盘数据将随计算资源一起释放不再保留；
        分配的IP地址及挂载到本地磁盘实例的云盘数据，则会继续保留至停机15天后释放。`,
    pop: {
      step_allocateInstance: '配置云主机',
      step_allocateOther: '其他资源',
      step_purchase: '确认',
      instanceNameRequired: '请输入主机名称',
      purchase: {
        title: '购买套餐',
      },
      detail: {
        title: '套餐详情',
      },
    },
  },
  en: {
    
  }
}
