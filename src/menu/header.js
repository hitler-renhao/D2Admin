// 菜单 顶栏
export default [
  { path: '/index', title: '首页', icon: 'home' },
  {
    title: '监督检查',
    icon: 'folder-o',
    children: [
      { path: '/CheckPoint', title: '核查点管理' },
      { path: '/CheckTask', title: '核查任务' },
      { path: '/BookData', title: '台账数据管理' }
    ]
  }
]
