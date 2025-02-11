"use client";

import { useState } from "react";
import useWeeks from "../../hooks/useWeeks";

export default function EditWeekModal({ week, setIsModalOpen, fetchWeeks }) {
    const { updateWeek } = useWeeks();
    const [formData, setFormData] = useState({
        module_number: week.module_number || "",
        quarter: week.quarter || "",
        theme: week.theme || ""
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        try {
            const dataToSubmit = {
                ...formData,
                module_number: parseInt(formData.module_number),
                quarter: parseInt(formData.quarter)
            };

            await updateWeek(week.id, dataToSubmit);
            await fetchWeeks();
            setIsModalOpen(false);
        } catch (error) {
            setError("Failed to update week. Please try again.");
            console.error("Failed to update week:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96 max-h-[90vh] overflow-y-auto">
                <h2 className="text-xl font-bold mb-4">Edit Week</h2>
                {error && (
                    <div className="mb-4 p-2 bg-red-100 text-red-600 rounded">
                        {error}
                    </div>
                )}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block font-medium mb-1">Quarter</label>
                        <input
                            type="number"
                            name="quarter"
                            value={formData.quarter}
                            onChange={handleChange}
                            className="w-full border rounded-lg p-2"
                            required
                            min="1"
                            max="4"
                        />
                    </div>
                    <div>
                        <label className="block font-medium mb-1">Module Number</label>
                        <input
                            type="number"
                            name="module_number"
                            value={formData.module_number}
                            onChange={handleChange}
                            className="w-full border rounded-lg p-2"
                            required
                            min="1"
                        />
                    </div>
                    <div>
                        <label className="block font-medium mb-1">Theme</label>
                        <input
                            type="text"
                            name="theme"
                            value={formData.theme}
                            onChange={handleChange}
                            className="w-full border rounded-lg p-2"
                            required
                        />
                    </div>

                    <div className="flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={() => setIsModalOpen(false)}
                            className="bg-gray-400 text-white px-3 py-1 rounded hover:bg-gray-500"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                        >
                            {isSubmitting ? "Saving..." : "Save"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
