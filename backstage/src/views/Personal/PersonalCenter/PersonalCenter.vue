<script setup lang="ts">
import { ContentWrap } from '@/components/ContentWrap'
import { ref, unref } from 'vue'
import { ElDivider, ElImage, ElTag, ElTabPane, ElTabs, ElButton, ElMessage } from 'element-plus'
import defaultAvatar from '@/assets/imgs/avatar.jpg'
import UploadAvatar from './components/UploadAvatar.vue'
import { Dialog } from '@/components/Dialog'
import EditInfo from './components/EditInfo.vue'
import EditPassword from './components/EditPassword.vue'
import { getPersonByIdApi } from '@/api/user'
import { useUserStore } from '@/store/modules/user'
import { formatToDateTime } from '@/utils/dateUtil'
import { storeToRefs } from 'pinia'
import { UserType2 } from '@/api/login/types'

const userStore = useUserStore()
const { userInfo } = storeToRefs(userStore)
const activeName = ref('first')
const dialogVisible = ref(false)
const uploadAvatarRef = ref<ComponentRef<typeof UploadAvatar>>()
const avatarLoading = ref(false)

const fetchDetailUserApi = async () => {
  // 这里可以调用接口获取用户信息
  const userId = userStore.getUserInfo?.id
  if (!userId) {
    ElMessage.error('请先登录')
    return
  }
  try {
    const res = await getPersonByIdApi({ id: userId })
    const { userInfo } = res
    if (userInfo) {
      userStore.setUserInfo(userInfo as unknown as UserType2)
    } else {
      ElMessage.error('获取用户信息失败,请刷新页面!')
    }
  } catch (error) {
    console.log('🚀 ~ xzz: fetchDetailUserApi -> error', error)
    ElMessage.error('获取用户信息失败,请刷新页面!')
  }
}
fetchDetailUserApi()

const saveAvatar = async () => {
  try {
    avatarLoading.value = true
    const imgUrl = await unref(uploadAvatarRef)?.getAvatarUrl()
    // 这里可以调用修改头像接口
    if (imgUrl) {
      dialogVisible.value = false
      const currentUserInfo = userStore.getUserInfo || {}
      userStore.setUserInfo({
        ...(currentUserInfo as UserType2),
        avatar: imgUrl
      })
    }
  } catch (error) {
    console.log(error)
  } finally {
    avatarLoading.value = false
  }
}
</script>

<template>
  <div class="flex w-100% h-100%">
    <ContentWrap title="个人信息" class="w-400px">
      <div class="flex justify-center items-center">
        <div
          class="avatar w-[150px] h-[150px] relative cursor-pointer"
          @click="dialogVisible = true"
        >
          <ElImage
            class="w-[150px] h-[150px] rounded-full"
            :src="userInfo?.avatar || defaultAvatar"
            fit="fill"
          />
        </div>
      </div>
      <ElDivider />
      <div class="flex justify-between items-center">
        <div>昵称：</div>
        <div>{{ userInfo?.username }}</div>
      </div>
      <ElDivider />
      <div class="flex justify-between items-center">
        <div>手机号码：</div>
        <div>{{ userInfo?.phone ?? '-' }}</div>
      </div>
      <ElDivider />
      <div class="flex justify-between items-center">
        <div>用户邮箱：</div>
        <div>{{ userInfo?.email ?? '-' }}</div>
      </div>
      <ElDivider />
      <div class="flex justify-between items-center">
        <div>所属角色：</div>
        <div>
          <template v-if="userInfo?.roleList?.length">
            <ElTag v-for="item in userInfo?.roleList || []" :key="item.id" class="ml-2 mb-w"
              >{{ item.name }}
            </ElTag>
          </template>
          <template v-else>-</template>
        </div>
      </div>
      <ElDivider />
      <div class="flex justify-between items-center">
        <div>所属部门：</div>
        <div>{{ userInfo?.department?.name ?? '-' }}</div>
      </div>
      <ElDivider />
      <div class="flex items-center justify-center">
        <div class="text-12px">注册于：{{ formatToDateTime(userInfo?.createdAt) || '-' }}</div>
      </div>
    </ContentWrap>
    <ContentWrap title="基本资料" class="flex-[3] ml-20px">
      <ElTabs v-model="activeName">
        <ElTabPane label="基本信息" name="first">
          <EditInfo :user-info="userInfo" />
        </ElTabPane>
        <ElTabPane label="修改密码" name="second">
          <EditPassword :userid="userInfo?.id || 0" />
        </ElTabPane>
      </ElTabs>
    </ContentWrap>
  </div>

  <Dialog v-model="dialogVisible" title="修改头像" width="800px">
    <UploadAvatar
      ref="uploadAvatarRef"
      :url="userInfo?.avatar || defaultAvatar"
      :user-id="userInfo?.id || 0"
    />

    <template #footer>
      <ElButton type="primary" :loading="avatarLoading" @click="saveAvatar"> 保存 </ElButton>
      <ElButton @click="dialogVisible = false">关闭</ElButton>
    </template>
  </Dialog>
</template>

<style lang="less" scoped>
.avatar {
  position: relative;

  &::after {
    position: absolute;
    top: 0;
    left: 0;
    display: flex;
    width: 100%;
    height: 100%;
    font-size: 50px;
    color: #fff;
    background-color: rgb(0 0 0 / 40%);
    border-radius: 50%;
    content: '+';
    opacity: 0;
    justify-content: center;
    align-items: center;
  }

  &:hover {
    &::after {
      opacity: 1;
    }
  }
}
</style>
