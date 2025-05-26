import { message } from "antd"
import { RcFile } from "antd/es/upload/interface"

export const calculateFileHash = async (file: File) => {
  if (!file) return

  const arrayBuffer = await file.arrayBuffer()
  const hashBuffer = await crypto.subtle.digest("SHA-256", arrayBuffer)

  // 转为十六进制字符串
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("")
  return hashHex
}
export const uploadSlice: any = async (file: RcFile, currentChunk = 0, sha256: string) => {
  console.log("🚀 ~ constuploadSlice:any= ==========~ uploadSlice:")

  const sliceSize = 1024 * 1024 * 2 // 每片大小2MB
  const start = currentChunk * sliceSize
  const end = Math.min(start + sliceSize, file.size)
  const totalChunks = Math.ceil(file.size / sliceSize) // 总片数
  const blob = file.slice(start, end)
  const formData = new FormData()
  formData.append("sha256", sha256)
  formData.append("chunkNumber", currentChunk + "")
  formData.append("totalChunks", totalChunks + "")
  formData.append("fileName", file.name)
  formData.append("file", blob) //  文件一定要放到最后传递
  const token: string | null = localStorage.getItem("token")
  try {
    const response = await fetch("/api/file/3dUpload", {
      headers: {
        authorization: `Bearer ${token}`,
      },
      method: "POST",
      body: formData,
    })
    const res = await response.json()
    if (res?.code === 200) {
      console.log("上传分片:" + currentChunk + "/" + totalChunks)
      currentChunk++
      if (currentChunk < totalChunks) {
        return await uploadSlice(file, currentChunk, sha256)
      } else {
        return response
        // alert('文件上传且合并成功!');
        const resEnd = await response.json()
        // console.log("🚀 ~ xzz: res", res)
        return resEnd
      }
    } else {
      // message.error("上传模型失败,请重新尝试!")
      throw new Error("上传分片数据失败")
    }
  } catch (error) {
    message.error("上传模型失败,请重新尝试!")
    throw new Error("上传分片数据失败")
  }
}
