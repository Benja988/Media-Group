import { ThemeToggle } from "@/components/theme/ThemeToggle";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex items-center justify-between border-b border-border px-6 py-4">
        <span className="text-sm font-semibold">T.Media</span>
        <ThemeToggle />
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t border-border px-6 py-4 text-xs text-mutedForeground">
        © {new Date().getFullYear()} T.Media
      </footer>
    </div>
  );
}
