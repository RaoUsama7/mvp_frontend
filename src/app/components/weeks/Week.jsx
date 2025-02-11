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
    const [formData, setFormData] = useState({
        theme: "",
        module_number: "",
        quarter: "",
        lessons: []
    });
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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const dataToSubmit = {
            ...formData,
            module_number: parseInt(formData.module_number),
            quarter: parseInt(formData.quarter),
            lessons: []
        };
        await createWeek(dataToSubmit);
        if (!error) {
            setFormData({
                theme: "",
                module_number: "",
                quarter: "",
                lessons: []
            });
            setIsModalOpen(false);
            fetchWeeks();
        }
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
                                    name="theme"
                                    value={formData.theme}
                                    onChange={handleChange}
                                    className="w-full border rounded-lg p-2 focus:ring focus:ring-blue-300"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block font-medium mb-1">Module Number</label>
                                <input
                                    type="number"
                                    name="module_number"
                                    value={formData.module_number}
                                    onChange={handleChange}
                                    className="w-full border rounded-lg p-2 focus:ring focus:ring-blue-300"
                                    required
                                    min="1"
                                />
                            </div>

                            <div>
                                <label className="block font-medium mb-1">Quarter</label>
                                <input
                                    type="number"
                                    name="quarter"
                                    value={formData.quarter}
                                    onChange={handleChange}
                                    className="w-full border rounded-lg p-2 focus:ring focus:ring-blue-300"
                                    required
                                    min="1"
                                    max="4"
                                />
                            </div>

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

