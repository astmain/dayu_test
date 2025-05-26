import { PrismaClient } from './client/postgresql';

const prisma = new PrismaClient();

export interface AdminListType {
  path: string;
  component: string;
  redirect?: string;
  name: string;
  meta?: any;
  children?: AdminListType[];
}
// 用于初始化数据库的 菜单数据
const _devMenuData000: AdminListType[] = [
  {
    path: 'dashboard',
    component: '#',
    redirect: '/dashboard/workplace',
    name: 'Dashboard',
    meta: {
      title: 'router.dashboard',
      icon: 'vi-ant-design:dashboard-filled',
    },
    children: [
      {
        path: 'analysis',
        component: 'views/Dashboard/Analysis',
        name: 'Analysis',
        meta: {
          title: 'router.analysis',
        },
      },
      {
        path: 'workplace',
        component: 'views/Dashboard/Workplace',
        name: 'Workplace',
        meta: {
          title: 'router.workplace',
        },
      },
    ],
  },
  {
    path: 'authorization',
    component: '#',
    redirect: '/authorization/user',
    name: 'Authorization',
    meta: {
      title: 'router.authorization',
      icon: 'vi-eos-icons:role-binding',
    },
    children: [
      {
        path: 'department',
        component: 'views/Authorization/Department/Department',
        name: 'Department',
        meta: {
          title: 'router.department',
        },
      },
      {
        path: 'user',
        component: 'views/Authorization/User/User',
        name: 'User',
        meta: {
          title: 'router.user',
        },
      },
      {
        path: 'menu',
        component: 'views/Authorization/Menu/Menu',
        name: 'Menu',
        meta: {
          title: 'router.menuManagement',
        },
      },
      {
        path: 'role',
        component: 'views/Authorization/Role/Role',
        name: 'Role',
        meta: {
          title: 'router.role',
        },
      },
    ],
  },
];

const _devMenuData: AdminListType[] = [
  {
    path: 'dashboard',
    component: '#',
    redirect: '/dashboard/workplace',
    name: 'Dashboard',
    meta: {
      title: 'router.dashboard',
      icon: 'vi-ant-design:dashboard-filled',
    },
    children: [
      {
        path: 'analysis',
        component: 'views/Dashboard/Analysis',
        name: 'Analysis',
        meta: {
          title: 'router.analysis',
        },
      },
      {
        path: 'workplace',
        component: 'views/Dashboard/Workplace',
        name: 'Workplace',
        meta: {
          title: 'router.workplace',
        },
      },
    ],
  },
  {
    path: 'authorization',
    component: '#',
    redirect: '/authorization/user',
    name: 'Authorization',
    meta: {
      title: 'router.authorization',
      icon: 'vi-eos-icons:role-binding',
    },
    children: [
      {
        path: 'department',
        component: 'views/Authorization/Department/Department',
        name: 'Department',
        meta: {
          title: 'router.department',
        },
      },
      {
        path: 'user',
        component: 'views/Authorization/User/User',
        name: 'User',
        meta: {
          title: 'router.user',
        },
      },
      {
        path: 'menu',
        component: 'views/Authorization/Menu/Menu',
        name: 'Menu',
        meta: {
          title: 'router.menuManagement',
        },
      },
      {
        path: 'role',
        component: 'views/Authorization/Role/Role',
        name: 'Role',
        meta: {
          title: 'router.role',
        },
      },
      {
        name: 'Dictionary',
        path: 'dictionary',
        component: 'views/Authorization/Dictionary/Dictionary',
        meta: {
          title: 'router.dictionary',
        },
      },
      {
        name: 'DicItem',
        path: 'dictionary/management',
        component: 'views/Authorization/Dictionary/Management/DicItem',
        meta: {
          title: '字典项管理',
        },
      },
    ],
  },
  {
    name: 'System',
    path: 'system',
    component: '#',
    redirect: '/system/operation',
    meta: {
      title: '系统管理',
      icon: 'vi-ant-design:setting-filled',
    },
    children: [
      {
        name: 'Operation',
        path: 'operation',
        component: 'views/System/Operation/Operation',
        meta: {
          title: 'router.operation',
        },
      },
      {
        name: 'OnlineUser',
        path: 'online-user',
        component: 'views/System/OnlineUser/OnlineUser',
        meta: {
          title: 'router.onlineUser',
        },
      },
      {
        name: 'Notice',
        path: 'notice',
        component: 'views/System/Notice/Notice',
        meta: {
          title: 'router.notice',
        },
      },
    ],
  },
  {
    name: 'Personal',
    path: 'personal',
    redirect: '/persoanl/notification',
    component: '#',
    meta: {
      title: 'router.personalCenter',
      icon: 'vi-ant-design:user-outlined',
    },
    children: [
      {
        name: 'PersonalCenter',
        path: 'personal-center',
        component: 'views/Personal/PersonalCenter/PersonalCenter',
        meta: {
          title: 'router.personalCenter',
        },
      },
      {
        name: 'Notification',
        path: 'notification',
        component: 'views/Personal/Notification/Notification',
        meta: {
          title: 'router.notification',
        },
      },
    ],
  },
  {
    name: 'File',
    path: 'file',
    redirect: '/file/upload',
    component: '#',
    meta: {
      title: 'router.file',
      icon: 'vi-ant-design:file-filled',
    },
    children: [
      {
        name: 'Upload',
        path: 'upload',
        component: 'views/File/Upload/Upload',
        meta: {
          title: 'router.fileUpload',
        },
      },
      {
        name: 'List',
        path: 'filelist',
        component: 'views/File/List/List',
        meta: {
          title: 'router.fileList',
        },
      },
    ],
  },
];

const dev_temp = [
  {
    path: 'dashboard',
    component: '#',
    name: 'Dashboard',
    redirect: '/dashboard/workplace',
    meta: {
      title: 'router.dashboard',
      icon: 'vi-ant-design:dashboard-filled',
    },
    children: [
      {
        path: 'workplace',
        name: 'Workplace',
        component: 'views/Dashboard/Workplace',
        meta: {
          title: 'router.workplace',
        },
      },
      {
        path: 'analysis',
        name: 'Analysis',
        component: 'views/Dashboard/Analysis',
        meta: {
          title: 'router.analysis',
        },
      },
    ],
  },
  {
    path: 'equipment',
    name: 'Equipment',
    component: '#',
    redirect: 'equipment/machine',
    meta: {
      title: '设备管理',
      icon: 'vi-ant-design:setting-filled',
    },
    children: [
      {
        path: 'machine',
        name: 'Machine',
        component: 'views/Equipment/Machine/Machine',
        meta: {
          title: '机台设备',
          icon: 'vi-ant-design:setting-filled',
        },
      },
    ],
  },
  {
    path: 'cms',
    name: 'Cms',
    component: '#',
    meta: {
      title: 'CMS管理',
      icon: 'vi-ant-design:setting-filled',
    },
    children: [
      {
        path: 'material',
        name: 'Material',
        component: 'views/CMS/Material/Material',
        meta: {
          title: '材料管理',
        },
      },
      {
        path: 'customer',
        name: 'Customer',
        component: 'views/CMS/Customer/Customer',
        meta: {
          title: 'router.user',
        },
      },
      {
        path: 'delivery',
        name: 'Delivery',
        component: 'views/CMS/Delivery/Delivery',
        meta: {
          title: '交期参数',
        },
      },
      {
        path: 'specification',
        name: 'Specification',
        component: 'views/CMS/Specification/Specification',
        meta: {
          title: '增值规格',
        },
      },
    ],
  },
  {
    path: 'authorization',
    name: 'Authorization',
    component: '#',
    redirect: '/authorization/user',
    meta: {
      title: 'router.authorization',
      icon: 'vi-eos-icons:role-binding',
    },
    children: [
      {
        path: 'department',
        name: 'Department',
        component: 'views/Authorization/Department/Department',
        meta: {
          title: 'router.department',
        },
      },
      {
        path: 'dictionary',
        name: 'Dictionary',
        component: 'views/Authorization/Dictionary/Dictionary',
        meta: {
          title: '字典管理',
        },
      },
      {
        path: 'user',
        name: 'User',
        component: 'views/Authorization/User/User',
        meta: {
          title: '员工管理',
        },
      },
      {
        path: 'menu',
        name: 'Menu',
        component: 'views/Authorization/Menu/Menu',
        meta: {
          title: 'router.menuManagement',
          // permissions: ['add', 'update', 'delete', 'refresh', 'view'],
        },
      },
      {
        path: 'role',
        name: 'Role',
        component: 'views/Authorization/Role/Role',
        meta: {
          title: 'router.role',
        },
      },
    ],
  },
  {
    path: 'system',
    name: 'System',
    component: '#',
    redirect: '/system/operation',
    meta: {
      title: '系统管理',
      icon: 'vi-ant-design:setting-filled',
    },
    children: [
      {
        path: 'operation',
        name: 'Operation',
        component: 'views/System/Operation/Operation',
        meta: {
          title: '操作日志',
        },
      },
      {
        path: 'online-user',
        name: 'OnlineUser',
        component: 'views/System/OnlineUser/OnlineUser',
        meta: {
          title: '在线用户',
        },
      },
      {
        path: 'notice',
        name: 'Notice',
        component: 'views/System/Notice/Notice',
        meta: {
          title: '通知发布',
        },
      },
      {
        path: 'monitoring',
        name: 'Monitoring',
        component: 'views/System/Monitoring/Monitoring',
        meta: {
          title: '服务器监控',
        },
      },
    ],
  },
  {
    path: 'personal',
    name: 'Personal',
    component: '#',
    redirect: '/persoanl/notification',
    meta: {
      title: 'router.personalCenter',
      icon: 'vi-ant-design:user-outlined',
    },
    children: [
      {
        path: 'personal-center',
        name: 'PersonalCenter',
        component: 'views/Personal/PersonalCenter/PersonalCenter',
        meta: {
          title: '个人信息',
        },
      },
      {
        path: 'notification',
        name: 'Notification',
        component: 'views/Personal/Notification/Notification',
        meta: {
          title: '我的通知',
        },
      },
    ],
  },
  {
    path: 'file',
    name: 'File',
    component: '#',
    redirect: '/file/upload',
    meta: {
      title: '文件管理',
      icon: 'vi-ant-design:file-filled',
    },
    children: [
      {
        path: 'upload',
        name: 'Upload',
        component: 'views/File/Upload/Upload',
        meta: {
          title: '上传',
        },
      },
      {
        path: 'filelist',
        name: 'List',
        component: 'views/File/List/List',
        meta: {
          title: '文件列表',
        },
      },
    ],
  },
];
async function createMenu(data: any, parentId: number | null = null, sort = 0) {
  const menu = await prisma.menu.create({
    data: {
      name: data.name,
      path: data.path,
      component: data.component,
      redirect: data.redirect || null,
      sort: sort,
      parentId: parentId,
      // type: 0 for directory, 1 for component
      type: data.children?.length ? 0 : 1,
      meta: data.meta
        ? {
            create: {
              title: data.meta.title,
              icon: data.meta.icon,
            },
          }
        : undefined,
    },
    include: { meta: true },
  });

  if (data.children?.length) {
    for (let i = 0; i < data.children.length; i++) {
      await createMenu(data.children[i], menu.id, i);
    }
  }
}

async function main() {
  console.log('🌱 Seeding menu data...');
  for (let i = 0; i < dev_temp.length; i++) {
    await createMenu(dev_temp[i], null, i);
  }
  console.log('✅ Seeding finished.');
}

main()
  .then(() => prisma.$disconnect())
  .catch(async e => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
