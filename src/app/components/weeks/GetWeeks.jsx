"use client";

import { useState } from "react";
import useWeeks from "../../hooks/useWeeks";
import EditWeekModal from "./EditWeekModal";
import DeleteWeekButton from "./DeleteWeekModal";

export default function WeeksList() {
    const { weeks, loading, error, fetchWeeks } = useWeeks();
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedWeek, setSelectedWeek] = useState(null);

    const openEditModal = (week) => {
        setSelectedWeek(week);
        setIsEditModalOpen(true);
    };

    return (
        <div className="flex flex-col items-center bg-gray-100 p-6 w-full">
            <div className="flex justify-between w-full max-w-4xl mb-4">
                <button
                    onClick={() => fetchWeeks()}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
                    disabled={loading}
                >
                    {loading ? "Loading..." : "Refresh Weeks"}
                </button>
            </div>

            {error && <p className="text-red-500">{error}</p>}

            <div className="w-full max-w-4xl bg-white p-4 rounded-lg shadow-lg overflow-x-auto">
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="border p-2 text-left">Quarter</th>
                            <th className="border p-2 text-left">Module Number</th>
                            <th className="border p-2 text-left">Week Number</th>
                            <th className="border p-2 text-left">Theme</th>
                            {/* <th className="border p-2 text-left">Module Focus</th> */}
                            {/* <th className="border p-2 text-left">Skills</th> */}
                            {/* <th className="border p-2 text-left">Keywords</th> */}
                            <th className="border p-2 text-left">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Array.isArray(weeks) && weeks.length > 0 ? (
                            weeks.map((week) => (
                                <tr key={week?.id || 'temp-key'} className="border-t">
                                    <td className="border p-2">{week.quarter}</td>
                                    <td className="border p-2">{week.module_number}</td>
                                    <td className="border p-2">{week.week_number}</td>
                                    <td className="border p-2">{week.theme}</td>
                                    {/* <td className="border p-2">{week.module_focus || '-'}</td> */}
                                    {/* <td className="border p-2">
                                        <div className="flex flex-wrap gap-1">
                                            {week.skills?.map((skill, index) => (
                                                <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                                                    {skill}
                                                </span>
                                            )) || '-'}
                                        </div>
                                    </td>
                                    <td className="border p-2">
                                        <div className="flex flex-wrap gap-1">
                                            {week.keywords?.map((keyword, index) => (
                                                <span key={index} className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm">
                                                    {keyword}
                                                </span>
                                            )) || '-'}
                                        </div>
                                    </td> */}
                                    <td className="border p-2">
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => openEditModal(week)}
                                                className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
                                            >
                                                Edit
                                            </button>
                                            <DeleteWeekButton weekId={week.id} fetchWeeks={fetchWeeks} />
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="8" className="text-center p-4">No weeks found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

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
