import { create } from "zustand"

import { getCartListApi } from "@/network/api/print"

/*
model Cart {


*/
interface PrintCartItem {
  id: number
  name: string
  count: number
  material_id: number
  material_name: string
  material_price: number
  material_final_price: number
  grinding_id: number
  grinding_name: string
  grinding_price: number
  grinding_final_price: number
  paint_id: number
  paint_name: string
  paint_price: number
  paint_final_price: number
  nuts_list?: number[]
  nuts_price: number
  nuts_final_price: number
  ceil_height_id: number
  ceil_height_name: string
  ceil_height_price: number
  ceil_height_final_price: number
  hole_imgs?: number[]
  attachments?: number[]
  total_price: number
  total_final_price: number
  isChecked: boolean
  weight: number
  fileInfo: {
    filename: string
    filepath: string
    screenshot: string
    height: number
    width: number
    length: number

    volume: number
    surface: number
  }
}

interface CurrentItemType extends PrintCartItem {
  material: string
  attributes: string
  paint: {
    c: { pantone: string; hex: string }[]
    u: { pantone: string; hex: string }[]
  }
}

interface PrintCartStore {
  printCart: PrintCartItem[]
  initPrintCart: () => Promise<void>
  setPrintCart: (printCart: PrintCartItem[]) => void
  deliveryInfo: DeliveryInfoType
  setDeliveryInfo: (deliveryInfo: DeliveryInfoType) => void
  getisCheckededPrintCart: () => PrintCartItem[]
  calculateTotalPrice: () => number
  updatePrintCart: (id: number, printCart: PrintCartItem) => void
  deliveryList: DeliveryInfoType[]
  setDeliveryList: (deliveryList: DeliveryInfoType[]) => void
  isAgree: boolean
  setIsAgree: (isAgree: boolean) => void
  isEditModalOpen: boolean
  openEditModal: () => void
  setOpenEditModal: (openEditModal: boolean) => void
  currentItem: CurrentItemType
  setCurrentItem: (currentItem: CurrentItemType) => void
  updateCurrentItem: (currentItem: CurrentItemType) => void
}

interface DeliveryInfoType {
  type: string
  price: number
  label: string
}

const deliveryList: DeliveryInfoType[] = [
  {
    label: "7个工作日",
    type: "标准",
    price: 88.88,
  },
  {
    label: "12个工作日",
    type: "经济",
    price: 50.0,
  },
  {
    label: "3个工作日",
    type: "加急",
    price: 288.0,
  },
  {
    label: "2个工作日",
    type: "专机加急",
    price: 588.0,
  },
]
export const usePrintCartStore = create<PrintCartStore>((set, get) => ({
  isAgree: false,
  setIsAgree: (isAgree: boolean) => set({ isAgree }),
  printCart: [] as PrintCartItem[],
  initPrintCart: async () => {
    const res = await getCartListApi()
    // const list = res?.data?.map((item) => {
    //   const { fileinfo, ...rest } = item
    //   return {
    //     ...fileinfo,
    //     ...rest,
    //     file_url: fileinfo.screenshot,
    //   }
    // })
    set({ printCart: res?.list || [] })
  },
  setPrintCart: (printCart: PrintCartItem[]) => set({ printCart }),
  addPrintCart: (printCart: PrintCartItem[]) => set((state) => ({ printCart: [...state.printCart, ...printCart] })),
  removePrintCart: (id: number[]) =>
    set((state) => ({ printCart: state.printCart.filter((item) => !id.includes(item.id)) })),
  updatePrintCart: (id: number, printCart: PrintCartItem) =>
    set((state) => ({ printCart: state.printCart.map((item) => (item.id === id ? printCart : item)) })),
  deliveryList,
  setDeliveryList: (deliveryList: DeliveryInfoType[]) => set({ deliveryList }),
  deliveryInfo: deliveryList[0],
  setDeliveryInfo: (deliveryInfo: DeliveryInfoType) => set({ deliveryInfo }),
  getisCheckededPrintCart: () => get().printCart.filter((item) => item?.isChecked),
  calculateTotalPrice: () => {
    const itemPrice = get()
      .getisCheckededPrintCart()
      .reduce((acc, item) => acc + Number(item.total_price) * Number(item.count), 0)
    const totalPrice = itemPrice + Number(get().deliveryInfo.price)
    return totalPrice
  },
  isEditModalOpen: false,
  openEditModal: () => set({ isEditModalOpen: true }),
  setOpenEditModal: (openEditModal: boolean) => set({ isEditModalOpen: openEditModal }),
  currentItem: {} as CurrentItemType,
  setCurrentItem: (currentItem: CurrentItemType) => set({ currentItem }),
  updateCurrentItem: (currentItem: CurrentItemType) =>
    set({ currentItem: { ...get().currentItem, ...JSON.parse(JSON.stringify(currentItem)) } }),
}))
