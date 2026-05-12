export type Profile = {
  id: string;
  nickname: string;
  avatar_url: string | null;
  wechat: string | null;
  qq: string | null;
  phone: string | null;
  contact_note: string | null;
  is_admin: boolean;
  is_banned: boolean;
  created_at: string;
  updated_at: string;
};

export type ProductRow = {
  id: string;
  seller_id: string;
  title: string;
  description: string | null;
  price: number;
  category: string;
  condition: string;
  status: string;
  contact_note: string | null;
  view_count: number;
  created_at: string;
  updated_at: string;
};

export type FavoriteRow = {
  id: string;
  user_id: string;
  product_id: string;
  created_at: string;
};

export type ReportRow = {
  id: string;
  reporter_id: string;
  product_id: string;
  reason: string;
  description: string | null;
  status: string;
  admin_note: string | null;
  created_at: string;
  handled_at: string | null;
};
