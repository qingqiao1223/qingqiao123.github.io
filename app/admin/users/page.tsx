import { adminSetUserBanned } from "@/app/admin/actions";
import { requireAdmin } from "@/lib/admin";
import { createServerClient } from "@/lib/pocketbase/server";
import { getProfile } from "@/lib/auth";

export const runtime = "edge";

export default async function AdminUsersPage() {
  await requireAdmin();
  const me = await getProfile();
  const pb = await createServerClient();
  const result = await pb.collection("users").getList(1, 200, {
    sort: "-created",
    fields: "id,nickname,is_admin,is_banned,created,wechat,qq,phone",
  });

  return (
    <main>
      <h1 className="text-2xl font-semibold text-slate-900">用户管理</h1>
      <p className="mt-2 text-sm text-slate-600">
        封禁或解封用户（不影响管理员本人）。
      </p>

      <div className="mt-6 overflow-x-auto rounded-xl border border-slate-200 bg-white">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 text-slate-600">
            <tr>
              <th className="px-3 py-2">昵称</th>
              <th className="px-3 py-2">管理员</th>
              <th className="px-3 py-2">状态</th>
              <th className="px-3 py-2">操作</th>
            </tr>
          </thead>
          <tbody>
            {result.items.map((u) => (
              <tr key={u.id} className="border-b border-slate-100">
                <td className="px-3 py-2">
                  <div className="font-medium">
                    {u.nickname || "未命名"}
                  </div>
                  <div className="font-mono text-xs text-slate-400">
                    {u.id.slice(0, 8)}…
                  </div>
                </td>
                <td className="px-3 py-2">
                  {u.is_admin ? "是" : "否"}
                </td>
                <td className="px-3 py-2">
                  {u.is_banned ? (
                    <span className="text-red-600">已封禁</span>
                  ) : (
                    <span className="text-emerald-700">正常</span>
                  )}
                </td>
                <td className="px-3 py-2">
                  {u.id === me?.id ? (
                    <span className="text-slate-400">当前账号</span>
                  ) : u.is_banned ? (
                    <form action={adminSetUserBanned}>
                      <input type="hidden" name="id" value={u.id} />
                      <input type="hidden" name="banned" value="false" />
                      <button
                        type="submit"
                        className="rounded border border-slate-300 px-2 py-1 text-xs hover:bg-slate-50"
                      >
                        解封
                      </button>
                    </form>
                  ) : (
                    <form action={adminSetUserBanned}>
                      <input type="hidden" name="id" value={u.id} />
                      <input type="hidden" name="banned" value="true" />
                      <button
                        type="submit"
                        className="rounded border border-red-300 px-2 py-1 text-xs text-red-700 hover:bg-red-50"
                      >
                        封禁
                      </button>
                    </form>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
