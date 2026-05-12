export const PRODUCT_CATEGORIES = [
  "教材书籍",
  "数码电子",
  "宿舍生活用品",
  "自行车/电动车",
  "服装鞋帽",
  "体育用品",
  "学习资料",
  "美妆护理",
  "票券卡券",
  "其他",
] as const;

export const PRODUCT_CONDITIONS = [
  "全新",
  "几乎全新",
  "轻微使用",
  "明显使用",
  "功能正常但磨损明显",
] as const;

export const PRODUCT_STATUSES = ["在售", "已预订", "已售出", "已下架"] as const;

export const REPORT_STATUSES = ["pending", "resolved", "rejected"] as const;

export type ProductCategory = (typeof PRODUCT_CATEGORIES)[number];
export type ProductCondition = (typeof PRODUCT_CONDITIONS)[number];
export type ProductStatus = (typeof PRODUCT_STATUSES)[number];
export type ReportReason = (typeof REPORT_REASONS)[number];
export type ReportStatus = (typeof REPORT_STATUSES)[number];

export const PROHIBITED_ITEMS_TEXT = [
  "烟草",
  "酒类",
  "药品",
  "管制刀具",
  "危险品",
  "成人用品",
  "赌博相关物品",
  "违法违规商品",
  "虚假商品",
  "诈骗信息",
  "侵犯他人权益的商品",
].join("、");

export const REPORT_REASONS = [
  "违禁或违规商品",
  "虚假/诈骗信息",
  "侵权或盗用",
  "骚扰或不当内容",
  "其他",
] as const;
