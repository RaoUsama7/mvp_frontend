"use client";

import { useState } from "react";
import useLessons from "../../hooks/useLessons";

export default function EditLessonModal({ lesson, setIsModalOpen, fetchLessons }) {
    const { updateLesson } = useLessons();
    const [formData, setFormData] = useState({
        title: lesson.title,
        time_required: lesson.timeRequired,
        core: lesson.core,
        activities: lesson.activities || []
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        try {
            // Match the exact format that works in Postman
            const requestData = {
                title: formData.title,
                time_required: parseInt(formData.time_required),
                core: formData.core
            };
            
            const result = await updateLesson(lesson._id || lesson.id, requestData);
            if (result) {
                await fetchLessons();
                setIsModalOpen(false);
            }
        } catch (error) {
            setError("Failed to update lesson. Please try again.");
            console.error("Failed to update lesson:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                <h2 className="text-xl font-bold mb-4">Edit Lesson</h2>
                {error && (
                    <div className="mb-4 p-2 bg-red-100 text-red-600 rounded">
                        {error}
                    </div>
                )}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block font-medium mb-1">Title</label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            className="w-full border rounded-lg p-2"
                            required
                        />
                    </div>
                    <div>
                        <label className="block font-medium mb-1">Time Required (minutes)</label>
                        <input
                            type="number"
                            name="time_required"
                            value={formData.time_required}
                            onChange={handleChange}
                            className="w-full border rounded-lg p-2"
                            required
                        />
                    </div>
                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            name="core"
                            checked={formData.core}
                            onChange={handleChange}
                            className="mr-2"
                        />
                        <label>Core Lesson</label>
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
