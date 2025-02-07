"use client";

import { useState } from "react";
import useLessons from "@/app/hooks/useLessons";

export default function LessonsList() {
    const { lessons, lesson, loading, error, fetchLessons, getLessonById, updateLesson, deleteLesson } = useLessons();
    const lessonList = lessons || []; // Use lessons directly since API returns an array
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedLesson, setSelectedLesson] = useState(null);
    const [updatedTitle, setUpdatedTitle] = useState("");
    const [updatedTime, setUpdatedTime] = useState("");
    const [lessonId, setLessonId] = useState("");

    const openModal = (lesson) => {
        setSelectedLesson(lesson);
        setUpdatedTitle(lesson.title);
        setUpdatedTime(lesson.timeRequired);
        setIsModalOpen(true);
    };

    const handleUpdate = async () => {
        if (selectedLesson) {
            await updateLesson(selectedLesson.id, { title: updatedTitle, timeRequired: updatedTime });
            setIsModalOpen(false);
        }
    };

    const handleDelete = async (lessonId) => {
        await deleteLesson(lessonId);
        fetchLessons();
    };

    const handleFetchLessonById = async () => {
        if (lessonId) {
            await getLessonById(lessonId);
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

            <div className="mb-6 flex gap-2">
                <input
                    type="text"
                    placeholder="Enter Lesson ID"
                    value={lessonId}
                    onChange={(e) => setLessonId(e.target.value)}
                    className="border p-2 rounded-lg"
                />
                <button
                    onClick={handleFetchLessonById}
                    className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
                >
                    Get Lesson
                </button>
            </div>

            {lesson && (
                <div className="bg-white p-4 rounded-lg shadow-lg w-full max-w-md mb-6">
                    <h3 className="text-xl font-bold mb-2">Lesson Details</h3>
                    <p><strong>Title:</strong> {lesson.title}</p>
                    <p><strong>Week ID:</strong> {lesson.weekId}</p>
                    <p><strong>Time Required:</strong> {lesson.timeRequired} mins</p>
                </div>
            )}

            <ul className="bg-white p-4 rounded-lg shadow-lg w-full max-w-md">
                {lessonList.length > 0 ? (
                    lessonList.map((lesson) => (
                        <li key={lesson.id} className="p-2 border-b last:border-none flex justify-between items-center">
                            <div>
                                <strong>Title:</strong> {lesson.title} <br />
                                <strong>Week ID:</strong> {lesson.weekId} <br />
                                <strong>Time Required:</strong> {lesson.timeRequired} mins <br />
                                <strong>Activities:</strong> {lesson.activities?.length > 0 ? lesson.activities.map((a) => a.id).join(", ") : "None"}
                            </div>
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
                        </li>
                    ))
                ) : (
                    <p className="text-center">No lessons found.</p>
                )}
            </ul>

            {isModalOpen && (
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
                                    className="w-full border rounded-lg p-2 focus:ring focus:ring-blue-300"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block font-medium mb-1">Time Required (minutes)</label>
                                <input
                                    type="number"
                                    value={updatedTime}
                                    onChange={(e) => setUpdatedTime(e.target.value)}
                                    className="w-full border rounded-lg p-2 focus:ring focus:ring-blue-300"
                                    required
                                />
                            </div>

                            <div className="flex justify-end gap-2">
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="bg-gray-400 text-white px-3 py-1 rounded hover:bg-gray-500"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleUpdate}
                                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                                >
                                    Save
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
