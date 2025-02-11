"use client";

import { useState, useEffect } from "react";
import useLessons from "../../hooks/useLessons";
import useWeeks from "../../hooks/useWeeks";
import EditLessonModal from "./EditLessonModal";
import DeleteLessonButton from "./DeleteLessonModal";

const ClientSideLesson = ({ lesson, onEdit, onDelete }) => (
    <div key={lesson?.id || 'temp-key'} className="bg-white rounded-lg shadow-md p-4 mb-4 flex justify-between items-center">
        <div>
            <h3 className="text-xl font-semibold">{lesson.title}</h3>
            <p className="text-gray-600">
                Week ID: {lesson.weekId}
            </p>
            <p className="text-gray-600">
                Time Required: {lesson.timeRequired} mins
            </p>
            <p className="text-gray-600">
                Activities: {lesson.activities?.length || 0}
            </p>
        </div>
        <div className="flex gap-2">
            <button
                onClick={() => onEdit(lesson)}
                className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
            >
                Edit
            </button>
            <DeleteLessonButton lessonId={lesson.id} fetchLessons={onDelete} />
        </div>
    </div>
);

export default function Lesson() {
    const { weeks = [], fetchWeeks } = useWeeks();
    const { lessons = [], fetchLessons, createLesson, loading, error, success } = useLessons();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedLesson, setSelectedLesson] = useState(null);
    const [formData, setFormData] = useState({
        title: "",
        week: "",
        core: false
    });

    // States for cascading dropdowns
    const [selectedQuarter, setSelectedQuarter] = useState("");
    const [selectedModule, setSelectedModule] = useState("");
    const [quarters, setQuarters] = useState([]);
    const [modules, setModules] = useState([]);
    const [filteredWeeks, setFilteredWeeks] = useState([]);

    useEffect(() => {
        fetchWeeks();
    }, []);

    // Extract unique quarters from weeks
    useEffect(() => {
        if (weeks.length > 0) {
            const uniqueQuarters = [...new Set(weeks.map(week => week.quarter))].sort((a, b) => a - b);
            setQuarters(uniqueQuarters);
        }
    }, [weeks]);

    // Filter modules when quarter changes
    useEffect(() => {
        if (selectedQuarter && weeks.length > 0) {
            const quarterWeeks = weeks.filter(week => week.quarter === parseInt(selectedQuarter));
            const uniqueModules = [...new Set(quarterWeeks.map(week => week.module_number))].sort((a, b) => a - b);
            setModules(uniqueModules);
            setSelectedModule("");
            setFormData(prev => ({ ...prev, week: "" }));
        }
    }, [selectedQuarter]);

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
    };

    const handleModuleChange = (e) => {
        setSelectedModule(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.title || !formData.week) {
            alert("Please fill in all required fields");
            return;
        }

        const lessonData = {
            title: formData.title,
            week: formData.week,
            activities: [],
            core: formData.core
        };

        await createLesson(lessonData);
        if (!error) {
            setIsModalOpen(false);
            setFormData({
                title: "",
                week: "",
                core: false
            });
            setSelectedQuarter("");
            setSelectedModule("");
        }
    };

    return (
        <div className="flex flex-col items-center bg-gray-100 p-6">
            <div className="w-full max-w-4xl flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Lessons</h2>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
                >
                    Create Lesson
                </button>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-[600px] max-h-[80vh] overflow-y-auto">
                        <h2 className="text-xl font-bold mb-4">Create a New Lesson</h2>
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
                                        name="week"
                                        value={formData.week}
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
                                    className="bg-blue-500 text-white px-3 py-1 rounded"
                                    disabled={loading}
                                >
                                    {loading ? "Creating..." : "Save"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {isEditModalOpen && selectedLesson && (
                <EditLessonModal
                    lesson={selectedLesson}
                    setIsModalOpen={setIsEditModalOpen}
                    fetchLessons={fetchLessons}
                />
            )}
        </div>
    );
}
