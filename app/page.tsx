import Link from "next/link";

export default function HomePage() {
  return (
    <main
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "calc(100vh - 120px)",
        padding: "2rem",
        textAlign: "center",
      }}
    >
      <h1 style={{ fontSize: "2rem", fontWeight: 700, color: "#0d9488", margin: 0 }}>
        校园二手平台
      </h1>
      <p style={{ marginTop: "1rem", color: "#64748b", maxWidth: "400px" }}>
        发布闲置、浏览商品。请优先选择校内公共场所当面交易。
      </p>
      <nav style={{ marginTop: "2rem", display: "flex", gap: "1rem" }}>
        <Link
          href="/products"
          style={{
            display: "inline-block",
            padding: "0.75rem 1.5rem",
            backgroundColor: "#0d9488",
            color: "#fff",
            borderRadius: "8px",
            textDecoration: "none",
            fontWeight: 500,
          }}
        >
          去商品页
        </Link>
        <Link
          href="/login"
          style={{
            display: "inline-block",
            padding: "0.75rem 1.5rem",
            border: "1px solid #cbd5e1",
            color: "#334155",
            borderRadius: "8px",
            textDecoration: "none",
            fontWeight: 500,
          }}
        >
          去登录页
        </Link>
      </nav>
    </main>
  );
}
