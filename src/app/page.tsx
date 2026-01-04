import Link from 'next/link';
import { searchEmployees } from './actions';
import { EmployeeTable } from '@/components/EmployeeTable';
import { SearchBar } from '@/components/SearchBar';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const query = (await searchParams).q || '';
  const employees = await searchEmployees(query);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 glass-card p-6">
        <div>
          <h2 className="text-xl font-semibold opacity-80">Employee Directory</h2>
          <p className="text-sm opacity-60">Manage and view your team</p>
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <SearchBar defaultValue={query} />
          <Link href="/add" className="btn-primary whitespace-nowrap">
            + Add Employee
          </Link>
          <Link href="/settings" className="p-2 opacity-60 hover:opacity-100 transition-opacity" title="Settings">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" /><circle cx="12" cy="12" r="3" /></svg>
          </Link>
        </div>
      </div>

      <EmployeeTable employees={employees} />
    </div>
  );
}
