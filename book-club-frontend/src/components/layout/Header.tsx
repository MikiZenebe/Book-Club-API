import { API_BASE_URL, GOOGLE_CLIENT_ID } from "@/constants/baseUrl";
import { useEffect, useRef, useState } from "react";

interface GoogleCredentialResponse {
  credential: string;
}

interface GoogleAccounts {
  initialize: (options: {
    client_id: string;
    callback: (response: GoogleCredentialResponse) => void;
  }) => void;
  renderButton: (
    element: HTMLElement,
    options: {
      theme: string;
      size: string;
      shape: string;
      text: string;
      width: number;
    },
  ) => void;
}

declare global {
  interface Window {
    google?: {
      accounts: {
        id: GoogleAccounts;
      };
    };
  }
}

interface SignedInUser {
  googleId: string;
  email: string;
  name: string;
  picture: string | null;
}

export default function Header() {
  const googleButtonRef = useRef<HTMLDivElement>(null);
  const [user, setUser] = useState<SignedInUser | null>(null);
  const [authError, setAuthError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [googleReady, setGoogleReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let interval: number | undefined;

    function initializeGoogleSignIn() {
      if (
        cancelled ||
        !window.google ||
        !googleButtonRef.current ||
        !GOOGLE_CLIENT_ID
      ) {
        return;
      }

      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: async ({ credential }) => {
          setAuthLoading(true);
          setAuthError("");

          try {
            const res = await fetch(`${API_BASE_URL}/auth/google`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ idToken: credential }),
            });

            const data = await res.json();

            if (!res.ok) {
              throw new Error(data.message || "Google sign-in failed.");
            }

            setUser(data.user);
          } catch (error) {
            if (!cancelled) {
              setAuthError(error.message);
            }
          } finally {
            if (!cancelled) {
              setAuthLoading(false);
            }
          }
        },
      });

      googleButtonRef.current.replaceChildren();

      window.google.accounts.id.renderButton(googleButtonRef.current, {
        theme: "outline",
        size: "large",
        shape: "pill",
        text: "signin_with",
        width: 220,
      });

      setGoogleReady(true);
    }

    if (window.google) {
      initializeGoogleSignIn();
    } else {
      interval = window.setInterval(() => {
        if (window.google) {
          if (interval !== undefined) {
            window.clearInterval(interval);
          }
          initializeGoogleSignIn();
        }
      }, 100);
    }

    return () => {
      cancelled = true;

      if (interval !== undefined) {
        window.clearInterval(interval);
      }
    };
  }, []);

  return (
    <header className="sticky top-0 z-30 flex min-h-19 w-full items-center justify-between gap-4 border-b border-stone-200/80 bg-[#fcfaf7]/90 px-4 backdrop-blur-xl sm:px-6 lg:px-8">
      {/* Left: Welcome message */}
      <div className="flex items-center gap-3 text-[11px] text-[#6b5d52]">
        <span className="hidden sm:inline">Good morning</span>
        <span className="hidden sm:inline text-[#d4a574]">·</span>
        <span className="italic">47 readers browsing right now</span>
      </div>

      {/* Right: Activity and authentication */}
      <div className="flex shrink-0 items-center gap-3 sm:gap-5">
        <div className="hidden items-center gap-2 rounded-full border border-stone-200/80 bg-white/80 px-3 py-2 md:flex">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-50" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
          </span>

          <span className="text-xs font-medium text-stone-500">
            Readers are exploring
          </span>
        </div>

        <div className="relative flex min-h-10 items-center justify-center">
          {user ? (
            <div className="flex max-w-47.5 items-center gap-3 rounded-full border border-stone-200 bg-white py-1.5 pl-1.5 pr-3 shadow-sm">
              {user.picture ? (
                <img
                  src={user.picture}
                  alt=""
                  referrerPolicy="no-referrer"
                  className="h-9 w-9 shrink-0 rounded-full object-cover"
                />
              ) : (
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-amber-100 text-sm font-semibold text-amber-800">
                  {(user.name || user.email).charAt(0).toUpperCase()}
                </div>
              )}

              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-stone-800">
                  {user.name || user.email}
                </p>
                <p className="text-[11px] text-stone-400">BookHeaven reader</p>
              </div>
            </div>
          ) : (
            <div className="flex min-h-10 items-center justify-center">
              {authLoading ? (
                <div
                  className="flex items-center gap-2 rounded-full border border-stone-200 bg-white px-4 py-2.5 text-sm text-stone-600"
                  role="status"
                >
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-stone-300 border-t-amber-700" />
                  <span>Signing in...</span>
                </div>
              ) : (
                <>
                  {!googleReady && GOOGLE_CLIENT_ID && (
                    <span className="mr-2 hidden text-xs text-stone-400 sm:inline">
                      Loading sign-in...
                    </span>
                  )}

                  <div
                    ref={googleButtonRef}
                    className="max-w-full overflow-hidden"
                  />
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {authError && (
        <div
          role="alert"
          className="absolute right-4 top-[calc(100%+8px)] z-50 max-w-[calc(100vw-2rem)] rounded-xl border border-red-200 bg-white px-4 py-3 text-sm text-red-700 shadow-lg sm:right-6"
        >
          {authError}
        </div>
      )}

      {!GOOGLE_CLIENT_ID && (
        <span className="sr-only">
          Google sign-in is not configured. Check GOOGLE_CLIENT_ID.
        </span>
      )}
    </header>
  );
}
