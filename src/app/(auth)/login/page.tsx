import { signIn } from "@/lib/auth"; // ✅ Fixed Import Path
import { Sparkles, AlertCircle } from "lucide-react"; // ✅ Changed to Sparkles

// NextAuth auth/error URLs se error params bhejta hai
export default async function LoginPage({
  searchParams,
}: {
  searchParams?: { error?: string };
}) {
  const errorMessage = searchParams?.error;

  return (
    // ✅ Premium Dark Theme Setup (bg-surface-950 vibe)
    <div className="flex min-h-screen items-center justify-center bg-[#0a0a0a] p-4 font-sans text-slate-50">
      
      {/* ✅ Glass Panel UI */}
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-md">
        
        {/* Branding Section */}
        <div className="mb-8 flex flex-col items-center text-center">
          {/* ✅ Gold/Brand-400 Themed Icon */}
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl border border-amber-400/20 bg-amber-400/10 text-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.15)]">
            <Sparkles size={32} />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Axcel Genie
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            Enterprise Data Intelligence for Clario
          </p>
        </div>

        {/* ✅ Error Handling Display */}
        {errorMessage && (
          <div className="mb-6 flex items-center gap-3 rounded-lg border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400">
            <AlertCircle size={18} className="shrink-0" />
            <p>Authentication failed. Please try again.</p>
          </div>
        )}

        {/* Login Form / Action */}
        <form
          action={async () => {
            "use server";
            try {
              // ✅ Correct Server Action call
              await signIn("google", { redirectTo: "/" });
            } catch (error) {
              // NextAuth uses Next.js redirects to navigate. 
              // We MUST rethrow if the error is a redirect, otherwise handle it.
              if (error instanceof Error && error.message.includes("NEXT_REDIRECT")) {
                throw error;
              }
              // Agar koi real error aaye (like AuthError) toh yahan aayega
              console.error("Login Server Action Error:", error);
              throw error; // Next.js Error boundary ya NextAuth sambhal lega
            }
          }}
        >
          <button
            type="submit"
            className="group flex w-full items-center justify-center gap-3 rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-white transition-all hover:border-white/20 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 focus:ring-offset-[#0a0a0a]"
          >
            {/* Google Logo SVG (Adjusted for dark mode) */}
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
              <path d="M1 1h22v22H1z" fill="none" />
            </svg>
            Sign in with Google
          </button>
        </form>

        <div className="mt-8 text-center text-xs text-slate-500">
          By signing in, you agree to our Terms of Service and Privacy Policy. <br />
          <span className="text-amber-500/70">Secured by NextAuth v5</span>
        </div>
      </div>
    </div>
  );
}