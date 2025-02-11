"use client";

import { useState } from "react";
import useActivities from "../../hooks/useActivities";

export default function EditActivityModal({ activity, setIsModalOpen, fetchActivities }) {
    const { updateActivity } = useActivities();
    const [formData, setFormData] = useState({
        name: activity.name || "",
        meaning: activity.meaning || "",
        objective: activity.objective || "",
        description: activity.description || "",
        instructions: activity.instructions || "",
        timeRequired: activity.timeRequired || "",
        materials: activity.materials || ""
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
            const requestData = {
                name: formData.name.trim(),
                meaning: formData.meaning.trim(),
                objective: formData.objective.trim(),
                description: formData.description.trim(),
                instructions: formData.instructions.trim(),
                timeRequired: parseInt(formData.timeRequired),
                materials: formData.materials.trim()
            };
            
            const result = await updateActivity(activity.id, requestData);
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
            <div className="bg-white p-6 rounded-lg shadow-lg w-[600px] max-h-[90vh] overflow-y-auto">
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
                        <label className="block font-medium mb-1">Meaning</label>
                        <input
                            type="text"
                            name="meaning"
                            value={formData.meaning}
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
                        <label className="block font-medium mb-1">Description</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            className="w-full border rounded-lg p-2"
                            required
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
                            min="1"
                        />
                    </div>

                    <div>
                        <label className="block font-medium mb-1">Materials</label>
                        <textarea
                            name="materials"
                            value={formData.materials}
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