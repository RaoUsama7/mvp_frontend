"use client";

import { useState, useEffect } from "react";
import useActivities from "../../hooks/useActivities";
import useLessons from "../../hooks/useLessons";
import useWeeks from "../../hooks/useWeeks";

const AddActivityButton = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { createActivity, loading } = useActivities();
    const { lessons, fetchLessons } = useLessons();
    const { weeks, fetchWeeks } = useWeeks();

    // States for form data
    const [formData, setFormData] = useState({
        name: "",
        meaning: "",
        objective: "",
        description: "",
        instructions: "",
        timeRequired: "",
        materials: "",
        lessonId: "",
        section: ""
    });

    // States for cascading dropdowns
    const [selectedModule, setSelectedModule] = useState("");
    const [selectedWeek, setSelectedWeek] = useState("");
    const [modules, setModules] = useState([]);
    const [filteredWeeks, setFilteredWeeks] = useState([]);
    const [filteredLessons, setFilteredLessons] = useState([]);

    useEffect(() => {
        fetchWeeks();
        fetchLessons();
    }, []);

    // Extract unique modules from weeks
    useEffect(() => {
        if (weeks.length > 0) {
            const uniqueModules = [...new Set(weeks.map(week => week.module_number))].sort((a, b) => a - b);
            setModules(uniqueModules);
        }
    }, [weeks]);

    // Filter weeks when module changes
    useEffect(() => {
        if (selectedModule && weeks.length > 0) {
            const filtered = weeks.filter(week => week.module_number === parseInt(selectedModule));
            setFilteredWeeks(filtered);
            setSelectedWeek("");
            setFormData(prev => ({ ...prev, lessonId: "" }));
        }
    }, [selectedModule]);

    // Filter lessons when week changes
    useEffect(() => {
        if (selectedWeek && lessons.length > 0) {
            const filtered = lessons.filter(lesson => lesson.weekId === selectedWeek);
            setFilteredLessons(filtered);
        }
    }, [selectedWeek, lessons]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleModuleChange = (e) => {
        setSelectedModule(e.target.value);
    };

    const handleWeekChange = (e) => {
        setSelectedWeek(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const activityData = {
            name: formData.name.trim(),
            meaning: formData.meaning.trim(),
            objective: formData.objective.trim(),
            description: formData.description.trim(),
            instructions: formData.instructions.trim(),
            timeRequired: parseInt(formData.timeRequired),
            materials: formData.materials.trim(),
            lessonId: formData.lessonId,
            section: formData.section.trim()
        };

        try {
            const response = await createActivity(activityData);
            if (response) {
                setFormData({
                    name: "",
                    meaning: "",
                    objective: "",
                    description: "",
                    instructions: "",
                    timeRequired: "",
                    materials: "",
                    lessonId: "",
                    section: ""
                });
                setSelectedModule("");
                setSelectedWeek("");
                setIsModalOpen(false);
                window.location.reload();
            }
        } catch (err) {
            console.error("Error creating activity:", err);
        }
    };

    return (
        <div className="flex flex-col p-4 bg-gray-100 rounded-lg">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold">Activities</h2>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                    Add New Activity
                </button>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg overflow-auto max-h-[90vh] w-[600px]">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-2xl font-bold">Create New Activity</h2>
                                <button 
                                    onClick={() => setIsModalOpen(false)} 
                                    className="text-gray-500 hover:text-gray-700"
                                >
                                    ✕
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block font-medium mb-1">Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="w-full border rounded-lg p-2"
                                        required
                                    />
                                </div>

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

                                {selectedModule && (
                                    <div>
                                        <label className="block font-medium mb-1">Week</label>
                                        <select
                                            value={selectedWeek}
                                            onChange={handleWeekChange}
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

                                {selectedWeek && (
                                    <div>
                                        <label className="block font-medium mb-1">Lesson</label>
                                        <select
                                            name="lessonId"
                                            value={formData.lessonId}
                                            onChange={handleChange}
                                            className="w-full border rounded-lg p-2"
                                            required
                                        >
                                            <option value="">Select Lesson...</option>
                                            {filteredLessons.map((lesson) => (
                                                <option key={lesson.id} value={lesson.id}>
                                                    {lesson.title} {lesson.core ? '(Core)' : '(Optional)'}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                )}

                                <div>
                                    <label className="block font-medium mb-1">Meaning</label>
                                    <input
                                        type="text"
                                        name="meaning"
                                        value={formData.meaning}
                                        onChange={handleChange}
                                        className="w-full border rounded-lg p-2"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block font-medium mb-1">Objective</label>
                                    <textarea
                                        name="objective"
                                        value={formData.objective}
                                        onChange={handleChange}
                                        className="w-full border rounded-lg p-2"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block font-medium mb-1">Description</label>
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        className="w-full border rounded-lg p-2"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block font-medium mb-1">Instructions</label>
                                    <textarea
                                        name="instructions"
                                        value={formData.instructions}
                                        onChange={handleChange}
                                        className="w-full border rounded-lg p-2"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block font-medium mb-1">Time Required (minutes)</label>
                                    <input
                                        type="number"
                                        name="timeRequired"
                                        value={formData.timeRequired}
                                        onChange={handleChange}
                                        className="w-full border rounded-lg p-2"
                                        required
                                        min="1"
                                    />
                                </div>

                                <div>
                                    <label className="block font-medium mb-1">Materials</label>
                                    <textarea
                                        name="materials"
                                        value={formData.materials}
                                        onChange={handleChange}
                                        className="w-full border rounded-lg p-2"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block font-medium mb-1">Level Up Section</label>
                                    <input
                                        type="text"
                                        name="section"
                                        value={formData.section}
                                        onChange={handleChange}
                                        className="w-full border rounded-lg p-2"
                                        required
                                        placeholder="Enter level up text here"
                                    />
                                </div>

                                <div className="flex justify-end gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setIsModalOpen(false)}
                                        className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                                        disabled={loading}
                                    >
                                        {loading ? "Creating..." : "Create Activity"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AddActivityButton;
