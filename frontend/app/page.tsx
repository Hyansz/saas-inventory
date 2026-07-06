"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
    LockKeyhole,
    Eye,
    EyeOff,
    Loader2,
    User,
    Boxes,
    Package,
    ScanBarcode,
    ShieldCheck,
    ArrowRight,
} from "lucide-react";
import { login } from "@/services/auth";
import { useAuthStore } from "@/store/auth-store";

type Phase = "splash" | "ready";

// durasi animasi transisi (harus selaras sama duration-700 di className panel/card)
const REDIRECT_DELAY_MS = 700;

export default function HomePage() {
    const router = useRouter();

    const setAuth = useAuthStore((state) => state.setAuth);

    const user = useAuthStore((state) => state.user);

    const [username, setUsername] = useState("");

    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(false);

    const [showPassword, setShowPassword] = useState(false);

    const [error, setError] = useState("");

    // ==== ANIMATION STATE ====
    const [phase, setPhase] = useState<Phase>("splash");
    const [showCard, setShowCard] = useState(false);
    const [progressStarted, setProgressStarted] = useState(false);

    // login berhasil -> jalankan animasi transisi lalu langsung pindah ke dashboard
    const [success, setSuccess] = useState(false);
    // guard biar router.replace cuma kepanggil sekali (transitionend bisa nembak
    // lebih dari sekali karena beberapa properti CSS berubah bebarengan)
    const hasNavigatedRef = useRef(false);

    const goToDashboard = () => {
        if (hasNavigatedRef.current) return;
        hasNavigatedRef.current = true;
        router.replace("/dashboard");
    };

    // panggil ini di elemen yang animasinya "menutup" (panel kanan / card mobile)
    // supaya pindah halaman PERSIS pas animasi kelar, bukan nunggu delay terpisah.
    // desktop: propertinya "transform" (translate-x). mobile: propertinya
    // "min-height" (card mekar dari 60vh ke 100vh, translate-y-nya sendiri gak berubah)
    const handleTransitionEnd = (e: React.TransitionEvent) => {
        if (
            success &&
            (e.propertyName === "transform" || e.propertyName === "min-height")
        ) {
            goToDashboard();
        }
    };

    // ==== VALIDATION ====
    // tombol login hanya aktif kalau kedua field sudah diisi (bukan cuma spasi)
    const isFormValid =
        username.trim().length > 0 && password.trim().length > 0;
    const isSubmitDisabled = loading || !isFormValid;

    useEffect(() => {
        // kalau user sudah ada TAPI bukan karena baru saja login (success flow),
        // baru redirect langsung — supaya animasi sukses gak "disalip"
        if (user && !success) {
            router.replace("/dashboard");
        }
    }, [user, success, router]);

    useEffect(() => {
        // splash tampil sebentar, lalu masuk ke halaman utama
        const toReady = setTimeout(() => setPhase("ready"), 1300);
        // card form slide up sedikit setelah splash hilang
        const toCard = setTimeout(() => setShowCard(true), 1650);

        // trigger progress bar mengisi dari 0 -> 100% (butuh 1 frame delay
        // biar transition CSS-nya kepicu, bukan langsung penuh)
        const raf = requestAnimationFrame(() => {
            requestAnimationFrame(() => setProgressStarted(true));
        });

        return () => {
            clearTimeout(toReady);
            clearTimeout(toCard);
            cancelAnimationFrame(raf);
        };
    }, []);

    useEffect(() => {
        // preload halaman dashboard dari awal, biar begitu animasi kelar
        // halamannya udah siap dan gak ada jeda nunggu loading/compile
        router.prefetch("/dashboard");
    }, [router]);

    useEffect(() => {
        // safety net: kalau karena suatu hal transitionend gak ke-trigger
        // (misal reduced-motion di sistem user), tetep pindah halaman
        if (!success) return;

        const fallback = setTimeout(() => {
            goToDashboard();
        }, REDIRECT_DELAY_MS + 150);

        return () => clearTimeout(fallback);
    }, [success]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!isFormValid) {
            setError("Username dan password wajib diisi");
            return;
        }

        try {
            setLoading(true);

            const response = await login({
                username: username.trim(),
                password,
            });

            setAuth(response.user, response.token);

            // jangan matiin loading di sini — biarkan tombol tetap "locked"
            // sampai animasi sukses selesai dan halaman benar-benar pindah
            setSuccess(true);
        } catch (error: any) {
            setError(
                error.response?.data?.message ?? "Username atau password salah",
            );
            setLoading(false);
        }
    };

    return (
        <main className="relative min-h-screen w-full overflow-hidden">
            {/* ================= SPLASH SCREEN (mobile + desktop) ================= */}
            <div
                className={`
                    fixed inset-0 z-50 flex flex-col items-center justify-center
                    overflow-hidden bg-gradient-to-br from-zinc-950 via-zinc-900 to-black
                    transition-opacity duration-700 ease-out
                    ${phase === "splash" ? "opacity-100" : "pointer-events-none opacity-0"}
                `}
            >
                {/* AMBIENT GLOW */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.08),transparent_35%)]" />

                <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-white/5 blur-3xl" />

                <div className="absolute bottom-0 left-0 h-72 w-72 rounded-full bg-indigo-500/10 blur-3xl" />

                {/* CORNER RETICLES */}
                {[
                    "top-6 left-6 border-t border-l rounded-tl-xl",
                    "top-6 right-6 border-t border-r rounded-tr-xl",
                    "bottom-6 left-6 border-b border-l rounded-bl-xl",
                    "bottom-6 right-6 border-b border-r rounded-br-xl",
                ].map((pos, i) => (
                    <div
                        key={i}
                        className={`absolute h-5 w-5 border-white/15 ${pos}`}
                    />
                ))}

                {/* CONTENT */}
                <div
                    className={`
                        relative z-10 flex flex-col items-center
                        transition-all duration-700 ease-out
                        ${phase === "splash" ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0"}
                    `}
                >
                    {/* LOGO + GLOW RING */}
                    <div className="relative mb-6 flex h-20 w-20 items-center justify-center">
                        <div className="absolute inset-0 rounded-full bg-indigo-500/20 blur-xl" />

                        <div className="absolute inset-0 rounded-full border border-indigo-400/20" />

                        <div className="absolute inset-2 animate-pulse rounded-full border border-indigo-400/30" />

                        <Boxes size={30} className="relative text-indigo-300" />
                    </div>

                    <span className="text-2xl font-bold tracking-tight text-white">
                        Inventory
                        <span className="text-indigo-400">System</span>
                    </span>

                    <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.25em] text-zinc-500">
                        Menyiapkan sistem
                    </p>

                    {/* PROGRESS BAR */}
                    <div className="mt-6 h-1 w-40 overflow-hidden rounded-full bg-white/10">
                        <div
                            className="h-full rounded-full bg-indigo-400 transition-all duration-[1300ms] ease-linear"
                            style={{
                                width: progressStarted ? "100%" : "0%",
                            }}
                        />
                    </div>
                </div>
            </div>

            {/* =====================================================================
                MOBILE LAYOUT — unchanged base, card "mekar" fullscreen saat sukses
               ===================================================================== */}
            <div className="lg:hidden h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-black">
                {/* ================= HERO / ILLUSTRATION AREA ================= */}
                <div className="relative h-[40vh] min-h-[260px] w-full">
                    {/* AMBIENT GLOW — senada splash */}
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.06),transparent_35%)]" />

                    <div className="absolute -left-10 -top-10 h-44 w-44 rounded-full bg-white/5 blur-3xl" />
                    <div className="absolute -right-6 top-8 h-40 w-40 rounded-full bg-indigo-500/10 blur-3xl" />

                    {/* icon dummy pojok, GANTI dengan ilustrasi/foto asli kalau sudah ada */}
                    <Package
                        size={54}
                        className={`
                            absolute left-6 top-8 -rotate-[15deg] text-indigo-300/70
                            transition-all duration-700 ease-out
                            ${phase === "ready" ? "translate-y-0 opacity-100" : "-translate-y-3 opacity-0"}
                        `}
                    />
                    <ScanBarcode
                        size={60}
                        className={`
                            absolute bottom-8 right-8 rotate-[10deg] text-indigo-400/70
                            transition-all duration-700 ease-out delay-100
                            ${phase === "ready" ? "translate-y-0 opacity-100" : "-translate-y-3 opacity-0"}
                        `}
                    />
                    <Boxes
                        size={38}
                        className={`
                            absolute bottom-2 left-10 text-white/20
                            transition-all duration-700 ease-out delay-150
                            ${phase === "ready" ? "translate-y-0 opacity-100" : "-translate-y-3 opacity-0"}
                        `}
                    />

                    {/* logo + judul tengah */}
                    <div
                        className={`
                            flex h-full flex-col items-center justify-center px-4 text-center
                            transition-all duration-700 ease-out
                            ${phase === "ready" ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}
                        `}
                    >
                        <div className="flex items-center gap-2">
                            <Boxes size={28} className="text-indigo-400" />
                            <h1 className="text-2xl font-extrabold tracking-tight text-white">
                                Inventory
                                <span className="text-indigo-400">System</span>
                            </h1>
                        </div>

                        <p className="mt-2 text-xs text-zinc-400">
                            Kelola stok jadi lebih mudah &amp; rapi
                        </p>
                    </div>
                </div>

                {/* ================= CARD LOGIN (SLIDE UP → FULLSCREEN SAAT SUKSES) ================= */}
                <div
                    onTransitionEnd={handleTransitionEnd}
                    className={`
                        fixed inset-x-0 bottom-0 z-10 overflow-hidden
                        border border-white/40 bg-white/80 backdrop-blur-2xl backdrop-saturate-150
                        px-6 pb-8 pt-8 shadow-[0_-20px_60px_rgba(0,0,0,0.45)]
                        transition-all duration-700 ease-out
                        ${showCard ? "translate-y-0" : "translate-y-full"}
                        ${success ? "top-0 rounded-none bg-zinc-950/95" : "rounded-t-[2.5rem]"}
                    `}
                    style={{ minHeight: success ? "100vh" : "60vh" }}
                >
                    {/* SHEEN — highlight tipis di atas, hilang saat mode sukses */}
                    <div
                        className={`
                            pointer-events-none absolute inset-x-0 top-0 h-20
                            bg-gradient-to-b from-white/60 to-transparent
                            transition-opacity duration-500
                            ${success ? "opacity-0" : "opacity-100"}
                        `}
                    />

                    {success ? (
                        // ======== SUCCESS STATE (fullscreen, blank transition) ========
                        <div className="relative h-full min-h-[100vh] w-full" />
                    ) : (
                        // ======== FORM STATE ========
                        <div className="relative mx-auto w-full max-w-sm">
                            {/* HEADER */}
                            <div className="mb-6 text-center">
                                <h2 className="text-xl font-bold text-zinc-800">
                                    Selamat Datang
                                </h2>

                                <p className="mt-1 text-sm text-zinc-500">
                                    Login untuk melanjutkan ke dashboard
                                    inventory.
                                </p>
                            </div>

                            {/* FORM */}
                            <form
                                onSubmit={handleLogin}
                                className="space-y-4"
                                noValidate
                            >
                                {/* USERNAME */}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-zinc-700">
                                        Username{" "}
                                        <span className="text-red-500">*</span>
                                    </label>

                                    <div className="relative">
                                        <User
                                            size={18}
                                            className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400"
                                        />

                                        <input
                                            type="text"
                                            placeholder="username"
                                            value={username}
                                            required
                                            onChange={(e) => {
                                                setUsername(e.target.value);
                                                if (error) {
                                                    setError("");
                                                }
                                            }}
                                            className="w-full h-12 mt-1 rounded-2xl border border-zinc-200 bg-white/60 pl-11 pr-4 text-sm text-zinc-800 placeholder-zinc-400 outline-none backdrop-blur-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:bg-white"
                                        />
                                    </div>
                                </div>

                                {/* PASSWORD */}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-zinc-700">
                                        Password{" "}
                                        <span className="text-red-500">*</span>
                                    </label>

                                    <div className="relative">
                                        <LockKeyhole
                                            size={18}
                                            className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400"
                                        />

                                        <input
                                            type={
                                                showPassword
                                                    ? "text"
                                                    : "password"
                                            }
                                            placeholder="••••••••"
                                            value={password}
                                            required
                                            onChange={(e) => {
                                                setPassword(e.target.value);

                                                if (error) {
                                                    setError("");
                                                }
                                            }}
                                            className="w-full h-12 mt-1 rounded-2xl border border-zinc-200 bg-white/60 pl-11 pr-11 text-sm text-zinc-800 placeholder-zinc-400 outline-none backdrop-blur-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:bg-white"
                                        />

                                        <button
                                            type="button"
                                            onClick={() =>
                                                setShowPassword(!showPassword)
                                            }
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700 transition"
                                        >
                                            {showPassword ? (
                                                <EyeOff size={18} />
                                            ) : (
                                                <Eye size={18} />
                                            )}
                                        </button>
                                    </div>
                                </div>

                                {/* BUTTON */}
                                <button
                                    type="submit"
                                    disabled={isSubmitDisabled}
                                    className="w-full h-12 mt-2 rounded-2xl bg-indigo-600 text-white font-semibold shadow-lg shadow-indigo-600/25 hover:bg-indigo-700 transition disabled:cursor-not-allowed disabled:bg-zinc-300 disabled:text-zinc-500 disabled:shadow-none flex items-center justify-center gap-2 cursor-pointer"
                                >
                                    {loading && (
                                        <Loader2
                                            size={18}
                                            className="animate-spin"
                                        />
                                    )}

                                    {loading ? "Loading..." : "Login"}
                                </button>
                            </form>

                            {/* FOOTER */}
                            <div className="mt-8 border-t border-zinc-200 pt-6">
                                <p className="text-center text-xs text-zinc-500">
                                    Secure Inventory Management System
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* =====================================================================
                DESKTOP LAYOUT — split screen, panel kebuka kiri-kanan saat sukses
               ===================================================================== */}
            <div className="relative hidden min-h-screen w-full overflow-hidden lg:flex">
                {/* ================= LEFT — BRAND / ILLUSTRATION PANEL ================= */}
                <div
                    className={`
                        relative z-10 flex w-1/2 flex-col justify-between overflow-hidden
                        bg-gradient-to-br from-zinc-950 via-zinc-900 to-black px-16 py-14 xl:px-24
                        transition-transform duration-700 ease-in-out
                        ${success ? "-translate-x-full" : "translate-x-0"}
                    `}
                >
                    {/* AMBIENT GLOW */}
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.07),transparent_40%)]" />
                    <div className="absolute -top-32 -right-20 h-96 w-96 rounded-full bg-white/5 blur-3xl" />
                    <div className="absolute -bottom-24 -left-16 h-96 w-96 rounded-full bg-indigo-500/10 blur-3xl" />

                    {/* subtle grid texture */}
                    <div
                        className="absolute inset-0 opacity-[0.07]"
                        style={{
                            backgroundImage:
                                "linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)",
                            backgroundSize: "48px 48px",
                        }}
                    />

                    {/* CORNER RETICLES */}
                    {[
                        "top-10 left-10 border-t border-l rounded-tl-xl",
                        "top-10 right-10 border-t border-r rounded-tr-xl",
                        "bottom-10 left-10 border-b border-l rounded-bl-xl",
                        "bottom-10 right-10 border-b border-r rounded-br-xl",
                    ].map((pos, i) => (
                        <div
                            key={i}
                            className={`absolute h-6 w-6 border-white/15 ${pos}`}
                        />
                    ))}

                    {/* TOP — logo */}
                    <div
                        className={`
                            relative z-10 flex items-center gap-2
                            transition-all duration-700 ease-out
                            ${phase === "ready" ? "translate-y-0 opacity-100" : "-translate-y-3 opacity-0"}
                        `}
                    >
                        <Boxes size={26} className="text-indigo-400" />
                        <span className="text-lg font-bold tracking-tight text-white">
                            Inventory
                            <span className="text-indigo-400">System</span>
                        </span>
                    </div>

                    {/* MIDDLE — headline + floating icons */}
                    <div
                        className={`
                            relative z-10 max-w-md
                            transition-all duration-700 ease-out
                            ${phase === "ready" ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}
                        `}
                    >
                        <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-white xl:text-5xl">
                            Kelola stok jadi
                            <br />
                            lebih mudah{" "}
                            <span className="text-indigo-400">&amp; rapi</span>.
                        </h1>

                        <p className="mt-5 text-sm leading-relaxed text-zinc-400">
                            Pantau barang masuk, keluar, dan sisa stok gudang
                            secara real-time dari satu dashboard yang rapi.
                        </p>

                        <div className="mt-8 flex items-center gap-2 text-xs text-zinc-500">
                            <ShieldCheck
                                size={16}
                                className="text-indigo-400"
                            />
                            Data tersimpan aman &amp; terenkripsi
                        </div>
                    </div>

                    {/* floating decorative icons */}
                    <Package
                        size={64}
                        className={`
                            absolute right-16 top-24 -rotate-[12deg] text-indigo-300/60
                            transition-all duration-700 ease-out
                            ${phase === "ready" ? "translate-y-0 opacity-100" : "-translate-y-3 opacity-0"}
                        `}
                    />
                    <ScanBarcode
                        size={70}
                        className={`
                            absolute bottom-24 right-20 rotate-[8deg] text-indigo-400/60
                            transition-all duration-700 ease-out delay-100
                            ${phase === "ready" ? "translate-y-0 opacity-100" : "-translate-y-3 opacity-0"}
                        `}
                    />

                    {/* BOTTOM — footer note */}
                    <p
                        className={`
                            relative z-10 text-xs text-zinc-600
                            transition-all duration-700 ease-out
                            ${phase === "ready" ? "opacity-100" : "opacity-0"}
                        `}
                    >
                        © {new Date().getFullYear()} InventorySystem. All rights
                        reserved.
                    </p>
                </div>

                {/* ================= RIGHT — LOGIN FORM PANEL ================= */}
                <div
                    onTransitionEnd={handleTransitionEnd}
                    className={`
                        relative z-10 flex w-1/2 items-center justify-center bg-zinc-50 px-12
                        transition-transform duration-700 ease-in-out
                        ${success ? "translate-x-full" : "translate-x-0"}
                    `}
                >
                    <div
                        className={`
                            w-full max-w-sm
                            transition-all duration-700 ease-out
                            ${phase === "ready" ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}
                        `}
                    >
                        {/* HEADER */}
                        <div className="mb-8">
                            <h2 className="text-2xl font-bold text-zinc-800">
                                Selamat Datang Kembali
                            </h2>

                            <p className="mt-1 text-sm text-zinc-500">
                                Login untuk melanjutkan ke dashboard inventory.
                            </p>
                        </div>

                        {/* FORM */}
                        <form
                            onSubmit={handleLogin}
                            className="space-y-5"
                            noValidate
                        >
                            {/* USERNAME */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-zinc-700">
                                    Username{" "}
                                    <span className="text-red-500">*</span>
                                </label>

                                <div className="relative">
                                    <User
                                        size={18}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400"
                                    />

                                    <input
                                        type="text"
                                        placeholder="username"
                                        value={username}
                                        required
                                        onChange={(e) => {
                                            setUsername(e.target.value);
                                            if (error) {
                                                setError("");
                                            }
                                        }}
                                        className="w-full h-12 mt-1 rounded-xl border border-zinc-200 bg-white pl-11 pr-4 text-sm text-zinc-800 placeholder-zinc-400 outline-none transition focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                </div>
                            </div>

                            {/* PASSWORD */}
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <label className="text-sm font-medium text-zinc-700">
                                        Password{" "}
                                        <span className="text-red-500">*</span>
                                    </label>
                                </div>

                                <div className="relative">
                                    <LockKeyhole
                                        size={18}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400"
                                    />

                                    <input
                                        type={
                                            showPassword ? "text" : "password"
                                        }
                                        placeholder="••••••••"
                                        value={password}
                                        required
                                        onChange={(e) => {
                                            setPassword(e.target.value);

                                            if (error) {
                                                setError("");
                                            }
                                        }}
                                        className="w-full h-12 mt-1 rounded-xl border border-zinc-200 bg-white pl-11 pr-11 text-sm text-zinc-800 placeholder-zinc-400 outline-none transition focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    />

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowPassword(!showPassword)
                                        }
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700 transition"
                                    >
                                        {showPassword ? (
                                            <EyeOff size={18} />
                                        ) : (
                                            <Eye size={18} />
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* BUTTON */}
                            <button
                                type="submit"
                                disabled={isSubmitDisabled}
                                className="group flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 font-semibold text-white shadow-lg shadow-indigo-600/25 transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-zinc-300 disabled:text-zinc-500 disabled:shadow-none cursor-pointer"
                            >
                                {loading ? (
                                    <>
                                        <Loader2
                                            size={18}
                                            className="animate-spin"
                                        />
                                        Loading...
                                    </>
                                ) : (
                                    <>
                                        Login
                                        <ArrowRight
                                            size={16}
                                            className="transition-transform group-hover:translate-x-0.5"
                                        />
                                    </>
                                )}
                            </button>
                        </form>

                        {/* FOOTER */}
                        <div className="mt-10 flex items-center gap-2 border-t border-zinc-200 pt-6">
                            <ShieldCheck size={14} className="text-zinc-400" />
                            <p className="text-xs text-zinc-500">
                                Secure Inventory Management System
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
