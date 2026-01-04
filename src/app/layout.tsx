import './globals.css';
import type { Metadata } from 'next';
import { AuthProvider } from '@/context/AuthContext';

export const runtime = 'edge';

export const metadata: Metadata = {
  title: 'Employee Database | LittoHR',
  description: 'HR Database System',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased selection:bg-indigo-500 selection:text-white">
        <AuthProvider>
          {/* Background Overlay for better glass effect */}
          <div className="fixed inset-0 z-[-1] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/20 via-background to-background pointer-events-none" />

          <main className="min-h-screen flex flex-col items-center p-4 sm:p-8">
            <div className="w-full max-w-6xl relative z-10 animate-fade-in-up space-y-8">
              {children}
            </div>
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}
