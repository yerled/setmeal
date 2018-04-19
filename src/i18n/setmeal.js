export default {
  zh: {
    setmeal: '套餐',
    create: '新建套餐',
    update: '编辑套餐',
    issue: '发布套餐',
    auto_renewal: '自动续约',
    issueSuccess: '套餐发布成功!',
    issueFaild: '发布失败',
    shelve: '下架套餐',
    shelveSuccess: '套餐下架完成!',
    shelveFaild: '下架失败',
    actionConfirm: '是否确定对该套餐执行{{action}}操作?',
    purchase: '购买套餐',
    purchaseSuccess: '套餐购买完成!',
    purchaseFailed: '购买失败',
    instance_count: '云主机数量',
    volume_count: '云硬盘数量',
    floating_ip_count: '公网IP数量',
    router_count: '路由器数量',
    name: '套餐名称',
    limit: '可购买次数',
    expiration_rules: '套餐资源过期处理规则',
    expiration_rules_desc:
      `实例欠费或到期停机后，实例将进入回收期，即实例的计算资源（vCPU+内存）不再保留，
        但云盘数据和分配的公网IP地址会保留15天（自停机当日算起）；
      实例欠费或到期15天后，实例会全部释放，数据和IP地址将无法找回；
      本地磁盘数据欠费或到期后的保留时间仍为7天，停机7天后，本地盘数据将随计算资源一起释放不再保留；
        分配的IP地址及挂载到本地磁盘实例的云盘数据，则会继续保留至停机15天后释放。`,
    pop: {
      nameRequired: '请输入套餐名称',
      instanceNameRequired: '请输入主机名称',
      step_main: '基本信息',
      step_instance: '云主机',
      step_volume: '云硬盘',
      step_floating_ip: '公网IP',
      step_router: '路由器',
      step_price: '价格',
      step_allocateInstance: '配置云主机',
      step_allocateOther: '其他资源',
      step_purchase: '确认',
      create: {
        title: '新建套餐',
      },
      update: {
        title: '编辑套餐',
      },
      purchase: {
        title: '购买套餐',
      }
    },
  },
  en: {
    
  }
}
