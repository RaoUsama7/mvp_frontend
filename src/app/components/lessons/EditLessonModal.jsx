"use client";

import { useState, useEffect } from "react";
import useLessons from "../../hooks/useLessons";
import useWeeks from "../../hooks/useWeeks";

export default function EditLessonModal({ lesson, setIsModalOpen, fetchLessons }) {
    const { updateLesson } = useLessons();
    const { weeks, fetchWeeks } = useWeeks();
    const [formData, setFormData] = useState({
        title: lesson.title,
        weekId: lesson.weekId || lesson.week?.id,
        core: lesson.core
    });

    // States for cascading dropdowns
    const [selectedQuarter, setSelectedQuarter] = useState("");
    const [selectedModule, setSelectedModule] = useState("");
    const [quarters, setQuarters] = useState([]);
    const [modules, setModules] = useState([]);
    const [filteredWeeks, setFilteredWeeks] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchWeeks();
    }, []);

    // Extract unique quarters from weeks
    useEffect(() => {
        if (weeks.length > 0) {
            const uniqueQuarters = [...new Set(weeks.map(week => week.quarter))].sort((a, b) => a - b);
            setQuarters(uniqueQuarters);
            
            // Set initial quarter and module based on current lesson's week
            const currentWeek = weeks.find(w => w.id === formData.weekId);
            if (currentWeek) {
                setSelectedQuarter(currentWeek.quarter.toString());
                setSelectedModule(currentWeek.module_number.toString());
            }
        }
    }, [weeks]);

    // Filter modules when quarter changes
    useEffect(() => {
        if (selectedQuarter && weeks.length > 0) {
            const quarterWeeks = weeks.filter(week => week.quarter === parseInt(selectedQuarter));
            const uniqueModules = [...new Set(quarterWeeks.map(week => week.module_number))].sort((a, b) => a - b);
            setModules(uniqueModules);
        }
    }, [selectedQuarter, weeks]);

    // Filter weeks when module changes
    useEffect(() => {
        if (selectedQuarter && selectedModule && weeks.length > 0) {
            const filtered = weeks.filter(week => 
                week.quarter === parseInt(selectedQuarter) && 
                week.module_number === parseInt(selectedModule)
            );
            setFilteredWeeks(filtered);
        }
    }, [selectedQuarter, selectedModule, weeks]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleQuarterChange = (e) => {
        setSelectedQuarter(e.target.value);
        setSelectedModule("");
        setFormData(prev => ({ ...prev, weekId: "" }));
    };

    const handleModuleChange = (e) => {
        setSelectedModule(e.target.value);
        setFormData(prev => ({ ...prev, weekId: "" }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        try {
            const requestData = {
                title: formData.title,
                weekId: formData.weekId,
                core: formData.core
            };
            
            const result = await updateLesson(lesson.id, requestData);
            if (result) {
                await fetchLessons();
                setIsModalOpen(false);
            }
        } catch (error) {
            setError("Failed to update lesson. Please try again.");
            console.error("Failed to update lesson:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-[500px] max-h-[90vh] overflow-y-auto">
                <h2 className="text-xl font-bold mb-4">Edit Lesson</h2>
                {error && (
                    <div className="mb-4 p-2 bg-red-100 text-red-600 rounded">
                        {error}
                    </div>
                )}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block font-medium mb-1">Title</label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            className="w-full border rounded-lg p-2"
                            required
                        />
                    </div>

                    <div>
                        <label className="block font-medium mb-1">Quarter</label>
                        <select
                            value={selectedQuarter}
                            onChange={handleQuarterChange}
                            className="w-full border rounded-lg p-2"
                            required
                        >
                            <option value="">Select Quarter...</option>
                            {quarters.map((quarter) => (
                                <option key={quarter} value={quarter}>
                                    Quarter {quarter}
                                </option>
                            ))}
                        </select>
                    </div>

                    {selectedQuarter && (
                        <div>
                            <label className="block font-medium mb-1">Module</label>
                            <select
                                value={selectedModule}
                                onChange={handleModuleChange}
                                className="w-full border rounded-lg p-2"
                                required
                            >
                                <option value="">Select Module...</option>
                                {modules.map((module) => (
                                    <option key={module} value={module}>
                                        Module {module}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    {selectedModule && (
                        <div>
                            <label className="block font-medium mb-1">Week</label>
                            <select
                                name="weekId"
                                value={formData.weekId}
                                onChange={handleChange}
                                className="w-full border rounded-lg p-2"
                                required
                            >
                                <option value="">Select Week...</option>
                                {filteredWeeks.map((week) => (
                                    <option key={week.id} value={week.id}>
                                        Week {week.week_number}: {week.theme}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    <div>
                        <label className="block font-medium mb-1">Lesson Type</label>
                        <div className="flex gap-4">
                            <div className="flex items-center">
                                <input
                                    type="radio"
                                    id="core-true"
                                    name="core"
                                    checked={formData.core === true}
                                    onChange={() => setFormData(prev => ({ ...prev, core: true }))}
                                    className="mr-2"
                                />
                                <label htmlFor="core-true">Core Lesson</label>
                            </div>
                            <div className="flex items-center">
                                <input
                                    type="radio"
                                    id="core-false"
                                    name="core"
                                    checked={formData.core === false}
                                    onChange={() => setFormData(prev => ({ ...prev, core: false }))}
                                    className="mr-2"
                                />
                                <label htmlFor="core-false">Optional Lesson</label>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={() => setIsModalOpen(false)}
                            className="bg-gray-400 text-white px-3 py-1 rounded"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="bg-blue-500 text-white px-3 py-1 rounded disabled:bg-blue-300"
                        >
                            {isSubmitting ? "Saving..." : "Save"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
