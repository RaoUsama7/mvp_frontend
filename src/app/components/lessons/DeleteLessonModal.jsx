"use client";

import useLessons from "../../hooks/useLessons";

export default function DeleteLessonButton({ lessonId, fetchLessons }) {
    const { deleteLesson } = useLessons();

    const handleDelete = async () => {
        if (confirm("Are you sure you want to delete this lesson?")) {
            await deleteLesson(lessonId);
            fetchLessons();
        }
    };

    return (
        <button
            onClick={handleDelete}
            className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
        >
            Delete
        </button>
    );
}
