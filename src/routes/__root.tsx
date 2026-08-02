import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { BrandGradientDefs } from "@/components/site/BrandGradientDefs";
import { WhatsAppFab } from "@/components/site/WhatsAppFab";
import { Toaster } from "@/components/ui/sonner";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center gradient-brand rounded-md px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center gradient-brand rounded-md px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
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
      { title: "Space-ious — Hardware That Fits Every Space" },
      {
        name: "description",
        content:
          "Door and cabinet handles, knobs, folding handles, rim locks, hooks, curtain brackets and door accessories for households, shops and commercial spaces. Explore the Space-ious hardware catalogue and request a quote.",
      },
      { name: "author", content: "Space-ious" },
      { property: "og:title", content: "Space-ious — Hardware That Fits Every Space" },
      {
        property: "og:description",
        content:
          "Door and cabinet handles, knobs, folding handles, rim locks, hooks, curtain brackets and door accessories for households, shops and commercial spaces. Explore the Space-ious hardware catalogue and request a quote.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Space-ious — Hardware That Fits Every Space" },
      {
        name: "twitter:description",
        content:
          "Door and cabinet handles, knobs, folding handles, rim locks, hooks, curtain brackets and door accessories for households, shops and commercial spaces. Explore the Space-ious hardware catalogue and request a quote.",
      },
      {
        property: "og:image",
        content:
          "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/5ce9de05-9e3e-44b7-abfd-aa2e286531bc/id-preview-15107bae--37241688-31e1-4a75-9f69-ca81657e1a46.lovable.app-1785589124164.png",
      },
      {
        name: "twitter:image",
        content:
          "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/5ce9de05-9e3e-44b7-abfd-aa2e286531bc/id-preview-15107bae--37241688-31e1-4a75-9f69-ca81657e1a46.lovable.app-1785589124164.png",
      },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Poppins:wght@500;600;700&display=swap",
      },
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
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

  return (
    <QueryClientProvider client={queryClient}>
      <BrandGradientDefs />
      {/* overflow-x-clip, not hidden: `hidden` would make this a scroll
          container and break the sticky header. This is a backstop — any
          horizontal overflow on a phone makes the browser scale the entire page
          down to fit, which is a page-wide failure from one stray element. */}
      <div className="flex min-h-screen flex-col overflow-x-clip bg-background">
        <Header />
        {/* The header overlays the page, so pad content clear of it. A section
            that wants to sit *under* the bar cancels this with a negative
            margin — see the hero on the home page. */}
        <main className="flex-1 pt-[var(--header-h)]">
          {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
          <Outlet />
        </main>
        <Footer />
      </div>
      <WhatsAppFab />
      <Toaster />
    </QueryClientProvider>
  );
}
