"use client";

import { useState } from "react";
import useLessons from "../../hooks/useLessons";
import EditLessonModal from "./EditLessonModal";

export default function LessonsList() {
    const { lessons, loading, error, fetchLessons, deleteLesson } = useLessons();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedLesson, setSelectedLesson] = useState(null);

    const openModal = (lesson) => {
        setSelectedLesson(lesson);
        setIsModalOpen(true);
    };

    const handleDelete = async (lessonId) => {
        if (confirm("Are you sure you want to delete this lesson?")) {
            await deleteLesson(lessonId);
            fetchLessons();
        }
    };

    return (
        <div className="flex flex-col items-center min-h-screen bg-gray-100 p-6">
            <h2 className="text-2xl font-bold mb-4">Lessons List</h2>

            <button
                onClick={fetchLessons}
                className="mb-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
                disabled={loading}
            >
                {loading ? "Loading..." : "Refresh Lessons"}
            </button>

            {error && <p className="text-red-500">{error}</p>}

            <div className="w-full max-w-6xl bg-white p-4 rounded-lg shadow-lg overflow-x-auto">
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="border p-2 text-left">Title</th>
                            <th className="border p-2 text-left">Module Number</th>
                            <th className="border p-2 text-left">Week Number</th>
                            <th className="border p-2 text-left">Week Theme</th>
                            <th className="border p-2 text-left">Core</th>
                            <th className="border p-2 text-left">Activities</th>
                            <th className="border p-2 text-left">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Array.isArray(lessons) && lessons.length > 0 ? (
                            lessons.map((lesson) => (
                                <tr key={lesson.id} className="border-t">
                                    <td className="border p-2">{lesson.title}</td>
                                    <td className="border p-2">{lesson.week?.module_number}</td>
                                    <td className="border p-2">{lesson.week?.week_number}</td>
                                    <td className="border p-2">{lesson.week?.theme}</td>
                                    <td className="border p-2">
                                        <span className={`px-2 py-1 rounded ${lesson.core ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                            {lesson.core ? 'Yes' : 'No'}
                                        </span>
                                    </td>
                                    <td className="border p-2">
                                        {lesson.activities?.length || 0} activities
                                    </td>
                                    <td className="border p-2">
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => openModal(lesson)}
                                                className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(lesson.id)}
                                                className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7" className="text-center p-4">No lessons found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Edit Modal */}
            {isModalOpen && selectedLesson && (
                <EditLessonModal 
                    lesson={selectedLesson}
                    setIsModalOpen={setIsModalOpen}
                    fetchLessons={fetchLessons}
                />
            )}
        </div>
    );
}
