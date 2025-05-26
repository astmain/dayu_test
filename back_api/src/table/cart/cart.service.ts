import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { CaculatePriceDto, UpdateCartDto } from './dto/cart.dto';
enum SpecItem {
  MATERIAL = 1,
  GRINDING = 2,
  PAINT = 3,
  CEIL_HEIGHT = 5,
  NUTS = 6,
}
@Injectable()
export class CartService {
  constructor(private readonly pgPrisma: PrismaService) {}

  async findOwner(userId: number) {
    const list = await this.pgPrisma.cart.findMany({
      where: {
        userId,
        is_deleted: false,
        is_order: false,
      },
      include: {
        fileInfo: true,
      },
    });
    return { list, message: '获取购物车列表成功' };
  }

  async addCartByFileinfId(fileinfIds: number[], operateId: number) {
    // 0. 获取fileinfId 对应的文件信息
    const fileInfoArray = await this.pgPrisma.fileInfo.findMany({
      where: {
        id: { in: fileinfIds },
      },
      select: {
        volume: true,
        surface: true,
        uploaderId: true,
        id: true,
      },
    });
    if (!fileInfoArray) {
      throw new Error('添加失败,没有文件信息!');
    }

    // 1. 关联fileinfId  2. 赋默认值  材料id 属性  计算基础价格 打磨   喷漆
    const { defaultMaterial, defaultGrinding, defaultPaint, defaultCeilHeight } = await this.getAllDefaultData();
    const { id: material_id, density, price: material_unit_price, start_price, name: material_name } = defaultMaterial;
    const {
      id: grinding_id,
      price: grinding_unit_price,
      start_price: grinding_start_price,
      name: grinding_name,
    } = defaultGrinding;
    const { id: paint_id, price: paint_unit_price, start_price: paint_start_price } = defaultPaint;
    const { id: ceil_height_id, name: ceil_height_name } = defaultCeilHeight;
    const cartArray = fileInfoArray.map(fileInfo => {
      const { volume, surface } = fileInfo;

      const material_raw_price = volume * density * material_unit_price;
      const material_price = material_raw_price > start_price ? material_raw_price : start_price;
      const total_price = material_price * 1;
      return {
        count: 1,
        volume: volume,
        surface: surface,
        material_id,
        material_name,
        material_unit_price,
        material_price,
        material_final_price: material_price,
        grinding_id,
        grinding_name,
        grinding_unit_price,
        grinding_start_price,
        grinding_price: 0,
        grinding_final_price: 0,
        paint_id,
        paint_list: [],
        paint_unit_price,
        paint_start_price,
        paint_price: 0,
        paint_final_price: 0,
        nut_id: 0,
        nut_list: [],
        nut_unit_price: 0,
        nut_price: 0,
        nut_final_price: 0,
        ceil_height_id,
        ceil_height_name,
        ceil_height_rate: 1,
        // ceil_height_price: 0,
        // ceil_height_final_price: 0,
        total_price: total_price,
        total_final_price: total_price,
        fileInfoId: fileInfo.id,
        userId: operateId,
      };
    });
    const count = await this.pgPrisma.cart.createMany({
      data: cartArray,
    });
    return { count, message: '添加购物车成功' };
  }

  async findAll() {
    const list = await this.pgPrisma.cart.findMany({
      include: {
        fileInfo: true,
      },
    });
    const newList = list.map(item => {
      const { fileInfo, ...rest } = item;
      return {
        ...rest,
        ...fileInfo,
      };
    });
    return { data: newList, message: '获取购物车列表成功' };
  }

  async getAllDefaultData() {
    // 获取所有默认数据
    const defaultMaterial = await this.pgPrisma.material.findFirst({
      where: {
        is_default: true,
      },
      select: {
        id: true,
        name: true,
        price: true,
        start_price: true,
        density: true,
      },
    });
    if (!defaultMaterial) {
      throw new Error('添加失败,没有默认材料!');
    }
    const defaultGrinding = await this.pgPrisma.specList.findFirst({
      where: {
        specificationId: SpecItem.GRINDING,
        is_default: true,
      },
      select: {
        id: true,
        name: true,
        price: true,
        start_price: true,
      },
    });
    if (!defaultGrinding) {
      throw new Error('添加失败,没有默认打磨!');
    }
    const defaultPaint = await this.pgPrisma.specList.findFirst({
      where: {
        specificationId: SpecItem.PAINT,
        is_default: true,
      },
      select: {
        id: true,
        name: true,
        price: true,
        start_price: true,
      },
    });
    if (!defaultPaint) {
      throw new Error('添加失败,没有默认喷漆!');
    }
    const defaultCeilHeight = await this.pgPrisma.specList.findFirst({
      where: {
        specificationId: SpecItem.CEIL_HEIGHT,
        is_default: true,
      },
      select: {
        id: true,
        name: true,
        price: true,
      },
    });
    if (!defaultCeilHeight) {
      throw new Error('添加失败,没有默认层高!');
    }
    return { defaultMaterial, defaultGrinding, defaultPaint, defaultCeilHeight };
  }

  async getCurrentData(data: {
    material_id: number;
    grinding_id: number;
    paint_id: number;
    ceil_height_id: number;
    nuts_list: number[];
  }) {
    // 获取当前商品数据
    const { material_id, grinding_id, paint_id, ceil_height_id } = data;
    const material = await this.pgPrisma.material.findUnique({
      where: { id: material_id },
    });
    if (!material) {
      throw new Error('添加失败,没有找到材料!');
    }
    const grinding = await this.pgPrisma.specList.findUnique({
      where: { id: grinding_id },
    });
    if (!grinding) {
      throw new Error('添加失败,没有找到打磨!');
    }
    const paint = await this.pgPrisma.specList.findUnique({
      where: { id: paint_id },
    });
    if (!paint) {
      throw new Error('添加失败,没有找到喷漆!');
    }
    const ceilHeight = await this.pgPrisma.specList.findUnique({
      where: { id: ceil_height_id },
    });
    if (!ceilHeight) {
      throw new Error('添加失败,没有找到层高!');
    }
    return { material, grinding, paint, ceilHeight };
  }

  caculatePrice(cartData: CaculatePriceDto) {
    // 根据当前商品数据    计算当前商品价格  形成最终数据
    // 1. 密度 * 体积  = 重量    2. 重量 * 材料单价  = 材料价格   3. 材料价格  * 层高倍率系数  形成基础价格
    //  打磨价格  = 表面积 * 打磨单价  ?  起步价
    // 喷漆价格  = 表面积 * 喷漆单价  ?  起步价
    //  配件  螺母  = 螺母单价 * 螺母数量
    // 配件 牙套  = 牙套单价 * 牙套数量
    // 4. 基础价格  +  打磨价格  + 喷漆价格  + 螺母价格  + 牙套价格  = 最终价格
    //  最终价格  * 数量
    const {
      volume,
      surface,
      material_density,
      material_start_price,
      material_unit_price,
      grinding_unit_price,
      grinding_start_price,
      paint_list,
      paint_unit_price,
      paint_start_price,
      ceil_height_rate,
      nut_unit_price,
      nut_list,
      count,
    } = cartData;
    const material_raw_price = material_unit_price * material_density * volume;
    const material_price = material_raw_price > material_start_price ? material_raw_price : material_start_price;
    const base_price = material_price * ceil_height_rate;
    const grinding_raw_price = surface * grinding_unit_price;
    const grinding_price = grinding_raw_price > grinding_start_price ? grinding_raw_price : grinding_start_price;
    const paint_raw_list = (paint_list.c.length + paint_list.u.length) * paint_unit_price; // 如果不需要 则价格为0
    const paint_price = paint_raw_list > paint_start_price ? paint_raw_list : paint_start_price;
    //   [{name: 'm2*5', amount: 10}, {name: 'm2*10', amount: 10}]
    const nut_amount = nut_list.reduce((acc, curr) => acc + curr?.amount, 0);
    const nut_price = nut_amount * nut_unit_price;
    const total_price = (base_price + grinding_price + paint_price + nut_price) * count;
    return { paint_price, material_price, grinding_price, nut_price, total_price };
  }

  async updateItem(data: UpdateCartDto) {
    // 先查出当前商品
    const currentCart = await this.pgPrisma.cart.findUnique({
      where: { id: data.id },
      include: {
        fileInfo: true,
      },
    });
    if (!currentCart) {
      throw new Error('更新失败,没有找到商品!');
    }
    if (data?.count) {
      // 如果只是更新数量  暂时取巧 finally_price/count * newcount
      const count = await this.pgPrisma.cart.update({
        where: { id: data.id },
        data: {
          count: data.count,
          total_final_price: (currentCart?.total_price / currentCart?.count) * data.count,
        },
      });
      return { count, message: '更新购物车成功' };
    }

    // 如果需要更新 材料
    if (data?.material_id) {
      const material = await this.pgPrisma.material.findUnique({
        where: { id: data.material_id },
      });
      if (!material) {
        throw new Error('更新失败,没有找到材料!');
      }
      const {
        id: material_id,
        density: material_density,
        name: material_name,
        price: material_unit_price,
        start_price: material_start_price,
      } = material;
      // 填充 材料 价格

      const { total_price } = this.caculatePrice({
        ...currentCart,
        material_density,
        material_unit_price,
        material_start_price,
        paint_list: currentCart.paint_list as { c: string[]; u: string[] },
        nut_list: currentCart.nut_list as { name: string; amount: number }[],
      });
      const count = await this.pgPrisma.cart.update({
        where: { id: data.id },
        data: {
          material_id,
          material_name,
          material_unit_price,
          material_start_price,
          material_price: material_unit_price,
          material_final_price: material_unit_price,
          total_price,
          total_final_price: total_price,
        },
      });
      return { count, message: '更新购物车成功' };
    }

    // 如果需要更新 打磨
    if (data?.grinding_id) {
      const grinding = await this.pgPrisma.specList.findUnique({
        where: { id: data.grinding_id },
      });
      if (!grinding) {
        throw new Error('更新失败,没有找到打磨!');
      }
      const {
        id: grinding_id,
        name: grinding_name,
        price: grinding_unit_price,
        start_price: grinding_start_price,
      } = grinding;
      const { total_price } = this.caculatePrice({
        ...currentCart,
        grinding_unit_price,
        grinding_start_price,
        paint_list: currentCart.paint_list as { c: string[]; u: string[] },
        nut_list: currentCart.nut_list as { name: string; amount: number }[],
      });
      const count = await this.pgPrisma.cart.update({
        where: { id: data.id },
        data: {
          grinding_id,
          grinding_name,
          grinding_unit_price,
          grinding_start_price,
          grinding_price: grinding_unit_price,
          grinding_final_price: grinding_unit_price,
          total_price,
          total_final_price: total_price,
        },
      });
      return { count, message: '更新购物车成功' };
    }
  }

  async deleteItem(ids: number[]) {
    const cart = await this.pgPrisma.cart.updateMany({
      where: { id: { in: ids } },
      data: { is_deleted: true },
    });
    return { data: cart, message: '删除购物车成功' };
  }
}
