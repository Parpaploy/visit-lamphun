import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useTranslation } from "react-i18next";
import { LANGUAGES } from "../constant/language";
import { FirebaseError } from "firebase/app";

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const { user, login } = useAuth();
  const { t } = useTranslation();
  const { i18n } = useTranslation();

  const [open, setOpen] = useState<boolean>(false);
  const [langReady, setLangReady] = useState<boolean>(false);

  useEffect(() => {
    if (!open) return;

    const timer = setTimeout(() => setLangReady(true), 300);

    return () => {
      clearTimeout(timer);
      setLangReady(false);
    };
  }, [open]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState<boolean>(false);

  const current =
    LANGUAGES.find((l) => l.code === i18n.language) ?? LANGUAGES[0];

  useEffect(() => {
    if (user) {
      navigate("/private/dashboard");
    }
  }, [user, navigate]);

  const handleLogin = async () => {
    setError("");
    setLoading(true);

    try {
      await login(email, password);
      navigate("/private/dashboard");
    } catch (err) {
      if (err instanceof FirebaseError) {
        switch (err.code) {
          case "auth/user-not-found":
          case "auth/wrong-password":
            setError("auth.error");
            break;

          default:
            setError("auth.error");
        }
      } else {
        setError("auth.error");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[linear-gradient(161deg,#FFE2A5_0%,#FBFCF0_22%,#FFFFFF_62%,#E6EFD8_100%)] flex items-center justify-center p-5">
      <div className="absolute top-3 right-3 z-1000">
        <button
          className="bg-white shadow-[0_4px_4px_0_rgba(0,0,0,0.25)] rounded-full w-8.5 h-8.5 flex items-center justify-center overflow-hidden"
          onClick={() => setOpen((v) => !v)}
        >
          <img src={current.icon} className="w-full h-full object-cover" />
        </button>

        {open && (
          <>
            <div
              className="fixed inset-0 z-[-1]"
              onClick={() => setOpen(false)}
            />

            <div className="absolute top-12 right-0 bg-white rounded-xl shadow-[0_4px_10px_0_rgba(0,0,0,0.25)] py-2 flex flex-row min-w-50">
              {!langReady
                ? Array.from({ length: LANGUAGES.length }).map((_, i) => (
                    <div
                      key={i}
                      className="flex-1 flex flex-col items-center gap-2 px-4 py-2.5 aspect-square animate-pulse"
                    >
                      <div className="w-15 h-15 rounded-full bg-gray-200" />
                      <div className="h-3 w-8 rounded bg-gray-200" />
                    </div>
                  ))
                : LANGUAGES.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        i18n.changeLanguage(lang.code);
                        setOpen(false);
                      }}
                      className={`w-full flex flex-col items-center gap-3 px-4 py-2.5 aspect-square transition-all ${
                        i18n.language === lang.code
                          ? "font-medium"
                          : "opacity-50"
                      }`}
                    >
                      <img
                        src={lang.icon}
                        className={`min-w-15 aspect-square shadow-[0_4px_4px_0_rgba(0,0,0,0.25)] rounded-full ${
                          i18n.language === lang.code
                            ? "ring-3 ring-[#A1D6F5]/70"
                            : ""
                        }`}
                      />
                      <span className="text-[11px] whitespace-nowrap">
                        {lang.label}
                      </span>
                    </button>
                  ))}
            </div>
          </>
        )}
      </div>

      <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.2)] p-8 w-full max-w-sm border border-white/40">
        <h1 className="text-2xl font-bold text-[#543A14] mb-6 text-center tracking-tight">
          {t("auth.title")}
        </h1>

        <div className="flex flex-col gap-5">
          <div>
            <label className="text-sm text-[#543A14] font-medium mb-2 block">
              {t("auth.email")}
            </label>

            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white shadow-sm
                   outline-none focus:ring-2 focus:ring-[#BF4B17]/30 focus:border-[#BF4B17]
                   transition-all text-sm"
              placeholder="admin@example.com"
            />
          </div>

          <div>
            <label className="text-sm text-[#543A14] font-medium mb-2 block">
              {t("auth.password")}
            </label>

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white shadow-sm
                   outline-none focus:ring-2 focus:ring-[#BF4B17]/30 focus:border-[#BF4B17]
                   transition-all text-sm"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm text-center py-2 rounded-lg">
              {t(error)}
            </div>
          )}

          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full py-3 rounded-xl bg-linear-to-r from-[#BF4B17] to-[#a33b12]
                 text-white font-medium text-sm shadow-md
                 hover:shadow-lg hover:scale-[1.01] active:scale-[0.99]
                 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? t("auth.loading") : t("auth.login")}
          </button>
        </div>
      </div>
    </div>
  );
}
