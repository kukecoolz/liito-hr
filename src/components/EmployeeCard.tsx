import { Employee } from '@/types';
import Image from 'next/image';

export function EmployeeCard({ employee }: { employee: Employee }) {
    return (
        <div className="glass-card flex flex-col gap-4 group hover:-translate-y-1 transition-transform duration-300">
            <div className="flex items-start gap-4">
                <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-indigo-500/30 flex-shrink-0 bg-gray-100 dark:bg-gray-800">
                    {employee.image_data ? (
                        <img
                            src={employee.image_data}
                            alt={employee.full_name}
                            className="object-cover w-full h-full"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-xl font-bold text-gray-400">
                            {employee.full_name.charAt(0)}
                        </div>
                    )}
                </div>
                <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-lg truncate" title={employee.full_name}>{employee.full_name}</h3>
                    <p className="text-sm text-indigo-500 font-medium truncate">{employee.position}</p>
                    <p className="text-xs opacity-60 mt-1">Started: {employee.start_date}</p>
                </div>
            </div>

            <div className="space-y-2 mt-2 pt-4 border-t border-white/10 text-sm">
                <div className="grid grid-cols-[auto_1fr] gap-2">
                    <span className="opacity-60">Tel:</span>
                    <span className="truncate select-all">{employee.contact_number}</span>

                    <span className="opacity-60">NRC:</span>
                    <span className="truncate">{employee.nrc_number}</span>

                    <span className="opacity-60">Kin:</span>
                    <span className="truncate" title={`${employee.next_of_kin_name} (${employee.next_of_kin_relationship})`}>
                        {employee.next_of_kin_name}
                    </span>
                    <span className="opacity-60"></span>
                    <span className="text-xs opacity-50 truncate">({employee.next_of_kin_relationship}) - {employee.next_of_kin_contact}</span>
                </div>
            </div>
        </div>
    );
}
