"use client";

import { useState, useEffect } from "react";
import useWeeks from "../../hooks/useWeeks";
import EditWeekModal from "./EditWeekModal";
import DeleteWeekButton from "./DeleteWeekModal";

export default function WeeksList() {
    const { weeks, loading, error, fetchWeeks } = useWeeks();
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedWeek, setSelectedWeek] = useState(null);
    const [formattedDates, setFormattedDates] = useState({});
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        if (!weeks || !isMounted) return;
        
        const dates = {};
        weeks.forEach(week => {
            if (week?.id && week?.dateStart) {
                try {
                    dates[week.id] = new Date(week.dateStart).toLocaleDateString();
                } catch (e) {
                    dates[week.id] = 'Invalid date';
                }
            }
        });
        setFormattedDates(dates);
    }, [weeks, isMounted]);

    const openEditModal = (week) => {
        setSelectedWeek(week);
        setIsEditModalOpen(true);
    };

    if (!isMounted) {
        return <div className="flex flex-col items-center bg-gray-100 p-6 w-full">Loading...</div>;
    }

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
                            <th className="border p-2 text-left">Number</th>
                            <th className="border p-2 text-left">Theme</th>
                            <th className="border p-2 text-left">Start Date</th>
                            <th className="border p-2 text-left">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Array.isArray(weeks) && weeks.length > 0 ? (
                            weeks.map((week) => (
                                <tr key={week?.id || 'temp-key'} className="border-t">
                                    <td className="border p-2">{week.number}</td>
                                    <td className="border p-2">{week.theme}</td>
                                    <td className="border p-2">{formattedDates[week.id] || 'Loading...'}</td>
                                    <td className="border p-2 flex gap-2">
                                        <button
                                            onClick={() => openEditModal(week)}
                                            className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
                                        >
                                            Edit
                                        </button>
                                        <DeleteWeekButton weekId={week.id} fetchWeeks={fetchWeeks} />
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" className="text-center p-4">No weeks found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {isEditModalOpen && (
                <EditWeekModal 
                    week={selectedWeek} 
                    setIsModalOpen={setIsEditModalOpen} 
                    fetchWeeks={fetchWeeks} 
                />
            )}
        </div>
    );
}
