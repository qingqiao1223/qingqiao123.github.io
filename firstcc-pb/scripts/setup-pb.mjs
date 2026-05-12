/**
 * PocketBase 数据库初始化脚本
 *
 * 使用方法：
 *   1. 启动 PocketBase: ./pocketbase serve
 *   2. 访问 http://127.0.0.1:8090/_/ 创建管理员账号
 *   3. 运行本脚本: node scripts/setup-pb.mjs
 *
 * 脚本会通过管理员 API 自动创建所有集合（collections）：
 *   - users 扩展（已有用户表加自定义字段）
 *   - products（商品）
 *   - favorites（收藏）
 *   - reports（举报）
 */

const PB_URL = process.env.PB_URL || "http://127.0.0.1:8090";

async function main() {
  console.log(`连接到 PocketBase: ${PB_URL}\n`);

  // 1. 请求管理员邮箱和密码
  const adminEmail = process.env.PB_ADMIN_EMAIL;
  const adminPassword = process.env.PB_ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    console.error("请设置环境变量 PB_ADMIN_EMAIL 和 PB_ADMIN_PASSWORD");
    console.error("例如：");
    console.error("  PB_ADMIN_EMAIL=admin@example.com PB_ADMIN_PASSWORD=yourpassword node scripts/setup-pb.mjs");
    process.exit(1);
  }

  // 2. 管理员登录获取 token
  const authRes = await fetch(`${PB_URL}/api/admins/auth-with-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ identity: adminEmail, password: adminPassword }),
  });

  if (!authRes.ok) {
    const err = await authRes.text();
    console.error("管理员登录失败:", err);
    process.exit(1);
  }

  const { token } = await authRes.json();
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  console.log("管理员登录成功\n");

  // 3. 定义所有集合
  const collections = [
    // ===== Products 集合 =====
    {
      name: "products",
      type: "base",
      schema: [
        {
          name: "seller_id",
          type: "relation",
          required: true,
          options: {
            collectionId: "_pb_users_auth_",
            cascadeDelete: true,
          },
        },
        {
          name: "title",
          type: "text",
          required: true,
          options: { min: 1, max: 200 },
        },
        {
          name: "description",
          type: "text",
          required: false,
          options: { max: null },
        },
        {
          name: "price",
          type: "number",
          required: true,
          options: { min: 0, max: 99999999 },
        },
        {
          name: "category",
          type: "select",
          required: true,
          options: {
            values: [
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
            ],
            maxSelect: 1,
          },
        },
        {
          name: "condition",
          type: "select",
          required: true,
          options: {
            values: [
              "全新",
              "几乎全新",
              "轻微使用",
              "明显使用",
              "功能正常但磨损明显",
            ],
            maxSelect: 1,
          },
        },
        {
          name: "status",
          type: "select",
          required: true,
          options: {
            values: ["在售", "已预订", "已售出", "已下架"],
            maxSelect: 1,
          },
        },
        {
          name: "contact_note",
          type: "text",
          required: false,
          options: { max: null },
        },
        {
          name: "view_count",
          type: "number",
          required: false,
          options: { min: 0, max: 99999999 },
        },
        {
          name: "images",
          type: "file",
          required: false,
          options: {
            maxSelect: 5,
            maxSize: 2097152,
            mimeTypes: ["image/jpeg", "image/png", "image/webp"],
            thumbs: [],
          },
        },
      ],
      indexes: [
        "CREATE INDEX idx_products_seller ON products (seller_id)",
        "CREATE INDEX idx_products_category ON products (category)",
        "CREATE INDEX idx_products_status ON products (status)",
        "CREATE INDEX idx_products_created ON products (created DESC)",
      ],
      listRule: null,
      viewRule: null,
      createRule: null,
      updateRule: null,
      deleteRule: null,
    },

    // ===== Favorites 集合 =====
    {
      name: "favorites",
      type: "base",
      schema: [
        {
          name: "user_id",
          type: "relation",
          required: true,
          options: {
            collectionId: "_pb_users_auth_",
            cascadeDelete: true,
          },
        },
        {
          name: "product_id",
          type: "relation",
          required: true,
          options: {
            collectionId: "products",
            cascadeDelete: true,
          },
        },
      ],
      indexes: [
        "CREATE UNIQUE INDEX idx_favorites_user_product ON favorites (user_id, product_id)",
        "CREATE INDEX idx_favorites_user ON favorites (user_id)",
      ],
      listRule: null,
      viewRule: null,
      createRule: null,
      updateRule: null,
      deleteRule: null,
    },

    // ===== Reports 集合 =====
    {
      name: "reports",
      type: "base",
      schema: [
        {
          name: "reporter_id",
          type: "relation",
          required: true,
          options: {
            collectionId: "_pb_users_auth_",
            cascadeDelete: true,
          },
        },
        {
          name: "product_id",
          type: "relation",
          required: true,
          options: {
            collectionId: "products",
            cascadeDelete: true,
          },
        },
        {
          name: "reason",
          type: "select",
          required: true,
          options: {
            values: [
              "违禁或违规商品",
              "虚假/诈骗信息",
              "侵权或盗用",
              "骚扰或不当内容",
              "其他",
            ],
            maxSelect: 1,
          },
        },
        {
          name: "description",
          type: "text",
          required: false,
          options: { max: null },
        },
        {
          name: "status",
          type: "select",
          required: true,
          options: {
            values: ["pending", "resolved", "rejected"],
            maxSelect: 1,
          },
        },
        {
          name: "admin_note",
          type: "text",
          required: false,
          options: { max: null },
        },
        {
          name: "handled_at",
          type: "date",
          required: false,
          options: { min: "", max: "" },
        },
      ],
      indexes: ["CREATE INDEX idx_reports_status ON reports (status)"],
      listRule: null,
      viewRule: null,
      createRule: null,
      updateRule: null,
      deleteRule: null,
    },
  ];

  // 4. 创建/更新集合
  // 先获取已有集合
  const existingRes = await fetch(`${PB_URL}/api/collections`, { headers });
  const { items: existingCollections } = await existingRes.json();
  const existingNames = new Set(existingCollections.map((c) => c.name));

  for (const col of collections) {
    if (existingNames.has(col.name)) {
      // 获取已存在集合的 ID
      const existing = existingCollections.find((c) => c.name === col.name);
      console.log(`更新集合: ${col.name}`);
      const res = await fetch(`${PB_URL}/api/collections/${existing.id}`, {
        method: "PUT",
        headers,
        body: JSON.stringify(col),
      });
      if (!res.ok) {
        const err = await res.text();
        console.error(`  更新失败: ${err}`);
      } else {
        console.log(`  更新成功`);
      }
    } else {
      console.log(`创建集合: ${col.name}`);
      const res = await fetch(`${PB_URL}/api/collections`, {
        method: "POST",
        headers,
        body: JSON.stringify(col),
      });
      if (!res.ok) {
        const err = await res.text();
        console.error(`  创建失败: ${err}`);
      } else {
        console.log(`  创建成功`);
      }
    }
  }

  // 5. 检查 users 集合是否需要添加自定义字段
  console.log("\n检查 users 集合自定义字段...");
  const usersCol = existingCollections.find((c) => c.name === "users");
  if (usersCol) {
    const userFields = new Set(usersCol.schema.map((f) => f.name));
    const customFields = [
      {
        name: "nickname",
        type: "text",
        required: false,
        options: { max: 200 },
      },
      {
        name: "wechat",
        type: "text",
        required: false,
        options: { max: 200 },
      },
      {
        name: "qq",
        type: "text",
        required: false,
        options: { max: 200 },
      },
      {
        name: "phone",
        type: "text",
        required: false,
        options: { max: 200 },
      },
      {
        name: "contact_note",
        type: "text",
        required: false,
        options: { max: null },
      },
      {
        name: "is_admin",
        type: "bool",
        required: false,
        options: {},
      },
      {
        name: "is_banned",
        type: "bool",
        required: false,
        options: {},
      },
    ];

    const fieldsToAdd = customFields.filter((f) => !userFields.has(f.name));
    if (fieldsToAdd.length > 0) {
      usersCol.schema.push(...fieldsToAdd);
      const res = await fetch(`${PB_URL}/api/collections/${usersCol.id}`, {
        method: "PUT",
        headers,
        body: JSON.stringify(usersCol),
      });
      if (res.ok) {
        console.log(`  已添加 ${fieldsToAdd.length} 个自定义字段`);
      } else {
        const err = await res.text();
        console.error(`  更新 users 失败: ${err}`);
      }
    } else {
      console.log("  所有自定义字段已存在");
    }
  }

  console.log("\n✓ PocketBase 数据库初始化完成！");
  console.log("请重新启动 PocketBase 使配置生效。");
}

main().catch(console.error);
