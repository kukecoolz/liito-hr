'use client';

import { Employee } from '@/types';
import { useState, useRef, useEffect } from 'react';
import { updateEmployee } from '@/app/actions';
import { useRouter } from 'next/navigation';
import { optimizeImage } from '@/utils/image-optimizer';

interface EmployeeModalProps {
    employee: Employee;
    onClose: () => void;
}

export function EmployeeModal({ employee, onClose }: EmployeeModalProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [preview, setPreview] = useState<string | null>(employee.image_data || null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleEditSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!employee.id) return;

        setIsSubmitting(true);
        const formData = new FormData(e.currentTarget);

        if (preview) {
            if (preview !== employee.image_data) {
                const optimized = await optimizeImage(preview);
                formData.set('image_data', optimized);
            } else {
                formData.set('image_data', employee.image_data);
            }
        }

        const result = await updateEmployee(employee.id, formData);

        if (result.success) {
            router.refresh();
            setIsEditing(false);
            // We don't close immediately so user sees the "Save Changes" succeeded 
            // the router.refresh will update the parent and eventually this modal 
            // if we really want to close it:
            setTimeout(onClose, 500);
        } else {
            alert('Failed to update: ' + result.error);
        }
        setIsSubmitting(false);
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
            onClick={onClose}
        >
            <div
                className="glass-card w-full max-w-2xl max-h-[90vh] overflow-y-auto relative animate-scale-up"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    type="button"
                    onClick={onClose}
                    className="absolute top-4 right-4 text-2xl opacity-50 hover:opacity-100 transition-opacity"
                >
                    &times;
                </button>

                <div className="p-2">
                    <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-500 mb-6">
                        {isEditing ? 'Edit Employee Details' : 'Employee Details'}
                    </h2>

                    <div className="space-y-6">
                        <form id="employee-edit-form" onSubmit={handleEditSubmit} className="space-y-6">
                            <div className="flex flex-col md:flex-row gap-8">
                                {/* Avatar Section */}
                                <div className="flex flex-col items-center gap-4">
                                    <div
                                        className={`w-32 h-32 rounded-full border-2 border-indigo-500/30 overflow-hidden bg-gray-100 dark:bg-gray-800 flex-shrink-0 ${isEditing ? 'cursor-pointer hover:border-indigo-500' : ''}`}
                                        onClick={() => isEditing && fileInputRef.current?.click()}
                                    >
                                        {preview ? (
                                            <img src={preview} alt="Avatar" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-3xl font-bold text-gray-400">
                                                {employee.full_name.charAt(0)}
                                            </div>
                                        )}
                                    </div>
                                    {isEditing && (
                                        <>
                                            <button
                                                type="button"
                                                onClick={() => fileInputRef.current?.click()}
                                                className="text-xs text-indigo-400 hover:underline"
                                            >
                                                Change Photo
                                            </button>
                                            <input
                                                type="file"
                                                ref={fileInputRef}
                                                onChange={handleImageChange}
                                                className="hidden"
                                                accept="image/*"
                                            />
                                        </>
                                    )}
                                </div>

                                {/* Info Section */}
                                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold uppercase tracking-widest opacity-50">Full Name</label>
                                        {isEditing ? (
                                            <input name="full_name" defaultValue={employee.full_name} required className="input-field py-1" />
                                        ) : (
                                            <p className="font-semibold">{employee.full_name}</p>
                                        )}
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold uppercase tracking-widest opacity-50">Position</label>
                                        {isEditing ? (
                                            <input name="position" defaultValue={employee.position} required className="input-field py-1" />
                                        ) : (
                                            <p className="text-indigo-400 font-medium">{employee.position}</p>
                                        )}
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold uppercase tracking-widest opacity-50">Gender</label>
                                        {isEditing ? (
                                            <select name="gender" defaultValue={employee.gender} className="input-field py-1">
                                                <option value="Male">Male</option>
                                                <option value="Female">Female</option>
                                                <option value="Other">Other</option>
                                            </select>
                                        ) : (
                                            <p>{employee.gender}</p>
                                        )}
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold uppercase tracking-widest opacity-50">Date of Birth</label>
                                        {isEditing ? (
                                            <input name="date_of_birth" type="date" defaultValue={employee.date_of_birth} required className="input-field py-1" />
                                        ) : (
                                            <p>{employee.date_of_birth}</p>
                                        )}
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold uppercase tracking-widest opacity-50">NRC Number</label>
                                        {isEditing ? (
                                            <input name="nrc_number" defaultValue={employee.nrc_number} required className="input-field py-1" />
                                        ) : (
                                            <p>{employee.nrc_number}</p>
                                        )}
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold uppercase tracking-widest opacity-50">Contact Number</label>
                                        {isEditing ? (
                                            <input name="contact_number" defaultValue={employee.contact_number} required className="input-field py-1" />
                                        ) : (
                                            <p>{employee.contact_number}</p>
                                        )}
                                    </div>
                                    <div className="col-span-full space-y-1">
                                        <label className="text-[10px] font-bold uppercase tracking-widest opacity-50">Address</label>
                                        {isEditing ? (
                                            <textarea name="address" defaultValue={employee.address} required className="input-field py-1 h-16 resize-none" />
                                        ) : (
                                            <p className="opacity-80">{employee.address}</p>
                                        )}
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold uppercase tracking-widest opacity-50">Start Date</label>
                                        {isEditing ? (
                                            <input name="start_date" type="date" defaultValue={employee.start_date} required className="input-field py-1" />
                                        ) : (
                                            <p>{employee.start_date}</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Next of Kin Section */}
                            <div className="p-4 rounded-lg bg-indigo-500/5 border border-indigo-500/10 space-y-4">
                                <h3 className="text-xs font-bold uppercase tracking-widest text-indigo-400">Next of Kin Details</h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-[9px] font-bold uppercase opacity-50">Name</label>
                                        {isEditing ? (
                                            <input name="next_of_kin_name" defaultValue={employee.next_of_kin_name} required className="input-field py-1 text-sm" />
                                        ) : (
                                            <p className="text-sm">{employee.next_of_kin_name}</p>
                                        )}
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[9px] font-bold uppercase opacity-50">Relationship</label>
                                        {isEditing ? (
                                            <input name="next_of_kin_relationship" defaultValue={employee.next_of_kin_relationship} required className="input-field py-1 text-sm" />
                                        ) : (
                                            <p className="text-sm">{employee.next_of_kin_relationship}</p>
                                        )}
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[9px] font-bold uppercase opacity-50">Contact</label>
                                        {isEditing ? (
                                            <input name="next_of_kin_contact" defaultValue={employee.next_of_kin_contact} required className="input-field py-1 text-sm" />
                                        ) : (
                                            <p className="text-sm">{employee.next_of_kin_contact}</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </form>

                        <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                            {isEditing ? (
                                <>
                                    <button
                                        type="button"
                                        onClick={() => setIsEditing(false)}
                                        className="px-4 py-2 text-sm opacity-60 hover:opacity-100 transition-opacity"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        form="employee-edit-form"
                                        disabled={isSubmitting}
                                        className="btn-primary"
                                    >
                                        {isSubmitting ? 'Saving Changes...' : 'Save Changes'}
                                    </button>
                                </>
                            ) : (
                                <>
                                    <button
                                        type="button"
                                        onClick={onClose}
                                        className="px-4 py-2 text-sm opacity-60 hover:opacity-100 transition-opacity"
                                    >
                                        Close
                                    </button>
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            setIsEditing(true);
                                        }}
                                        className="btn-primary"
                                    >
                                        Edit Employee
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
