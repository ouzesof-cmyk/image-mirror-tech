import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState, FormEvent } from "react";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [{ title: "Admin Login — OUZESOF" }, { name: "robots", content: "noindex" }],
  }),
  component: LoginPage,
});

function LoginPage() {
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [info, setInfo] = useState<string | null>(null);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setInfo(null);
    setLoading(true);
    const { error } = mode === "signin" ? await signIn(email, password) : await signUp(email, password);
    setLoading(false);
    if (error) {
      setError(error);
      return;
    }
    if (mode === "signup") {
      setInfo("تم إنشاء الحساب. تحقق من بريدك الإلكتروني لتأكيد الحساب، ثم سجّل الدخول. ملاحظة: تحتاج صلاحية admin لاستخدام اللوحة (تواصل مع مالك الموقع).");
      setMode("signin");
      return;
    }
    navigate({ to: "/admin" });
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 shadow-xl">
        <Link to="/" className="text-xs text-foreground-secondary hover:text-foreground">← الرجوع للموقع</Link>
        <h1 className="mt-4 font-serif text-3xl text-foreground">
          {mode === "signin" ? "تسجيل دخول الأدمين" : "إنشاء حساب أدمين"}
        </h1>
        <p className="mt-2 text-sm text-foreground-secondary">
          {mode === "signin" ? "أدخل بياناتك للوصول إلى لوحة التحكم." : "أنشئ حسابك ثم اطلب من مالك الموقع منحك صلاحية الأدمين."}
        </p>

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <div>
            <label className="text-xs text-foreground-secondary">البريد الإلكتروني</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-foreground"
            />
          </div>
          <div>
            <label className="text-xs text-foreground-secondary">كلمة المرور</label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-foreground"
            />
          </div>

          {error && <p className="text-xs text-red-500">{error}</p>}
          {info && <p className="text-xs text-green-600">{info}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-foreground py-2.5 text-sm font-medium text-background transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {loading ? "..." : mode === "signin" ? "دخول" : "إنشاء حساب"}
          </button>
        </form>

        <button
          onClick={() => {
            setMode(mode === "signin" ? "signup" : "signin");
            setError(null);
            setInfo(null);
          }}
          className="mt-4 w-full text-xs text-foreground-secondary hover:text-foreground"
        >
          {mode === "signin" ? "ليس لديك حساب؟ أنشئ حساباً" : "لديك حساب؟ سجّل الدخول"}
        </button>
      </div>
    </main>
  );
}
