<script setup lang="ts">
import PanelGroup from './components/PanelGroup.vue'
import { ElRow, ElCol, ElCard, ElSkeleton } from 'element-plus'
import { Echart } from '@/components/Echart'
import { pieOptions, barOptions, lineOptions } from './echarts-data'
import { ref, reactive } from 'vue'

import { EChartsOption } from 'echarts'

const loading = ref(true)

const pieOptionsData = reactive<EChartsOption>(pieOptions) as EChartsOption

// 用户来源

const barOptionsData = reactive<EChartsOption>(barOptions) as EChartsOption

// 周活跃量

const lineOptionsData = reactive<EChartsOption>(lineOptions) as EChartsOption

// 每月销售总额

const getAllApi = async () => {
  // await Promise.all([getUserAccessSource(), getWeeklyUserActivity(), getMonthlySales()])
  loading.value = false
}

getAllApi()
</script>

<template>
  <PanelGroup />
  <ElRow :gutter="20" justify="space-between">
    <ElCol :xl="10" :lg="10" :md="24" :sm="24" :xs="24">
      <ElCard shadow="hover" class="mb-20px">
        <ElSkeleton :loading="loading" animated>
          <Echart :options="pieOptionsData" :height="300" />
        </ElSkeleton>
      </ElCard>
    </ElCol>
    <ElCol :xl="14" :lg="14" :md="24" :sm="24" :xs="24">
      <ElCard shadow="hover" class="mb-20px">
        <ElSkeleton :loading="loading" animated>
          <Echart :options="barOptionsData" :height="300" />
        </ElSkeleton>
      </ElCard>
    </ElCol>
    <ElCol :span="24">
      <ElCard shadow="hover" class="mb-20px">
        <ElSkeleton :loading="loading" animated :rows="4">
          <Echart :options="lineOptionsData" :height="350" />
        </ElSkeleton>
      </ElCard>
    </ElCol>
  </ElRow>
</template>
