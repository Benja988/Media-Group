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


// import Link from "next/link";

// export default function Home() {
//   return (
//     <main className="flex min-h-screen items-center justify-center">
//       <div className="text-center space-y-6">
//         <h1 className="text-4xl font-semibold tracking-tight">
//           T.Media Platform
//         </h1>

//         <p className="text-slate-400 max-w-md">
//           Secure authentication, role-based access, and modern identity
//           infrastructure for media organizations.
//         </p>

//         <div className="flex justify-center gap-4">
//           <Link
//             href="/login"
//             className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium hover:bg-blue-500 transition"
//           >
//             Sign in
//           </Link>

//           <Link
//             href="/register"
//             className="rounded-lg border border-slate-700 px-5 py-2 text-sm font-medium hover:bg-slate-900 transition"
//           >
//             Create account
//           </Link>
//         </div>

//         <p className="text-xs text-slate-500">
//           Developed by @t.media
//         </p>
//       </div>
//     </main>
//   );
// }
