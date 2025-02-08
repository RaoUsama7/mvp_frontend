"use client";

import { useState, useEffect } from "react";
import useWeeks from "../../hooks/useWeeks";
import EditWeekModal from "./EditWeekModal";
import DeleteWeekButton from "./DeleteWeekModal";

// Add this new component
const ClientSideWeek = ({ week, formattedDates, onEdit, onDelete }) => (
    <div key={week?._id || 'temp-key'} className="bg-white rounded-lg shadow-md p-4 mb-4 flex justify-between items-center">
        <div>
            <h3 className="text-xl font-semibold">{week.theme}</h3>
            <p className="text-gray-600">
                Start Date: {formattedDates[week._id] || 'Loading...'}
            </p>
            <p className="text-gray-600">
                Lessons: {week.lessons?.length || 0}
            </p>
        </div>
        <div className="flex gap-2">
            <button
                onClick={() => onEdit(week)}
                className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
            >
                Edit
            </button>
            <DeleteWeekButton weekId={week._id} fetchWeeks={onDelete} />
        </div>
    </div>
);

export default function Week() {
    const { weeks = [], fetchWeeks, createWeek, loading, error, success } = useWeeks();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedWeek, setSelectedWeek] = useState(null);
    const [theme, setTheme] = useState("");
    const [dateStart, setDateStart] = useState("");
    const [lessons, setLessons] = useState([]);
    const [formattedDates, setFormattedDates] = useState({});
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        if (!weeks?.length || !isMounted) return;
        
        const dates = {};
        weeks.forEach(week => {
            if (week?._id && week?.date_start) {
                try {
                    dates[week._id] = new Date(week.date_start).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    });
                } catch (e) {
                    dates[week._id] = 'Invalid date';
                }
            }
        });
        setFormattedDates(dates);
    }, [weeks, isMounted]);

    const addLesson = () => {
        setLessons([...lessons, { title: "", timeRequired: "", activities: [] }]);
    };

    const updateLesson = (index, key, value) => {
        const newLessons = [...lessons];
        newLessons[index][key] = value;
        setLessons(newLessons);
    };

    const addActivity = (lessonIndex) => {
        const newLessons = [...lessons];
        newLessons[lessonIndex].activities.push({
            name: "",
            objective: "",
            keywords: "",
            instructions: "",
            timeRequired: "",
            materials: [{ title: "", link: "" }]
        });
        setLessons(newLessons);
    };

    const updateActivity = (lessonIndex, activityIndex, key, value) => {
        const newLessons = [...lessons];
        newLessons[lessonIndex].activities[activityIndex][key] = value;
        setLessons(newLessons);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await createWeek({ lessons, theme, date_start: dateStart });
        setIsModalOpen(false);
        setTheme("");
        setDateStart("");
        setLessons([]);
    };

    if (!isMounted) {
        return <div className="flex flex-col items-center bg-gray-100 p-6">Loading...</div>;
    }

    return (
        <div className="flex flex-col items-center bg-gray-100 p-6">
            {/* Create Week Button */}
            <div className="w-full max-w-4xl flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Weeks</h2>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
                >
                    Create Week
                </button>
            </div>

            
            {/* Create Week Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-[600px] max-h-[80vh] overflow-y-auto">
                        <h2 className="text-xl font-bold mb-4">Create a New Week</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block font-medium mb-1">Theme</label>
                                <input
                                    type="text"
                                    value={theme}
                                    onChange={(e) => setTheme(e.target.value)}
                                    className="w-full border rounded-lg p-2 focus:ring focus:ring-blue-300"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block font-medium mb-1">Start Date</label>
                                <input
                                    type="datetime-local"
                                    value={dateStart}
                                    onChange={(e) => setDateStart(e.target.value)}
                                    className="w-full border rounded-lg p-2 focus:ring focus:ring-blue-300"
                                    required
                                />
                            </div>

                            {/* <h3 className="text-lg font-semibold">Lessons</h3>
                            {lessons.map((lesson, lessonIndex) => (
                                <div key={lessonIndex} className="border p-4 rounded-lg space-y-3">
                                    <input
                                        type="text"
                                        placeholder="Lesson Name"
                                        value={lesson.title}
                                        onChange={(e) => updateLesson(lessonIndex, "title", e.target.value)}
                                        className="w-full border rounded-lg p-2"
                                        required
                                    />
                                    <input
                                        type="number"
                                        placeholder="Time Required (mins)"
                                        value={lesson.timeRequired}
                                        onChange={(e) => updateLesson(lessonIndex, "timeRequired", e.target.value)}
                                        className="w-full border rounded-lg p-2"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => addActivity(lessonIndex)}
                                        className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                                    >
                                        Add Activity
                                    </button>

                                    {lesson.activities.map((activity, activityIndex) => (
                                        <div key={activityIndex} className="border p-3 mt-3 rounded-lg space-y-2">
                                            <input
                                                type="text"
                                                placeholder="Activity Name"
                                                value={activity.name}
                                                onChange={(e) => updateActivity(lessonIndex, activityIndex, "name", e.target.value)}
                                                className="w-full border rounded-lg p-2"
                                            />
                                            <textarea
                                                placeholder="Objective"
                                                value={activity.objective}
                                                onChange={(e) => updateActivity(lessonIndex, activityIndex, "objective", e.target.value)}
                                                className="w-full border rounded-lg p-2"
                                            />
                                            <input
                                                type="text"
                                                placeholder="Keywords (comma-separated)"
                                                value={activity.keywords}
                                                onChange={(e) => updateActivity(lessonIndex, activityIndex, "keywords", e.target.value)}
                                                className="w-full border rounded-lg p-2"
                                            />
                                            <textarea
                                                placeholder="Instructions"
                                                value={activity.instructions}
                                                onChange={(e) => updateActivity(lessonIndex, activityIndex, "instructions", e.target.value)}
                                                className="w-full border rounded-lg p-2"
                                            />
                                            <input
                                                type="number"
                                                placeholder="Time Required (mins)"
                                                value={activity.timeRequired}
                                                onChange={(e) => updateActivity(lessonIndex, activityIndex, "timeRequired", e.target.value)}
                                                className="w-full border rounded-lg p-2"
                                            />
                                        </div>
                                    ))}
                                </div>
                            ))} */}
{/* 
                            <button
                                type="button"
                                onClick={addLesson}
                                className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                            >
                                Add Lesson
                            </button> */}

                            <div className="flex justify-end gap-2 mt-4">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="bg-gray-400 text-white px-3 py-1 rounded hover:bg-gray-500"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                                    disabled={loading}
                                >
                                    {loading ? "Creating..." : "Save"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit Week Modal */}
            {isEditModalOpen && selectedWeek && (
                <EditWeekModal
                    week={selectedWeek}
                    setIsModalOpen={setIsEditModalOpen}
                    fetchWeeks={fetchWeeks}
                />
            )}
        </div>
    );
}
