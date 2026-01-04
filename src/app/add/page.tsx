'use client';

import { addEmployee } from '../actions';
import { useRouter } from 'next/navigation';
import { useState, useRef } from 'react';
import Link from 'next/link';
import { optimizeImage } from '@/utils/image-optimizer';

export default function AddEmployeePage() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [statusMessage, setStatusMessage] = useState<string | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setIsSubmitting(true);
        setStatusMessage('Preparing data...');

        // We need to construct a new FormData to include the base64 image if present
        const form = event.currentTarget;
        const formData = new FormData(form);

        if (preview) {
            setStatusMessage('Optimizing photo...');
            const optimized = await optimizeImage(preview);
            formData.set('image_data', optimized);
        } else {
            formData.delete('image_data');
        }

        const result = await addEmployee(formData);

        if (result.success) {
            setStatusMessage('Employee added! Redirecting...');
            router.push('/');
            router.refresh();
        } else {
            alert('Failed to add employee: ' + result.error);
            setIsSubmitting(false);
            setStatusMessage(null);
        }
    }

    function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        } else {
            setPreview(null);
        }
    }

    return (
        <div className="w-full max-w-2xl mx-auto">
            <div className="mb-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-500">Add New Employee</h2>
                <Link href="/" className="text-sm opacity-60 hover:opacity-100 hover:underline">
                    &larr; Back to Directory
                </Link>
            </div>

            <form onSubmit={handleSubmit} className="glass-card space-y-6">
                {/* Photo Upload */}
                <div className="flex flex-col items-center justify-center mb-6">
                    <div
                        className="w-32 h-32 rounded-full border-2 border-dashed border-gray-400 flex items-center justify-center overflow-hidden cursor-pointer hover:border-indigo-500 transition-colors bg-white/10"
                        onClick={() => fileInputRef.current?.click()}
                    >
                        {preview ? (
                            <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                        ) : (
                            <span className="text-gray-400 text-sm p-4 text-center">Click to upload photo</span>
                        )}
                    </div>
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleImageChange}
                        accept="image/*"
                        className="hidden"
                        name="image_file" // Not used by server directly, we send base64 string
                    />
                    <input type="hidden" name="image_data" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Personal Details */}
                    <div className="space-y-4">
                        <h3 className="font-semibold text-lg border-b border-indigo-500/20 pb-2">Personal Details</h3>

                        <div className="space-y-2">
                            <label className="text-xs font-semibold opacity-70 uppercase tracking-wider">Full Name</label>
                            <input name="full_name" required placeholder="John Doe" className="input-field" />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-semibold opacity-70 uppercase tracking-wider">Position</label>
                            <input name="position" required placeholder="Software Engineer" className="input-field" />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-xs font-semibold opacity-70 uppercase tracking-wider">Gender</label>
                                <select name="gender" className="input-field">
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-semibold opacity-70 uppercase tracking-wider">Date of Birth</label>
                                <input name="date_of_birth" type="date" required className="input-field" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-semibold opacity-70 uppercase tracking-wider">NRC Number</label>
                            <input name="nrc_number" required placeholder="123456/78/1" className="input-field" />
                        </div>
                    </div>

                    {/* Contact & Kin */}
                    <div className="space-y-4">
                        <h3 className="font-semibold text-lg border-b border-indigo-500/20 pb-2">Employment & Contact</h3>

                        <div className="space-y-2">
                            <label className="text-xs font-semibold opacity-70 uppercase tracking-wider">Start Date</label>
                            <input name="start_date" type="date" required className="input-field" />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-semibold opacity-70 uppercase tracking-wider">Contact Number</label>
                            <input name="contact_number" required placeholder="+260..." className="input-field" />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-semibold opacity-70 uppercase tracking-wider">Address</label>
                            <textarea name="address" required placeholder="123 Main St..." className="input-field resize-none h-20" />
                        </div>

                        <div className="glass p-4 rounded-lg space-y-3">
                            <h4 className="font-medium text-sm text-indigo-400">Next of Kin Details</h4>
                            <input name="next_of_kin_name" required placeholder="Name" className="input-field text-xs" />
                            <input name="next_of_kin_relationship" required placeholder="Relationship (e.g. Spouse)" className="input-field text-xs" />
                            <input name="next_of_kin_contact" required placeholder="Contact Number" className="input-field text-xs" />
                        </div>
                    </div>
                </div>

                <div className="pt-4 flex justify-end">
                    <button type="submit" disabled={isSubmitting} className="btn-primary w-full md:w-auto min-w-[150px]">
                        {isSubmitting ? statusMessage || 'Saving...' : 'Save Employee'}
                    </button>
                </div>
            </form>
        </div>
    );
}
