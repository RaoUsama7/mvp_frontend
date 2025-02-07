"use client";

import { useState } from "react";
import useWeeks from "@/app/hooks/useWeeks";

export default function EditWeekModal({ week, setIsModalOpen, fetchWeeks }) {
    const { updateWeek } = useWeeks();
    const [updatedTheme, setUpdatedTheme] = useState(week.theme);
    const [updatedDate, setUpdatedDate] = useState(week.date_start);

    const handleUpdate = async () => {
        await updateWeek(week.id, { theme: updatedTheme, date_start: updatedDate });
        setIsModalOpen(false);
        fetchWeeks();
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                <h2 className="text-xl font-bold mb-4">Edit Week</h2>
                <div className="space-y-4">
                    <div>
                        <label className="block font-medium mb-1">Theme</label>
                        <input
                            type="text"
                            value={updatedTheme}
                            onChange={(e) => setUpdatedTheme(e.target.value)}
                            className="w-full border rounded-lg p-2 focus:ring focus:ring-blue-300"
                            required
                        />
                    </div>

                    <div>
                        <label className="block font-medium mb-1">Start Date</label>
                        <input
                            type="datetime-local"
                            value={updatedDate}
                            onChange={(e) => setUpdatedDate(e.target.value)}
                            className="w-full border rounded-lg p-2 focus:ring focus:ring-blue-300"
                            required
                        />
                    </div>

                    <div className="flex justify-end gap-2">
                        <button
                            onClick={() => setIsModalOpen(false)}
                            className="bg-gray-400 text-white px-3 py-1 rounded hover:bg-gray-500"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleUpdate}
                            className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                        >
                            Save
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
