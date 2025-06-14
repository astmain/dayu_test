interface BaseAddressData {
  id ?: number,
  address_tag: string
  name: string
  phone: string
  street: string
  region?: string[]
  region_id?: number
}

export interface CreateAddressData extends BaseAddressData {
  is_default?: boolean
}

export interface GetAddressData {
  user_id: number
}

export interface SetDefaultAddressData {
  id: number
  is_default?: boolean
}
export interface UpdateAddressData extends BaseAddressData {
  id: number
  is_default?: boolean
}

export interface DeleteAddressData {
  id: number
}

export interface BaseRes<T> {
  data: T
  code: number
  message: string
}

export interface RegionType {
  id: number
  name: string
  children: RegionType[]
  parent_id: number
}

export interface CreateAddressRes {
  id: number
  address_tag: string
  name: string
  phone: string
  region: RegionType[]
  street: string
}

export interface UpdateAddressRes {
  address_tag: string
  region: string[]
  name: string
  phone: string
  street:string
}

export interface DeleteAddressRes {
  address_type: string
  name: string
  phone: string
}

export interface GetAddressListRes {
  id: number
  name: string
  children: GetAddressListRes[]
  parent_id: number
}
