"use client";

import { useState, useEffect } from "react";
import useActivities from "../../hooks/useActivities";
import useWeeks from "../../hooks/useWeeks";
import useLessons from "../../hooks/useLessons";

const GetActivities = () => {
    const { activities, loading: loadingActivities, error: errorActivities, deleteActivity, fetchActivities } = useActivities();
    const { weeks, loading: loadingWeeks, error: errorWeeks } = useWeeks();
    const { lessons, loading: loadingLessons, error: errorLessons } = useLessons();

    const handleDelete = async (activityId) => {
        if (confirm("Are you sure you want to delete this activity?")) {
            await deleteActivity(activityId);
            await fetchActivities(); // Refresh the list after deletion
        }
    };

    // Create a mapping for weeks and lessons for easy access
    const weekMap = weeks.reduce((acc, week) => {
        acc[week.id] = week;
        return acc;
    }, {});

    const lessonMap = lessons.reduce((acc, lesson) => {
        acc[lesson.id] = lesson;
        return acc;
    }, {});

    console.log("Activities:", activities);
    console.log("Lesson Map:", lessonMap);

    return (
        <div className="flex flex-col items-center min-h-screen bg-gray-100 p-6">
            <h2 className="text-2xl font-bold mb-4">Activities List</h2>
            <button
                onClick={fetchActivities}
                className="mb-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
                disabled={loadingActivities}
            >
                {loadingActivities ? "Loading..." : "Refresh Activities"}
            </button>

            {(errorActivities || errorWeeks || errorLessons) && (
                <p className="text-red-500">{errorActivities || errorWeeks || errorLessons}</p>
            )}

            <div className="w-full max-w-6xl bg-white p-4 rounded-lg shadow-lg overflow-x-auto">
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="border p-2 text-left">Name</th>
                            <th className="border p-2 text-left">Week Info</th>
                            <th className="border p-2 text-left">Lesson Info</th>
                            <th className="border p-2 text-left">Time (mins)</th>
                            <th className="border p-2 text-left">Keywords</th>
                            <th className="border p-2 text-left">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Array.isArray(activities) && activities.length > 0 ? (
                            activities.map((activity) => {
                                const lesson = lessonMap[activity.lessonId]; // Get the lesson using lessonId
                                const week = lesson ? weekMap[lesson.weekId] : null; // Get the week using weekId
                                console.log(`Activity ID: ${activity.id}, Lesson:`, lesson); // Debugging line
                                return (
                                    <tr key={activity.id} className="border-t">
                                        <td className="border p-2">{activity.name}</td>
                                        <td className="border p-2">
                                            {week ? (
                                                <>
                                                    Week {week.number}: {week.theme}
                                                </>
                                            ) : (
                                                'No week assigned'
                                            )}
                                        </td>
                                        <td className="border p-2">
                                            {lesson ? lesson.name : 'No lesson assigned'}
                                        </td>
                                        <td className="border p-2">{activity.timeRequired}</td>
                                        <td className="border p-2">
                                            <div className="flex gap-2">
                                                {activity.keywords?.map((keyword, index) => (
                                                    <span key={index} className="bg-gray-200 px-2 py-1 rounded">
                                                        {keyword}
                                                    </span>
                                                ))}
                                            </div>
                                        </td>
                                        <td className="border p-2">
                                            <button
                                                onClick={() => handleDelete(activity.id)}
                                                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan="6" className="text-center p-4">No activities found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default GetActivities;
