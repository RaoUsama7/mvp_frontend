"use client";

import { useState, useEffect } from "react";
import useActivities from "../../hooks/useActivities";
import useLessons from "../../hooks/useLessons";

const AddActivityButton = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { createActivity, loading } = useActivities();
    const { lessons, fetchLessons } = useLessons();
    const [name, setName] = useState("");
    const [objective, setObjective] = useState("");
    const [keywords, setKeywords] = useState([]);
    const [instructions, setInstructions] = useState("");
    const [timeRequired, setTimeRequired] = useState("");
    const [materials, setMaterials] = useState([{ title: "", link: "" }]);
    const [lessonId, setLessonId] = useState("");

    useEffect(() => {
        fetchLessons();
    }, []);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const activityData = {
            name: name.trim(),
            objective: objective.trim(),
            keywords: keywords.filter(k => k.trim() !== ""),
            instructions: instructions.trim(),
            timeRequired: Number(timeRequired),
            materials: materials.filter(m => m.title.trim() !== "" && m.link.trim() !== ""),
            lessonId: lessonId
        };
        try {
            await createActivity(activityData);
            setName("");
            setObjective("");
            setKeywords([]);
            setInstructions("");
            setTimeRequired("");
            setMaterials([{ title: "", link: "" }]);
            setLessonId("");
            closeModal();
        } catch (err) {
            console.error("Error creating activity:", err);
        }
    };

    return (
        <div className="flex flex-col p-4 bg-gray-100 rounded-lg">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold">Activities</h2>
                <button
                    onClick={openModal}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                    Add New Activity
                </button>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-[600px] max-h-[80vh] overflow-y-auto">
                        <h2 className="text-xl font-bold mb-4">Create New Activity</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block font-medium mb-1">Name</label>
                                <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full border rounded-lg p-2" required />
                            </div>
                            <div>
                                <label className="block font-medium mb-1">Objective</label>
                                <textarea value={objective} onChange={(e) => setObjective(e.target.value)} className="w-full border rounded-lg p-2" required />
                            </div>
                            <div>
                                <label className="block font-medium mb-1">Keywords (comma-separated)</label>
                                <input type="text" value={keywords.join(", ")} onChange={(e) => setKeywords(e.target.value.split(",").map(k => k.trim()))} className="w-full border rounded-lg p-2" />
                            </div>
                            <div>
                                <label className="block font-medium mb-1">Instructions</label>
                                <textarea value={instructions} onChange={(e) => setInstructions(e.target.value)} className="w-full border rounded-lg p-2" required />
                            </div>
                            <div>
                                <label className="block font-medium mb-1">Time Required (minutes)</label>
                                <input type="number" value={timeRequired} onChange={(e) => setTimeRequired(e.target.value)} className="w-full border rounded-lg p-2" required />
                            </div>

                            <div className="flex justify-end gap-2 mt-4">
                                <button type="button" onClick={closeModal} className="bg-gray-400 text-white px-3 py-1 rounded hover:bg-gray-500">Cancel</button>
                                <button type="submit" className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600" disabled={loading}>{loading ? "Creating..." : "Create Activity"}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AddActivityButton;

// "use client";

// import { useState, useEffect } from "react";
// import useActivities from "../../hooks/useActivities";
// import useLessons from "../../hooks/useLessons";

// const CreateActivity = () => {
//     const { createActivity, loading, error, success } = useActivities();
//     const { lessons, fetchLessons } = useLessons();
//     const [name, setName] = useState("");
//     const [objective, setObjective] = useState("");
//     const [keywords, setKeywords] = useState([]);
//     const [instructions, setInstructions] = useState("");
//     const [timeRequired, setTimeRequired] = useState("");
//     const [materials, setMaterials] = useState([{ title: "", link: "" }]);
//     const [lessonId, setLessonId] = useState("");

//     useEffect(() => {
//         fetchLessons();
//     }, []);

//     const handleMaterialChange = (index, field, value) => {
//         const newMaterials = [...materials];
//         newMaterials[index][field] = value;
//         setMaterials(newMaterials);
//     };

//     const addMaterial = () => {
//         setMaterials([...materials, { title: "", link: "" }]);
//     };

//     const removeMaterial = (index) => {
//         const newMaterials = materials.filter((_, i) => i !== index);
//         setMaterials(newMaterials);
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();

//         const activityData = {
//             name: name.trim(),
//             objective: objective.trim(),
//             keywords: keywords.filter(k => k.trim() !== ""),
//             instructions: instructions.trim(),
//             timeRequired: Number(timeRequired),
//             materials: materials.filter(m => m.title.trim() !== "" && m.link.trim() !== ""),
//             lessonId: lessonId
//         };

//         try {
//             await createActivity(activityData);
//             // Reset form
//             setName("");
//             setObjective("");
//             setKeywords([]);
//             setInstructions("");
//             setTimeRequired("");
//             setMaterials([{ title: "", link: "" }]);
//             setLessonId("");
//         } catch (err) {
//             console.error("Error creating activity:", err);
//         }
//     };

//     return (
//         <div className="flex flex-col items-center min-h-screen bg-gray-100 p-6">
//             <h2 className="text-2xl font-bold mb-4">Create New Activity</h2>

//             <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg w-96 space-y-4">
//                 <div>
//                     <label className="block font-medium mb-1">Name</label>
//                     <input
//                         type="text"
//                         value={name}
//                         onChange={(e) => setName(e.target.value)}
//                         className="w-full border rounded-lg p-2"
//                         required
//                     />
//                 </div>

//                 <div>
//                     <label className="block font-medium mb-1">Objective</label>
//                     <textarea
//                         value={objective}
//                         onChange={(e) => setObjective(e.target.value)}
//                         className="w-full border rounded-lg p-2"
//                         required
//                     />
//                 </div>

//                 <div>
//                     <label className="block font-medium mb-1">Keywords (comma-separated)</label>
//                     <input
//                         type="text"
//                         value={keywords.join(", ")}
//                         onChange={(e) => setKeywords(e.target.value.split(",").map(k => k.trim()))}
//                         className="w-full border rounded-lg p-2"
//                     />
//                 </div>

//                 <div>
//                     <label className="block font-medium mb-1">Instructions</label>
//                     <textarea
//                         value={instructions}
//                         onChange={(e) => setInstructions(e.target.value)}
//                         className="w-full border rounded-lg p-2"
//                         required
//                     />
//                 </div>

//                 <div>
//                     <label className="block font-medium mb-1">Time Required (minutes)</label>
//                     <input
//                         type="number"
//                         value={timeRequired}
//                         onChange={(e) => setTimeRequired(e.target.value)}
//                         className="w-full border rounded-lg p-2"
//                         required
//                     />
//                 </div>

//                 <div>
//                     <label className="block font-medium mb-1">Materials</label>
//                     {materials.map((material, index) => (
//                         <div key={index} className="space-y-2 mb-2">
//                             <input
//                                 type="text"
//                                 placeholder="Title"
//                                 value={material.title}
//                                 onChange={(e) => handleMaterialChange(index, "title", e.target.value)}
//                                 className="w-full border rounded-lg p-2"
//                             />
//                             <input
//                                 type="url"
//                                 placeholder="Link"
//                                 value={material.link}
//                                 onChange={(e) => handleMaterialChange(index, "link", e.target.value)}
//                                 className="w-full border rounded-lg p-2"
//                             />
//                             <button
//                                 type="button"
//                                 onClick={() => removeMaterial(index)}
//                                 className="text-red-500"
//                             >
//                                 Remove
//                             </button>
//                         </div>
//                     ))}
//                     <button
//                         type="button"
//                         onClick={addMaterial}
//                         className="text-blue-500"
//                     >
//                         Add Material
//                     </button>
//                 </div>

//                 <div>
//                     <label className="block font-medium mb-1">Lesson</label>
//                     <select
//                         value={lessonId}
//                         onChange={(e) => setLessonId(e.target.value)}
//                         className="w-full border rounded-lg p-2"
//                         required
//                     >
//                         <option value="">Select a lesson...</option>
//                         {lessons?.map((lesson) => (
//                             <option key={lesson.id} value={lesson.id}>
//                                 {lesson.title}
//                             </option>
//                         ))}
//                     </select>
//                 </div>

//                 <button
//                     type="submit"
//                     className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
//                     disabled={loading}
//                 >
//                     {loading ? "Creating..." : "Create Activity"}
//                 </button>
//             </form>

//             {error && <p className="text-red-500 mt-2">{error}</p>}
//             {success && <p className="text-green-500 mt-2">{success}</p>}
//         </div>
//     );
// };

// export default CreateActivity;
