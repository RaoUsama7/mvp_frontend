"use client";

import { useState } from "react";
import useActivities from "../../hooks/useActivities";

const GetActivities = () => {
    const { activities, loading, error, deleteActivity, fetchActivities } = useActivities();

    const handleDelete = async (activityId) => {
        if (confirm("Are you sure you want to delete this activity?")) {
            await deleteActivity(activityId);
            await fetchActivities(); // Refresh the list after deletion
        }
    };

    return (
        <div className="flex flex-col items-center min-h-screen bg-gray-100 p-6">
            <h2 className="text-2xl font-bold mb-4">Activities List</h2>
            <div className="w-full max-w-6xl bg-white p-4 rounded-lg shadow-lg">
                {loading ? (
                    <p>Loading...</p>
                ) : error ? (
                    <p className="text-red-500">{error}</p>
                ) : (
                    <div className="space-y-4">
                        {activities?.map((activity) => (
                            <div key={activity.id} className="border p-4 rounded-lg">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="font-bold text-xl">{activity.name}</h3>
                                        <p className="text-gray-600">{activity.objective}</p>
                                        <p>Time Required: {activity.timeRequired} minutes</p>
                                        <div className="mt-2">
                                            <p className="font-medium">Keywords:</p>
                                            <div className="flex gap-2">
                                                {activity.keywords?.map((keyword, index) => (
                                                    <span key={index} className="bg-gray-200 px-2 py-1 rounded">
                                                        {keyword}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleDelete(activity.id)}
                                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default GetActivities;
