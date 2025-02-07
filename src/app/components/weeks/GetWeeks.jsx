"use client";

import { useState, useEffect } from "react";
import useWeeks from "../../hooks/useWeeks";
import EditWeekModal from "./EditWeekModal";
import DeleteWeekButton from "./DeleteWeekModal";

const ClientSideWeekRow = ({ week, formattedDate, onEdit, onDelete }) => (
    <tr key={week?.id || 'temp-key'} className="border-t">
        <td className="border p-2">{week.number}</td>
        <td className="border p-2">{week.theme}</td>
        <td className="border p-2">{formattedDate || 'Loading...'}</td>
        <td className="border p-2 flex gap-2">
            <button
                onClick={() => onEdit(week)}
                className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
            >
                Edit
            </button>
            <DeleteWeekButton weekId={week.id} fetchWeeks={onDelete} />
        </td>
    </tr>
);

export default function WeeksList() {
    const { weeks, week, loading, error, fetchWeeks, getWeekById } = useWeeks();
    const weekList = weeks?.data || [];
    const pagination = weeks?.pagination || { currentPage: 1, totalPages: 1 };

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedWeek, setSelectedWeek] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = pagination.totalPages || 1;
    const [formattedDates, setFormattedDates] = useState({});
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        if (!weekList?.length || !isMounted) return;
        
        const dates = {};
        weekList.forEach(week => {
            if (week?.id && week?.date_start) {
                try {
                    dates[week.id] = new Date(week.date_start).toLocaleDateString();
                } catch (e) {
                    dates[week.id] = 'Invalid date';
                }
            }
        });
        setFormattedDates(dates);
    }, [weekList, isMounted]);

    const openEditModal = (week) => {
        setSelectedWeek(week);
        setIsEditModalOpen(true);
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            const nextPage = currentPage + 1;
            setCurrentPage(nextPage);
            fetchWeeks(nextPage);
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            const prevPage = currentPage - 1;
            setCurrentPage(prevPage);
            fetchWeeks(prevPage);
        }
    };

    if (!isMounted) {
        return <div className="flex flex-col items-center bg-gray-100 p-6 w-full">Loading...</div>;
    }

    return (
        <div className="flex flex-col items-center bg-gray-100 p-6 w-full">
            <div className="flex justify-between w-full max-w-4xl mb-4">
                <button
                    onClick={() => fetchWeeks({ page: currentPage })}
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
                        {Array.isArray(weekList) && weekList.length > 0 ? (
                            weekList.map((week) => (
                                <ClientSideWeekRow
                                    key={week?.id || 'temp-key'}
                                    week={week}
                                    formattedDate={formattedDates[week.id]}
                                    onEdit={openEditModal}
                                    onDelete={fetchWeeks}
                                />
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" className="text-center p-4">No weeks found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <div className="flex justify-center mt-4 space-x-2">
                <button
                    onClick={handlePreviousPage}
                    className={`px-4 py-2 rounded-lg ${currentPage > 1 ? "bg-blue-500 text-white hover:bg-blue-600" : "bg-gray-300 text-gray-500 cursor-not-allowed"}`}
                    disabled={currentPage <= 1}
                >
                    Previous
                </button>

                <span className="px-4 py-2 border rounded-lg bg-white">
                    Page {currentPage} of {totalPages}
                </span>

                <button
                    onClick={handleNextPage}
                    className={`px-4 py-2 rounded-lg ${currentPage < totalPages ? "bg-blue-500 text-white hover:bg-blue-600" : "bg-gray-300 text-gray-500 cursor-not-allowed"}`}
                    disabled={currentPage >= totalPages}
                >
                    Next
                </button>
            </div>

            {isEditModalOpen && <EditWeekModal week={selectedWeek} setIsModalOpen={setIsEditModalOpen} fetchWeeks={fetchWeeks} />}
        </div>
    );
}
