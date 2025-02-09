"use client";

import { useState } from "react";
import useActivities from "../../hooks/useActivities";
import EditActivityModal from "./EditActivityModal";

const GetActivities = () => {
    const { activities, loading, error, deleteActivity, fetchActivities } = useActivities();
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedActivity, setSelectedActivity] = useState(null);

    const handleDelete = async (activityId) => {
        if (confirm("Are you sure you want to delete this activity?")) {
            await deleteActivity(activityId);
            await fetchActivities();
        }
    };

    const openEditModal = (activity) => {
        setSelectedActivity(activity);
        setIsEditModalOpen(true);
    };

    return (
        <div className="flex flex-col items-center min-h-screen bg-gray-100 p-6">
            <h2 className="text-2xl font-bold mb-4">Activities List</h2>
            <button
                onClick={fetchActivities}
                className="mb-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
                disabled={loading}
            >
                {loading ? "Loading..." : "Refresh Activities"}
            </button>

            {error && <p className="text-red-500">{error}</p>}

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
                            activities.map((activity) => (
                                <tr key={activity.id} className="border-t">
                                    <td className="border p-2">{activity.name}</td>
                                    <td className="border p-2">
                                        {activity.lesson?.week ? (
                                            <>
                                                Week {activity.lesson.week.number}: {activity.lesson.week.theme}
                                            </>
                                        ) : (
                                            'No week assigned'
                                        )}
                                    </td>
                                    <td className="border p-2">
                                        {activity.lesson ? activity.lesson.title : 'No lesson assigned'}
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
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => openEditModal(activity)}
                                                className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(activity.id)}
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
                                <td colSpan="6" className="text-center p-4">No activities found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Edit Modal */}
            {isEditModalOpen && selectedActivity && (
                <EditActivityModal 
                    activity={selectedActivity}
                    setIsModalOpen={setIsEditModalOpen}
                    fetchActivities={fetchActivities}
                />
            )}
        </div>
    );
};

export default GetActivities;
