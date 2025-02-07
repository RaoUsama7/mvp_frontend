'use client'
import { useState } from "react";
import useCreateWeek from "../../hooks/useWeeks";

export default function CreateWeek() {

    const { createWeek, loading, error, success } = useCreateWeek();
    const [theme, setTheme] = useState("Transport");
    const [dateStart, setDateStart] = useState("2024-09-01T00:00:00.000Z");

    const handleSubmit = async (e) => {
        e.preventDefault();
        await createWeek({ lessons: [], theme, date_start: dateStart });
    };

    return (
        <div className="flex items-center justify-center bg-gray-100">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                <h2 className="text-2xl font-bold mb-4 text-center">Create a New Week</h2>

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

                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition disabled:opacity-50"
                        disabled={loading}
                    >
                        {loading ? "Creating..." : "Create Week"}
                    </button>
                </form>

                {error && <p className="text-red-500 mt-2 text-center">{error}</p>}
                {success && <p className="text-green-500 mt-2 text-center">{success}</p>}
            </div>
        </div>
    );
}

