'use client';

import { Employee } from '@/types';
import { useState } from 'react';
import { EmployeeModal } from './EmployeeModal';

export function EmployeeTable({ employees }: { employees: Employee[] }) {
    const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

    const handleRowClick = (employee: Employee) => {
        setSelectedEmployee(employee);
    };

    const handleCloseModal = () => {
        setSelectedEmployee(null);
    };

    return (
        <div className="glass-card overflow-hidden !p-0">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[1400px]">
                    <thead className="bg-indigo-500/10 border-b border-indigo-500/20">
                        <tr>
                            <th className="px-4 py-4 text-xs font-semibold uppercase tracking-wider opacity-70">Employee</th>
                            <th className="px-4 py-4 text-xs font-semibold uppercase tracking-wider opacity-70">Position</th>
                            <th className="px-4 py-4 text-xs font-semibold uppercase tracking-wider opacity-70">Gender</th>
                            <th className="px-4 py-4 text-xs font-semibold uppercase tracking-wider opacity-70">DOB</th>
                            <th className="px-4 py-4 text-xs font-semibold uppercase tracking-wider opacity-70">NRC</th>
                            <th className="px-4 py-4 text-xs font-semibold uppercase tracking-wider opacity-70">Phone</th>
                            <th className="px-4 py-4 text-xs font-semibold uppercase tracking-wider opacity-70">Address</th>
                            <th className="px-4 py-4 text-xs font-semibold uppercase tracking-wider opacity-70">Start Date</th>
                            <th className="px-4 py-4 text-xs font-semibold uppercase tracking-wider opacity-70">Kin Name</th>
                            <th className="px-4 py-4 text-xs font-semibold uppercase tracking-wider opacity-70">Kin Relation</th>
                            <th className="px-4 py-4 text-xs font-semibold uppercase tracking-wider opacity-70">Kin Phone</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {employees.map((emp) => (
                            <tr
                                key={emp.id}
                                onClick={() => handleRowClick(emp)}
                                className="hover:bg-white/5 transition-colors cursor-pointer group h-16"
                            >
                                <td className="px-4 py-2">
                                    <div className="flex items-center gap-3">
                                        <div
                                            style={{ width: '40px', height: '40px', minWidth: '40px' }}
                                            className="rounded-full overflow-hidden border border-indigo-500/30 bg-gray-100 dark:bg-gray-800 flex-shrink-0"
                                        >
                                            {emp.image_data ? (
                                                <img
                                                    src={emp.image_data}
                                                    alt={emp.full_name}
                                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center font-bold text-gray-400">
                                                    {emp.full_name.charAt(0)}
                                                </div>
                                            )}
                                        </div>
                                        <div className="font-medium truncate max-w-[150px]">{emp.full_name}</div>
                                    </div>
                                </td>
                                <td className="px-4 py-2 text-sm text-indigo-400 font-medium truncate max-w-[120px]">{emp.position}</td>
                                <td className="px-4 py-2 text-sm opacity-80">{emp.gender}</td>
                                <td className="px-4 py-2 text-sm opacity-80 whitespace-nowrap">{emp.date_of_birth}</td>
                                <td className="px-4 py-2 text-sm opacity-80 whitespace-nowrap">{emp.nrc_number}</td>
                                <td className="px-4 py-2 text-sm opacity-80">{emp.contact_number}</td>
                                <td className="px-4 py-2 text-sm opacity-60 truncate max-w-[200px]" title={emp.address}>{emp.address}</td>
                                <td className="px-4 py-2 text-sm opacity-80 whitespace-nowrap">{emp.start_date}</td>
                                <td className="px-4 py-2 text-sm opacity-80 truncate max-w-[120px]">{emp.next_of_kin_name}</td>
                                <td className="px-4 py-2 text-sm opacity-80 truncate max-w-[100px]">{emp.next_of_kin_relationship}</td>
                                <td className="px-4 py-2 text-sm opacity-80 whitespace-nowrap">{emp.next_of_kin_contact}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

            </div>
            {employees.length === 0 && (
                <div className="p-12 text-center opacity-60">
                    <p>No employees found. Add one to get started.</p>
                </div>
            )}

            {/* Detail / Edit Modal */}
            {selectedEmployee && (
                <EmployeeModal
                    employee={selectedEmployee}
                    onClose={handleCloseModal}
                />
            )}
        </div>
    );
}
