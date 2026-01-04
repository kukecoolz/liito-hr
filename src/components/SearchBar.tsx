'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useTransition } from 'react';

export function SearchBar({ defaultValue }: { defaultValue: string }) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isPending, startTransition] = useTransition();

    function handleSearch(term: string) {
        const params = new URLSearchParams(searchParams);
        if (term) {
            params.set('q', term);
        } else {
            params.delete('q');
        }

        startTransition(() => {
            router.replace(`/?${params.toString()}`);
        });
    }

    return (
        <div className="relative w-full md:w-64">
            <input
                type="text"
                placeholder="Search employees..."
                className="input-field w-full"
                defaultValue={defaultValue}
                onChange={(e) => handleSearch(e.target.value)}
            />
            {isPending && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <div className="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
            )}
        </div>
    );
}
