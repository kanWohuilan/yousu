/** 用户相关模块 */
declare namespace Auth {
  interface Role {
    id?: string;
    name?: string;
  }

  /**
   * 用户角色类型(前端静态路由用角色类型进行路由权限的控制)
   * - super: 超级管理员(该权限具有所有路由数据)
   * - admin: 管理员
   * - user: 用户
   * - custom: 自定义角色
   */
  type RoleType = keyof typeof import('@/enum').EnumUserRole;

  /** 用户信息 */
  interface UserInfo {
    /** 用户id */
    id: string;
    /** 用户名 */
    username: string;
    /** 用户角色类型 */
    nickname: string;
    phoneNumber: string;
    roleId: string;
  }

  interface Permission {
    id?: string;
    name?: string;
    code?: string;
    permissionType?: string;
  }
}

declare namespace UserManagement {
  type GenderKey = 1 | 0;
  type UserStatusKey = 1 | 2 | 3 | 4;
}

declare namespace BasePage {
  interface Page<T> {
    pageNum: number;
    pageSize: number;
    total: number;
    list: T[];
  }
}
declare namespace Apartment {
  /** 标签 */
  interface Tag {
    /** id */
    id: string;
    /** 标签名 */
    tagName: string;
    /** 标签颜色 */
    tagColor: string;
  }

  /**
   * 周边设施
   */
  interface AroundFacility {
    /** id */
    id: string;
    /** 设施名称 */
    name: string;
  }

  /**
   * 房型
   */
  interface HouseType {
    /** id */
    id: string;
    /** 名称 */
    typeName: string;
    /** 类型介绍 */
    typeIntroduce: string;
  }

  /**
   * 室内设施
   */
  interface IndoorFacility {
    /** id */
    id: string;
    /** 设施名称 */
    name: string;
  }

  /**
   * 室内设施
   */
  interface Apartment {
    /**
     * 公寓名称
     */
    name: string;

    /**
     * 公寓地点
     */
    site: string;

    /**
     * 邮编
     */
    zipCode: string;

    /**
     * 公寓地理位置信息
     */
    gisInfo: GisInfo;

    /**
     * 公寓位置介绍
     */
    siteIntroduce: string;

    /**
     * 公寓介绍
     */
    introduce: string;

    /**
     * 总床位数
     */
    beds: number;

    /**
     * 修建日期
     */
    buildYear: number;

    /**
     * 最高楼层
     */
    maxFloor: number;

    /**
     * 公寓图片
     */
    pictureUrls: string[];

    /**
     * 周租金
     */
    weeklyPrice: number;

    /**
     * 周边设施
     */
    aroundFacilities: string[];

    /**
     * 标签
     */
    tags: string[];
  }

  class ApartmentAdd implements Apartment {
    aroundFacilities: string[];

    beds: number;

    buildYear: number;

    currency: string;

    gisInfo: Apartment.GisInfo;

    introduce: string;

    maxFloor: number;

    name: string;

    pictureUrls: string[];

    site: string;

    siteIntroduce: string;

    tags: string[];

    weeklyPrice: number;

    zipCode: string;

    floorPlanUrls: string[];
  }

  class ApartmentEdit implements Apartment {
    /** id */
    id: string;

    aroundFacilities: string[];

    currency: string;

    beds: number;

    buildYear: number;

    gisInfo: Apartment.GisInfo;

    introduce: string;

    maxFloor: number;

    name: string;

    pictureUrls: string[];

    site: string;

    siteIntroduce: string;

    tags: string[];

    weeklyPrice: number;

    zipCode: string;

    floorPlanUrls: string[];
  }

  class ApartmentDelete {
    /** id */
    id: string;
  }

  class ApartmentVo implements Apartment {
    /** id */
    id: string;

    /**
     * 币种
     */
    currency: Currency;

    aroundFacilities: string[];

    beds: number;

    buildYear: number;

    gisInfo: Apartment.GisInfo;

    introduce: string;

    maxFloor: number;

    name: string;

    pictureUrls: string[];

    site: string;

    siteIntroduce: string;

    tags: string[];

    weeklyPrice: number;

    zipCode: string;
  }

  class ApartmentDetailVo implements Apartment {
    /** id */
    id: string;

    /**
     * 币种
     */
    currency: Currency;

    aroundFacilities: string[];

    beds: number;

    buildYear: number;

    gisInfo: Apartment.GisInfo;

    introduce: string;

    maxFloor: number;

    name: string;

    pictureUrls: string[];

    site: string;

    siteIntroduce: string;

    tags: string[];

    weeklyPrice: number;

    zipCode: string;

    floorPlanUrls: string[];

    countryId: string;

    cityId: string | null;
  }

  interface Currency {
    name?: string;
    code?: string;
    symbol?: string;
  }

  interface GisInfo {
    longitude?: string;
    latitude?: string;
  }

  interface Campus {
    id?: string;
    originalName?: string;
    chineseName?: string;
    gisInfo?: GisInfo;
    cityId?: string | null;
    countryId?: string | null;
  }

  interface ApartmentHouse {
    id?: string;
    apartmentId?: string;
    pictureUrls?: string[];
    weeklyPrice?: number;
    currency?: Currency | string;
    houseTypeId?: string;
    indoorFacilities: string[];
    floors?: string;
  }

  interface SubletHouse {
    id: string;
    customerId: string;
    apartmentId: string;
    apartmentName: string;
    apartmentHouseId: string;
    apartmentHouseName: string;
    building: string;
    floor: string;
    flat: string;
    roomNo: string;
    originalPrice: number;
    subletPrice: number;
    reason: string;
    beginTime: string;
    endTime: string;
    phoneNumber: string;
    status: Status;
    subletHouseApplyId: string;
    pictureUrls: string[];
  }
  interface Status {
    name: string;
    code: string;
  }
}

declare namespace Customer {
  interface Customer {
    id: string;
    weChatId: string;
    phoneNumber: string;
  }

  interface Status {
    name: string;
    code: string;
  }

  interface HouseApply {
    id: string;
    apartmentName: string;
    chineseName: string;
    passportFirstName: string;
    passportLastName: string;
    birthday: string;
    gender: string;
    phoneNumber: string;
    email: string;
    status: Status | string;
    handleResultRemark: string;
    handlePersonName: string;
  }

  interface SignOrder {
    customerId: string;
    chineseName: string;
    passportFirstName: string;
    passportLastName: string;
    phoneNumber: string;
    customerBirthday: string;
    apartmentId: string;
    apartmentHouseId: string;
    beginTime: string;
    endTime: string;
    weeklyPrice: number;
    salesStaffId: string;
    salesStaff: string;
    signDate: string;
    remark: string;
  }

  interface SubletHouseApply {
    id?: string;
    customerId?: string;
    apartmentId?: string;
    apartmentName: string;
    apartmentHouseId?: string;
    apartmentHouseName: string;
    reason: string;
    beginTime: string;
    endTime: string;
    phoneNumber: string;
    status: string;
    pictureUrls: string[];
    handlePersonId?: string;
    handlePersonName: string;
    handleRemark: string;
    floor: string;
    flat: string;
    roomNo: string;
    building: string;
  }
}

interface CountryAndCity {
  id?: string;
  originalName?: string;
  chineseName?: string;
  countryId?: string;
}

interface IndexImg {
  id?: string;
  pictureUrl: string;
  orderIndex: string;
  url: string;
}

interface StudentGroupQrCode {
  id?: string;
  qrCode: string;
  orderIndex: string;
}
