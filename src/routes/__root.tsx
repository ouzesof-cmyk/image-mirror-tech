import { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  createRootRouteWithContext,
  useRouter,
  useRouterState,
  HeadContent,
  Scripts,
  Link,
} from "@tanstack/react-router";

import appCss from "../styles.css?url";
import { AppProviders } from "@/providers/AppProviders";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { trackVisit } from "@/lib/analytics";
import { AuthProvider } from "@/hooks/useAuth";


function NotFoundComponent() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <p className="text-xs font-mono uppercase tracking-[0.3em] text-[var(--electric)]">404</p>
        <h1 className="mt-3 font-display text-4xl font-black">Off the map</h1>
        <p className="mt-3 text-muted-foreground">
          That route doesn't exist — yet.
        </p>
        <Link to="/" className="mt-6 inline-flex rounded-full bg-primary text-primary-foreground px-6 py-3 text-sm font-semibold">
          Back home
        </Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <h1 className="font-display text-2xl font-black">Something broke.</h1>
        <p className="mt-3 text-sm text-muted-foreground">Try again or head home.</p>
        <div className="mt-6 flex gap-2 justify-center">
          <button
            onClick={() => { router.invalidate(); reset(); }}
            className="rounded-full bg-primary text-primary-foreground px-5 py-2.5 text-sm font-semibold"
          >
            Try again
          </button>
          <a href="/" className="rounded-full panel-convex px-5 py-2.5 text-sm font-semibold">
            Home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "OUZESOF — Crafting the Digital Future" },
      {
        name: "description",
        content:
          "OUZESOF is a creative studio in Annaba, Algeria. Branding, web, photography, videography, marketing and 3D architectural visualization.",
      },
      { property: "og:title", content: "OUZESOF — Crafting the Digital Future" },
      {
        property: "og:description",
        content:
          "Six dedicated studios. One obsessive standard. Branding, web, film, marketing and 3D visualization.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "OUZESOF — Crafting the Digital Future" },
      { name: "description", content: "Project Heartbeat is a web application for managing and scheduling Zoom meetings and user profiles." },
      { property: "og:description", content: "Project Heartbeat is a web application for managing and scheduling Zoom meetings and user profiles." },
      { name: "twitter:description", content: "Project Heartbeat is a web application for managing and scheduling Zoom meetings and user profiles." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/ccf18e22-1a58-4526-89bd-c6927a9e2e3c/id-preview-e171e649--7610d2e9-0528-4c6b-bba8-93a04b008a3a.lovable.app-1780187871451.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/ccf18e22-1a58-4526-89bd-c6927a9e2e3c/id-preview-e171e649--7610d2e9-0528-4c6b-bba8-93a04b008a3a.lovable.app-1780187871451.png" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Cairo:wght@400;600;700;900&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    if (pathname.startsWith("/admin")) return;
    trackVisit(pathname);
  }, [pathname]);

  return (
    <QueryClientProvider client={queryClient}>
      <AppProviders>
        <AuthProvider>
          <Navbar />
          <main className="min-h-screen pt-0">
            <Outlet />
          </main>
          <Footer />
        </AuthProvider>
      </AppProviders>
    </QueryClientProvider>
  );
}

