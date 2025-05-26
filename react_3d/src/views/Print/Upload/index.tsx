import React, { useCallback } from "react"
import { useDropzone } from "react-dropzone"

import { useStartLoading } from "../Previewer/hooks"
import { calculateFileHash, uploadSlice } from "./utils"
const M500 = 1024 * 1024 * 500 // 500MB
// const wait = async (seconds: number) => new Promise((resolve) => setTimeout(resolve, seconds * 1000))

const UploadXzz: React.FC = () => {
  const { startLoading } = useStartLoading()
  const toggleLoading = useGlobalStore((state) => state.toggleLoading)
  const { initPrintHistory } = usePrintHistoryStore((state) => state)
  const { initPrintCart } = usePrintCartStore((state) => state)

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      toggleLoading()
      try {
        const models: { name: string; type: string; blobURL: string }[] = []
        const execs = acceptedFiles.map(async (file) => {
          //   上传文件
          const fileSha256 = await calculateFileHash(file)
          await uploadSlice(file, 0, fileSha256)
          const fileType = file.name?.split(".")?.pop()?.toLowerCase() || ""
          const blobURL = URL.createObjectURL(file)
          models.push({
            name: file.name,
            type: fileType,
            blobURL,
          })
        })
        // 使用 Promise.all 等待所有文件处理完成
        await Promise.all(execs)
        console.log("🚀 ~ execs:===========")

        await Promise.all(models.map(async (model) => await startLoading(model.blobURL, model.type, model.name)))

        initPrintHistory()
        initPrintCart()
      } catch (error) {
        console.error("文件处理出错:", error)
      } finally {
        toggleLoading()
      }
    },
    [startLoading, toggleLoading],
  )
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    noClick: true,
    // accept: { "application/*": accept.split(",") },
    maxSize: M500,
    maxFiles: 12,
  })
  const [isFirst, setIsFirst] = useState(true)
  const [zIndex, setZIndex] = useState<string | number>("auto")
  useEffect(() => {
    // 组件 第一次挂载 不执行
    if (isFirst) {
      return setIsFirst(false)
    } else {
      setZIndex(isDragActive ? 1000 : "auto")
    }
  }, [isDragActive, isFirst])

  return (
    <>
      <div
        className="h-[100%] w-[100%] flex justify-center items-center bg-[#8c8aff] absolute "
        {...getRootProps()}
        style={{ borderRadius: "20px", overflow: "hidden", zIndex }}
        id="uploadcontainer"
      >
        <input {...getInputProps()} />
        <p className="text-[clamp(0.8rem,2vw,1.3rem)]">
          {isDragActive ? "释放文件进行上传" : "拖拽文件到这里，或者点击以选择文件"}
        </p>
        <div className=" absolute bottom-[10px] z-[3] bg-white rounded-md p-2 ">
          (格式: <span style={{ color: "red", display: "contents" }}>推荐STL</span>/OBJ/IGS/STP)拖拽上传或
          <a
            className="cursor-pointer"
            onClick={(e) => {
              e.stopPropagation()
              const inputElement = document.querySelector('input[type="file"]') as HTMLInputElement | null
              inputElement?.click()
            }}
          >
            点击上传
          </a>
        </div>
      </div>
    </>
  )
}

export default UploadXzz
