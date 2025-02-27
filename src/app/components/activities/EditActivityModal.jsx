"use client";

import { useState, useEffect } from "react";
import useActivities from "../../hooks/useActivities";
import useLessons from "../../hooks/useLessons";
import useWeeks from "../../hooks/useWeeks";

export default function EditActivityModal({ activity, setIsModalOpen, fetchActivities }) {
    const { updateActivity } = useActivities();
    const { lessons, fetchLessons } = useLessons();
    const { weeks, fetchWeeks } = useWeeks();
    
    const [formData, setFormData] = useState({
        name: activity.name || "",
        meaning: activity.meaning || "",
        objective: activity.objective || "",
        description: activity.description || "",
        instructions: activity.instructions || "",
        timeRequired: activity.timeRequired || "",
        materials: activity.materials || "",
        lessonId: activity.lessonId || activity.lesson?.id || "",
        section: activity.section || ""
    });

    // States for cascading dropdowns
    const [selectedModule, setSelectedModule] = useState("");
    const [selectedWeek, setSelectedWeek] = useState("");
    const [modules, setModules] = useState([]);
    const [filteredWeeks, setFilteredWeeks] = useState([]);
    const [filteredLessons, setFilteredLessons] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchWeeks();
        fetchLessons();
    }, []);

    // Extract unique modules from weeks
    useEffect(() => {
        if (weeks.length > 0) {
            const uniqueModules = [...new Set(weeks.map(week => week.module_number))].sort((a, b) => a - b);
            setModules(uniqueModules);
            
            // Set initial module and week based on current activity's lesson
            const currentLesson = lessons.find(l => l.id === formData.lessonId);
            if (currentLesson?.week) {
                setSelectedModule(currentLesson.week.module_number.toString());
                setSelectedWeek(currentLesson.week.id);
            }
        }
    }, [weeks, lessons]);

    // Filter weeks when module changes
    useEffect(() => {
        if (selectedModule && weeks.length > 0) {
            const filtered = weeks.filter(week => week.module_number === parseInt(selectedModule));
            setFilteredWeeks(filtered);
        }
    }, [selectedModule, weeks]);

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
        setSelectedWeek("");
        setFormData(prev => ({ ...prev, lessonId: "" }));
    };

    const handleWeekChange = (e) => {
        setSelectedWeek(e.target.value);
        setFormData(prev => ({ ...prev, lessonId: "" }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        try {
            const requestData = {
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
            
            const result = await updateActivity(activity.id, requestData);
            if (result) {
                await fetchActivities();
                setIsModalOpen(false);
            }
        } catch (error) {
            setError("Failed to update activity. Please try again.");
            console.error("Failed to update activity:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-[600px] max-h-[90vh] overflow-y-auto">
                <h2 className="text-xl font-bold mb-4">Edit Activity</h2>
                {error && (
                    <div className="mb-4 p-2 bg-red-100 text-red-600 rounded">
                        {error}
                    </div>
                )}
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

                    <div className="flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={() => setIsModalOpen(false)}
                            className="bg-gray-400 text-white px-3 py-1 rounded hover:bg-gray-500"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                        >
                            {isSubmitting ? "Saving..." : "Save"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}