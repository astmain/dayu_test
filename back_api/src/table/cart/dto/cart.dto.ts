export class CreateCartDto {}

// 计算价格
export class CaculatePriceDto {
  volume: number;
  surface: number;
  material_density: number;
  material_unit_price: number;
  material_start_price: number;
  grinding_unit_price: number;
  grinding_start_price: number;
  paint_list: { c: string[]; u: string[] };
  paint_unit_price: number;
  paint_start_price: number;
  ceil_height_rate: number;
  nut_unit_price: number;
  nut_list: { name: string; amount: number }[];
  count: number;
}

export class UpdateCartDto {
  id: number;
  count?: number;
  material_id?: number;
  grinding_id?: number;
  paint_id?: number;
  ceil_height_id?: number;
  nut_id?: number;
}
