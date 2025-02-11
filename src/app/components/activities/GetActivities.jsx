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

    return (
        <div className="flex flex-col items-center min-h-screen bg-gray-100 p-6">
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
                            <th className="border p-2 text-left">Module</th>
                            <th className="border p-2 text-left">Week</th>
                            <th className="border p-2 text-left">Lesson</th>
                            <th className="border p-2 text-left">Time (mins)</th>
                            <th className="border p-2 text-left">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Array.isArray(activities) && activities.length > 0 ? (
                            activities.map((activity) => (
                                <tr key={activity.id} className="border-t">
                                    <td className="border p-2">{activity.name}</td>
                                    <td className="border p-2">Module {activity.lesson?.week?.module_number}</td>
                                    <td className="border p-2">
                                        Week {activity.lesson?.week?.week_number}: {activity.lesson?.week?.theme}
                                    </td>
                                    <td className="border p-2">
                                        {activity.lesson?.title}
                                        <span className={`ml-2 px-2 py-1 rounded text-sm ${activity.lesson?.core ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                            {activity.lesson?.core ? 'Core' : 'Optional'}
                                        </span>
                                    </td>
                                    <td className="border p-2">{activity.timeRequired}</td>
                                    <td className="border p-2">
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => {
                                                    setSelectedActivity(activity);
                                                    setIsEditModalOpen(true);
                                                }}
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

