"use client";

import { useState } from "react";
import useActivities from "../../hooks/useActivities";

export default function EditActivityModal({ activity, setIsModalOpen, fetchActivities }) {
    const { updateActivity } = useActivities();
    const [formData, setFormData] = useState({
        name: activity.name,
        objective: activity.objective || "",
        keywords: activity.keywords || [],
        instructions: activity.instructions || "",
        timeRequired: activity.timeRequired,
        materials: activity.materials || [],
        lessonId: activity.lesson?.id || ""
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

    const handleKeywordsChange = (e) => {
        const keywords = e.target.value.split(',').map(k => k.trim());
        setFormData(prev => ({
            ...prev,
            keywords
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        try {
            const result = await updateActivity(activity.id, formData);
            if (result) {
                await fetchActivities();
                setIsModalOpen(false);
            }
        } catch (error) {
            setError("Failed to update activity. Please try again.");
            console.error("Failed to update activity:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                <h2 className="text-xl font-bold mb-4">Edit Activity</h2>
                {error && (
                    <div className="mb-4 p-2 bg-red-100 text-red-600 rounded">
                        {error}
                    </div>
                )}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block font-medium mb-1">Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full border rounded-lg p-2"
                            required
                        />
                    </div>
                    <div>
                        <label className="block font-medium mb-1">Objective</label>
                        <textarea
                            name="objective"
                            value={formData.objective}
                            onChange={handleChange}
                            className="w-full border rounded-lg p-2"
                            required
                        />
                    </div>
                    <div>
                        <label className="block font-medium mb-1">Keywords (comma-separated)</label>
                        <input
                            type="text"
                            value={formData.keywords.join(', ')}
                            onChange={handleKeywordsChange}
                            className="w-full border rounded-lg p-2"
                        />
                    </div>
                    <div>
                        <label className="block font-medium mb-1">Instructions</label>
                        <textarea
                            name="instructions"
                            value={formData.instructions}
                            onChange={handleChange}
                            className="w-full border rounded-lg p-2"
                            required
                        />
                    </div>
                    <div>
                        <label className="block font-medium mb-1">Time Required (minutes)</label>
                        <input
                            type="number"
                            name="timeRequired"
                            value={formData.timeRequired}
                            onChange={handleChange}
                            className="w-full border rounded-lg p-2"
                            required
                        />
                    </div>
                    <div className="flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={() => setIsModalOpen(false)}
                            className="bg-gray-400 text-white px-3 py-1 rounded"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="bg-blue-500 text-white px-3 py-1 rounded disabled:bg-blue-300"
                        >
                            {isSubmitting ? "Saving..." : "Save"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
} 