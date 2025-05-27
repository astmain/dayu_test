export interface AddressFormData {
  address_tag: string
  name: string
  phone: string
  street: string
  region: string[]
  tag: { label: string; value: string }
}

export interface DataListType {
  id: number
  name: string
  address_type: string
  region: string[]
  street: string
  phone: string
  operate?: React.ReactNode
  detailAddress?: React.ReactNode
  regionTitle?: string[]
  is_default?: boolean
}

export interface RegionType {
  id: number
  name: string
  children: RegionType
  parent_id: number
}
