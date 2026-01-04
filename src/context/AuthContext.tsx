'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter, usePathname } from 'next/navigation';

interface AuthContextType {
    user: User | null;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
});

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
            setLoading(false);

            // Redirect to login if not authenticated and not already on the login page
            if (!user && pathname !== '/login') {
                router.push('/login');
            }

            // Redirect to home if authenticated and on the login page
            if (user && pathname === '/login') {
                router.push('/');
            }
        });

        return () => unsubscribe();
    }, [pathname, router]);

    return (
        <AuthContext.Provider value={{ user, loading }}>
            {!loading ? children : (
                <div className="min-h-screen flex items-center justify-center bg-background">
                    <div className="glass-card p-8 flex flex-col items-center gap-4">
                        <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                        <p className="opacity-60 animate-pulse font-medium">Authenticating...</p>
                    </div>
                </div>
            )}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
