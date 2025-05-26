// export const formatToTree = (ary: any[], pid?: number) => {
//   return ary
//     .filter((item) =>
//       // 如果没有父id（第一次递归的时候）将所有父级查询出来
//       // 这里认为 item.parentId === 1 就是最顶层 需要根据业务调整
//       pid === undefined ? item.parentId === null : item.parentId === pid
//     )
//     .map((item2) => {
//       // 通过父节点ID查询所有子节点
//       // item2.title = item2?.meta?.title
//       item2.children = formatToTree(ary, item2.id)
//       return item2
//     })
// }

export const formatToTree = <
  T extends { id: number; parentId: number | null; sort: number | null }
>(
  array2: T[],
  parentId: number | null = null,
  parentKey = 'parentId'
): (T & { children: T[] })[] => {
  const array = JSON.parse(JSON.stringify(array2))
  // Check if parentId exists in array (except for null)
  const parentExists = (pid: number | null) => pid === null || array.some((item) => item.id === pid)

  return (
    array
      // Filter items that either match parentId or have non-existent parentId
      .filter(
        (item) =>
          item[parentKey] === parentId || (parentId === null && !parentExists(item[parentKey]))
      )
      .map((item) => ({
        ...item,
        children: formatToTree(array, item.id, parentKey)
      }))
      // Sort by sort field, null values go to the end
      .sort((a, b) => {
        if (a.sort === null && b.sort === null) return 0
        if (a.sort === null) return 1
        if (b.sort === null) return -1
        return a.sort - b.sort
      })
  )
}

// 递归遍历 找到对应id的节点
type TreeNode = {
  id: number
  children?: TreeNode[]
  [key: string]: any
}

export const findNode = (tree: TreeNode[], id: number): TreeNode | null => {
  for (const node of tree) {
    if (node.id === id) return node
    if (node.children?.length) {
      const found = findNode(node.children, id)
      if (found) return found
    }
  }
  return null
}

// ==============================
// interface ItemWithParentId {
//   id: number
//   parentId?: number
//   name: string
//   remark?: string
//   children?: ItemWithParentId[]
// }
// export const buildTree = (
//   data: ItemWithParentId[],
//   parentId: number | null = null
// ): ItemWithParentId[] => {
//   const result: ItemWithParentId[] = []
//   for (const item of data) {
//     if (item.parentId === parentId) {
//       const children = buildTree(data, item.id)
//       if (children.length) {
//         item.children = children
//       }
//       result.push(item)
//     }
//   }
//   return result
// }
