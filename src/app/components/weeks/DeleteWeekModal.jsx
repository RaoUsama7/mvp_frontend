"use client";

import useWeeks from "@/app/hooks/useWeeks";

export default function DeleteWeekButton({ weekId, fetchWeeks }) {
    const { deleteWeek } = useWeeks();

    const handleDelete = async () => {
        if (confirm("Are you sure you want to delete this week?")) {
            await deleteWeek(weekId);
            fetchWeeks();
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
