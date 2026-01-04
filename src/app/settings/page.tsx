'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signOut, updatePassword, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';
import { auth } from '@/lib/firebase';

export default function SettingsPage() {
    const [currentPass, setCurrentPass] = useState('');
    const [newPass, setNewPass] = useState('');
    const [confirmPass, setConfirmPass] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const router = useRouter();

    const handleSignOut = async () => {
        try {
            await signOut(auth);
            router.push('/login');
        } catch (error) {
            console.error('Sign out error:', error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage(null);

        const user = auth.currentUser;
        if (!user || !user.email) {
            setMessage({ type: 'error', text: 'You must be logged in to change your password.' });
            return;
        }

        if (newPass !== confirmPass) {
            setMessage({ type: 'error', text: 'New passwords do not match' });
            return;
        }

        if (newPass.length < 6) {
            setMessage({ type: 'error', text: 'New password must be at least 6 characters' });
            return;
        }

        setIsSubmitting(true);

        try {
            // 1. Re-authenticate to ensure the sensitive action is allowed
            const credential = EmailAuthProvider.credential(user.email, currentPass);
            await reauthenticateWithCredential(user, credential);

            // 2. Update the password
            await updatePassword(user, newPass);

            setMessage({ type: 'success', text: 'Password updated successfully!' });
            setCurrentPass('');
            setNewPass('');
            setConfirmPass('');

            // Optional: Send user back home after a delay
            setTimeout(() => router.push('/'), 2000);
        } catch (error: any) {
            console.error('Password update error:', error);
            let errorText = 'Failed to update password. Please check your current password.';
            if (error.code === 'auth/wrong-password') {
                errorText = 'The current password you entered is incorrect.';
            } else if (error.code === 'auth/weak-password') {
                errorText = 'The new password is too weak.';
            }
            setMessage({ type: 'error', text: errorText });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-md mx-auto space-y-8 animate-fade-in-up">
            <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Link href="/" className="p-2 opacity-60 hover:opacity-100 transition-opacity">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
                    </Link>
                    <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-500">
                        System Settings
                    </h2>
                </div>
            </div>

            <div className="glass-card p-6 space-y-8">
                <div className="space-y-6 pb-6 border-b border-white/5">
                    <div>
                        <h3 className="text-lg font-medium opacity-80 mb-1">Change Administrator Password</h3>
                        <p className="text-sm opacity-60">Update your Firebase account credentials.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-1">
                            <label className="text-xs font-bold uppercase tracking-widest opacity-50">Current Password</label>
                            <input
                                type="password"
                                value={currentPass}
                                onChange={(e) => setCurrentPass(e.target.value)}
                                required
                                className="input-field"
                                placeholder="Enter current password"
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-bold uppercase tracking-widest opacity-50">New Password</label>
                            <input
                                type="password"
                                value={newPass}
                                onChange={(e) => setNewPass(e.target.value)}
                                required
                                className="input-field"
                                placeholder="Minimum 6 characters"
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-bold uppercase tracking-widest opacity-50">Confirm New Password</label>
                            <input
                                type="password"
                                value={confirmPass}
                                onChange={(e) => setConfirmPass(e.target.value)}
                                required
                                className="input-field"
                                placeholder="Confirm new password"
                            />
                        </div>

                        {message && (
                            <div className={`p-3 rounded-lg text-sm border ${message.type === 'success' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
                                {message.text}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="btn-primary w-full mt-4"
                        >
                            {isSubmitting ? 'Updating...' : 'Update Password'}
                        </button>
                    </form>
                </div>

                <div className="pt-2 text-center">
                    <button
                        onClick={handleSignOut}
                        className="text-sm font-medium text-red-400 hover:text-red-300 transition-colors flex items-center justify-center gap-2 mx-auto"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" x2="9" y1="12" y2="12" /></svg>
                        Sign Out from System
                    </button>
                </div>
            </div>
        </div>
    );
}
