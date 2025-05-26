<script setup lang="ts">
import { BaseButton } from '@/components/Button'
import { Dialog } from '@/components/Dialog'
import { ContentWrap } from '@/components/ContentWrap'
import { ElDivider, ElProgress, ElText, ElInput } from 'element-plus'

import { ref } from 'vue'

enum MachineStatus {
  '运行中' = 1,
  '空闲' = 2,
  '故障' = 3,
  '待机' = 4
}

enum ListColor {
  '#409EFF' = 1,
  '#67C23A',
  '#F56C6C',
  '#909399'
}

const machineList = ref<any[]>([
  {
    id: 1,
    status: 1,
    name: 'DY-1',
    type: '1',
    process: 56,
    remark: '备注',
    printStatus: true,
    printStatus2: false,
    model: {
      count: 0,
      ceil: 186,
      ceilHeight: 0.1
    },
    dog: {
      id: 764535463465,
      type: '一卡通',
      time: 186
    }
  },
  {
    id: 2,
    status: 2,
    name: 'DY-2',
    type: '2',
    process: 0,
    remark: '备注',
    printStatus: false,
    printStatus2: true,
    model: {
      count: 0,
      ceil: 0,
      ceilHeight: 0
    },
    dog: {
      id: '',
      type: '',
      time: 0
    }
  },
  {
    id: 3,
    status: 3,
    name: 'DY-3',
    type: '3',
    process: 89,
    remark: '备注',
    printStatus: false,
    printStatus2: false,
    model: {
      count: 0,
      ceil: 186,
      ceilHeight: 0.1
    },
    dog: {
      id: 764535463465,
      type: '一卡通',
      time: 0
    }
  },
  {
    id: 4,
    status: 4,
    name: 'DY-4',
    type: '4',
    process: 23,
    remark: '备注',
    printStatus: true,
    printStatus2: false,
    model: {
      count: 0,
      ceil: 186,
      ceilHeight: 0.1
    },
    dog: {
      id: 764535463465,
      type: '一卡通',
      time: 186
    }
  }
])

const openDialog = (item: any, index: number) => {
  dialogVisible.value = true
  currentRow.value = item
  currentIndex.value = index
}

const currentRow = ref<any>(null)
const currentIndex = ref<number>(0)
const dialogVisible = ref(false)
const inputValue = ref('')
const save = () => {
  dialogVisible.value = false
}
</script>

<template>
  <ContentWrap>
    <h1>统计数据</h1>
    <ElDivider />
    <h1>机台列表</h1>
    <div>
      <div class="listbox flex flex-wrap gap-[20px]">
        <div
          v-for="(item, index) in machineList"
          :key="item.id"
          class="eachitem"
          :style="{
            border: `4px solid ${ListColor[item.status]}`
          }"
        >
          <div
            class="name flex items-center justify-center p-[6px 0 10px 0] text-[#fff]"
            :style="{ backgroundColor: ListColor[item.status] }"
            >{{ item.name }}</div
          >
          <div class="flex items-center justify-between p-[20px]">
            <div class="text-[12px] text-[#909399] w-[100px]">机台型号</div>
            <ElProgress type="dashboard" :percentage="item.process" :color="ListColor[item.status]">
              <template #default="{ percentage }">
                <div class="percentage-value mb-[8px]">{{ percentage }}%</div>
                <div class="percentage-label" :style="{ color: ListColor[item.status] }">{{
                  MachineStatus[item.status]
                }}</div>
              </template>
            </ElProgress>
          </div>
          <div class="p-[20px] flex items-center justify-between">
            <div class="text-[#ff7800]">机器操作：</div>
            <div class="flex items-center gap-[30px]">
              <ElText
                class="mx-1 cursor-pointer"
                type="success"
                @click="item.printStatus = !item.printStatus"
                :style="{ color: item.printStatus ? '#F56C6C' : '#409EFF' }"
                >{{ item.printStatus ? '停止' : '开始' }}</ElText
              >
              <ElText
                class="mx-1 cursor-pointer"
                type="success"
                @click="item.printStatus2 = !item.printStatus2"
                :style="{ color: item.printStatus2 ? '#e8a94a' : '#409EFF' }"
                >{{ item.printStatus2 ? '暂停' : '继续' }}</ElText
              >
            </div>
          </div>
          <div class="flex items-center justify-between p-[20px]">
            <div>
              <div class="flex items-center justify-between mb-[10px]">
                <div class="">模型信息</div>
                <Icon icon="ep:refresh-right" :size="14" class="cursor-pointer" color="#409EFF" />
              </div>
              <div class="flex flex-col gap-[2px]">
                <div class="text-[12px] text-[#909399]">模型数量： {{ item.model.count }}</div>
                <div class="text-[12px] text-[#909399]">总层数： {{ item.model.ceil }}</div>
                <div class="text-[12px] text-[#909399]">层厚： {{ item.model.ceilHeight }}</div>
              </div>
            </div>
            <div>
              <div class="flex items-center justify-between mb-[10px]">
                <div class="">加密狗</div>
                <Icon icon="ep:refresh-right" :size="14" class="cursor-pointer" color="#409EFF" />
                <ElText
                  class="mx-1 cursor-pointer"
                  type="success"
                  @click="() => openDialog(item, index)"
                  >激活</ElText
                >
              </div>
              <div class="flex flex-col gap-[2px]">
                <div class="text-[12px] text-[#909399]">类型： {{ item.dog.type }}</div>
                <div class="text-[12px] text-[#909399]">ID: {{ item.dog.id }}</div>
                <div class="text-[12px] text-[#909399]">剩余时间： {{ item.dog.time }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </ContentWrap>
  <Dialog v-model="dialogVisible" title="加密狗激活" width="500px" maxHeight="100px">
    <div class="mb-[10px]">机台：{{ currentRow.name }}</div>
    <ElInput v-model="inputValue" placeholder="请输入激活码" />
    <template #footer>
      <BaseButton type="primary" @click="save">保存 </BaseButton>
      <BaseButton @click="dialogVisible = false">关闭</BaseButton>
    </template>
  </Dialog>
</template>
