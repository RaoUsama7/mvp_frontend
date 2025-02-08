"use client";

import { useState, useEffect } from "react";
import useLessons from "../../hooks/useLessons";
import EditLessonModal from "./EditLessonModal";
import DeleteLessonButton from "./DeleteLessonModal";

const ClientSideLesson = ({ lesson, onEdit, onDelete }) => (
    <div key={lesson?.id || 'temp-key'} className="bg-white rounded-lg shadow-md p-4 mb-4 flex justify-between items-center">
        <div>
            <h3 className="text-xl font-semibold">{lesson.title}</h3>
            <p className="text-gray-600">
                Week ID: {lesson.weekId}
            </p>
            <p className="text-gray-600">
                Time Required: {lesson.timeRequired} mins
            </p>
            <p className="text-gray-600">
                Activities: {lesson.activities?.length || 0}
            </p>
        </div>
        <div className="flex gap-2">
            <button
                onClick={() => onEdit(lesson)}
                className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
            >
                Edit
            </button>
            <DeleteLessonButton lessonId={lesson.id} fetchLessons={onDelete} />
        </div>
    </div>
);

export default function Lesson() {
    const { lessons = [], fetchLessons, createLesson, loading, error, success } = useLessons();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedLesson, setSelectedLesson] = useState(null);
    const [title, setTitle] = useState("");
    const [weekId, setWeekId] = useState("");
    const [timeRequired, setTimeRequired] = useState("");
    const [activities, setActivities] = useState([]);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        await createLesson({
            title,
            weekId,
            timeRequired: parseInt(timeRequired),
            activities
        });
        setIsModalOpen(false);
        setTitle("");
        setWeekId("");
        setTimeRequired("");
        setActivities([]);
    };

    if (!isMounted) {
        return <div className="flex flex-col items-center bg-gray-100 p-6">Loading...</div>;
    }

    return (
        <div className="flex flex-col items-center bg-gray-100 p-6">
            <div className="w-full max-w-4xl flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Lessons</h2>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
                >
                    Create Lesson
                </button>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-[600px] max-h-[80vh] overflow-y-auto">
                        <h2 className="text-xl font-bold mb-4">Create a New Lesson</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Form fields similar to CreateLesson component */}
                            <div>
                                <label className="block font-medium mb-1">Title</label>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="w-full border rounded-lg p-2"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block font-medium mb-1">Week ID</label>
                                <input
                                    type="text"
                                    value={weekId}
                                    onChange={(e) => setWeekId(e.target.value)}
                                    className="w-full border rounded-lg p-2"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block font-medium mb-1">Time Required (minutes)</label>
                                <input
                                    type="number"
                                    value={timeRequired}
                                    onChange={(e) => setTimeRequired(e.target.value)}
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
                                    className="bg-blue-500 text-white px-3 py-1 rounded"
                                    disabled={loading}
                                >
                                    {loading ? "Creating..." : "Save"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}


            {isEditModalOpen && selectedLesson && (
                <EditLessonModal
                    lesson={selectedLesson}
                    setIsModalOpen={setIsEditModalOpen}
                    fetchLessons={fetchLessons}
                />
            )}
        </div>
    );
}
