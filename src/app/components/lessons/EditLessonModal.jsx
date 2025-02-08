"use client";

import { useState } from "react";
import useLessons from "../../hooks/useLessons";

export default function EditLessonModal({ lesson, setIsModalOpen, fetchLessons }) {
    const { updateLesson } = useLessons();
    const [updatedTitle, setUpdatedTitle] = useState(lesson.title);
    const [updatedTimeRequired, setUpdatedTimeRequired] = useState(lesson.timeRequired);
    const [updatedWeekId, setUpdatedWeekId] = useState(lesson.weekId);

    const handleUpdate = async () => {
        await updateLesson(lesson.id, {
            title: updatedTitle,
            timeRequired: parseInt(updatedTimeRequired),
            weekId: updatedWeekId
        });
        setIsModalOpen(false);
        fetchLessons();
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                <h2 className="text-xl font-bold mb-4">Edit Lesson</h2>
                <div className="space-y-4">
                    <div>
                        <label className="block font-medium mb-1">Title</label>
                        <input
                            type="text"
                            value={updatedTitle}
                            onChange={(e) => setUpdatedTitle(e.target.value)}
                            className="w-full border rounded-lg p-2"
                            required
                        />
                    </div>
                    <div>
                        <label className="block font-medium mb-1">Time Required (minutes)</label>
                        <input
                            type="number"
                            value={updatedTimeRequired}
                            onChange={(e) => setUpdatedTimeRequired(e.target.value)}
                            className="w-full border rounded-lg p-2"
                            required
                        />
                    </div>
                    <div>
                        <label className="block font-medium mb-1">Week ID</label>
                        <input
                            type="text"
                            value={updatedWeekId}
                            onChange={(e) => setUpdatedWeekId(e.target.value)}
                            className="w-full border rounded-lg p-2"
                            required
                        />
                    </div>
                    <div className="flex justify-end gap-2">
                        <button
                            onClick={() => setIsModalOpen(false)}
                            className="bg-gray-400 text-white px-3 py-1 rounded"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleUpdate}
                            className="bg-blue-500 text-white px-3 py-1 rounded"
                        >
                            Save
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
