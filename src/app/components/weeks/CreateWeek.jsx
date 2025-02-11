'use client'
import { useState } from "react";
import useWeeks from "../../hooks/useWeeks";

export default function CreateWeek() {
    const { createWeek, loading, error, success } = useWeeks();
    const [formData, setFormData] = useState({
        theme: "",
        module_number: "",
        quarter: "",
        lessons: []
    });

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
        }
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


