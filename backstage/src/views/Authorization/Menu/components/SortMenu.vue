<template>
  <el-tree
    style="max-width: 600px"
    :allow-drop="allowDrop"
    :allow-drag="allowDrag"
    :data="menuList"
    draggable
    default-expand-all
    node-key="id"
    :props="{ label: nodeTitle }"
    @node-drag-start="handleDragStart"
    @node-drag-enter="handleDragEnter"
    @node-drag-leave="handleDragLeave"
    @node-drag-over="handleDragOver"
    @node-drag-end="handleDragEnd"
    @node-drop="handleDrop"
  />
</template>

<script lang="tsx" setup>
import { ElTree } from 'element-plus'
import { usePermissionStore } from '@/store/modules/permission'
import type Node from 'element-plus/es/components/tree/src/model/node'
import type { DragEvents } from 'element-plus/es/components/tree/src/model/useDragNode'
import type { AllowDropType, NodeDropType } from 'element-plus/es/components/tree/src/tree.type'
import type { AppCustomRouteRecordRaw2 } from '@/api/menu/types'
import { ref, onMounted } from 'vue'
import { useI18n } from '@/hooks/web/useI18n'

const { t } = useI18n()

const updateData = ref<{ id: number; sort: number }[]>([])
interface NewNode extends Node {
  id: number
  parentId: number
  meta: {
    title: string
  }
}
const nodeTitle = (node: NewNode) => {
  return t(node.meta.title)
}
const handleDragStart = (node: NewNode, _ev: DragEvents) => {
  console.log('drag start', node)
}
const handleDragEnter = (_draggingNode: NewNode, dropNode: NewNode, _ev: DragEvents) => {
  console.log('tree drag enter:', dropNode.label)
}
const handleDragLeave = (_draggingNode: NewNode, dropNode: NewNode, _ev: DragEvents) => {
  console.log('tree drag leave:', dropNode.label)
}

const handleDragOver = (_draggingNode: NewNode, dropNode: NewNode, _ev: DragEvents) => {
  console.log('tree drag over:', dropNode.label)
}

const handleDragEnd = (
  _draggingNode: NewNode,
  _dropNode: NewNode,
  _dropType: NodeDropType,
  _ev: DragEvents
) => {
  // 提取出嵌套数据的 id和sort 转换成平面数据
  updateData.value = addSort(menuList.value, [])
}

const handleDrop = (
  _draggingNode: NewNode,
  _dropNode: NewNode,
  _dropType: NodeDropType,
  _ev: DragEvents
) => {}

const addSort = (
  menuList: AppCustomRouteRecordRaw2[],
  updateData: { id: number; sort: number }[]
) => {
  menuList.forEach((item, index) => {
    updateData.push({ id: item.id, sort: index })
    if (item.children?.length) {
      addSort(item.children, updateData)
    }
  })
  return updateData
}
const allowDrop = (draggingNode: NewNode, dropNode: NewNode, type: AllowDropType) => {
  // 节点只在当前兄弟节点之间进行拖拽
  if (draggingNode.data.parentId === dropNode.data.parentId) {
    return type !== 'inner'
  }
  return false
}
const allowDrag = (_draggingNode: NewNode) => {
  return true
}

const menuList = ref<AppCustomRouteRecordRaw2[]>([])
onMounted(async () => {
  menuList.value = usePermissionStore().getMenuManageList
  updateData.value = addSort(menuList.value, [])
})
defineExpose({
  updateData
})
</script>
