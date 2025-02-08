"use client";

import { useState, useEffect } from "react";
import useLessons from "../../hooks/useLessons";
import useWeeks from "../../hooks/useWeeks";

export default function CreateLesson() {
    const { createLesson, loading, error, success } = useLessons();
    const { weeks, fetchWeeks } = useWeeks();
    const [title, setTitle] = useState("");
    const [week, setWeek] = useState("");
    const [activities, setActivities] = useState([]);
    const [timeRequired, setTimeRequired] = useState("");
    const [core, setCore] = useState(false);

    useEffect(() => {
        fetchWeeks();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!title.trim() || !week || !timeRequired.trim()) {
            alert("All fields are required.");
            return;
        }

        const lessonData = {
            title: title.trim(),
            week: week,
            activities: activities.filter(a => a.trim() !== ""),
            time_required: Number(timeRequired) || 0,
            core: core
        };

        console.log("Submitting Lesson Data:", lessonData);

        try {
            const response = await createLesson(lessonData);

            console.log("API Response:", response);

            if (response?.error) {
                console.error("Error from API:", response.error);
                return;
            }

            // Reset form
            setTitle("");
            setWeek("");
            setActivities([]);
            setTimeRequired("");
            setCore(false);
        } catch (err) {
            console.error("Error creating lesson:", err);
        }
    };

    return (
        <div className="flex flex-col items-center min-h-screen bg-gray-100 p-6">
            <h2 className="text-2xl font-bold mb-4">Create a New Lesson</h2>

            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg w-96 space-y-4">
                <div>
                    <label className="block font-medium mb-1">Lesson Title</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full border rounded-lg p-2 focus:ring focus:ring-blue-300"
                        required
                    />
                </div>

                <div>
                    <label className="block font-medium mb-1">Week</label>
                    <select
                        value={week}
                        onChange={(e) => setWeek(e.target.value)}
                        className="w-full border rounded-lg p-2 focus:ring focus:ring-blue-300"
                        required
                    >
                        <option value="">Select a week...</option>
                        {weeks.map((weekItem) => (
                            <option key={weekItem.id} value={weekItem.id}>
                                Week {weekItem.number}: {weekItem.theme}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block font-medium mb-1">Activities (comma-separated)</label>
                    <input
                        type="text"
                        value={activities.join(", ")}
                        onChange={(e) =>
                            setActivities(e.target.value.split(",").map((a) => a.trim()))
                        }
                        className="w-full border rounded-lg p-2 focus:ring focus:ring-blue-300"
                        placeholder="e.g. Reading, Writing"
                    />
                </div>

                <div>
                    <label className="block font-medium mb-1">Time Required (minutes)</label>
                    <input
                        type="number"
                        value={timeRequired}
                        onChange={(e) => setTimeRequired(e.target.value)}
                        className="w-full border rounded-lg p-2 focus:ring focus:ring-blue-300"
                        required
                    />
                </div>

                <div className="flex items-center space-x-2">
                    <input
                        type="checkbox"
                        id="core"
                        checked={core}
                        onChange={(e) => setCore(e.target.checked)}
                        className="rounded border-gray-300 text-blue-500 focus:ring-blue-500"
                    />
                    <label htmlFor="core" className="font-medium">Core Lesson</label>
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition disabled:opacity-50"
                    disabled={loading}
                >
                    {loading ? "Creating..." : "Create Lesson"}
                </button>
            </form>

            {error && <p className="text-red-500 mt-2 text-center">{error}</p>}
            {success && <p className="text-green-500 mt-2 text-center">{success}</p>}
        </div>
    );
}