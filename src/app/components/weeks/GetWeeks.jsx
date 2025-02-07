"use client";

import { useState } from "react";
import useWeeks from "@/app/hooks/useWeeks";
import EditWeekModal from "./EditWeekModal";
import DeleteWeekButton from "./DeleteWeekModal";


export default function WeeksList() {
    const { weeks, week, loading, error, fetchWeeks, getWeekById } = useWeeks();
    const weekList = weeks?.data || [];
    const pagination = weeks?.pagination || { currentPage: 1, totalPages: 1 };

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedWeek, setSelectedWeek] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = pagination.totalPages || 1;

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
                        {weekList.length > 0 ? (
                            weekList.map((week) => (
                                <tr key={week.id} className="border-t">
                                    <td className="border p-2">{week.number}</td>
                                    <td className="border p-2">{week.theme}</td>
                                    <td className="border p-2">{new Date(week.date_start).toLocaleDateString()}</td>
                                    <td className="border p-2 flex gap-2">
                                        <button
                                            onClick={() => openEditModal(week)}
                                            className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
                                        >
                                            Edit
                                        </button>
                                        <DeleteWeekButton weekId={week.id} fetchWeeks={fetchWeeks} />
                                    </td>
                                </tr>
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

// "use client";

// import { useState } from "react";
// import useWeeks from "@/app/hooks/useWeeks";

// export default function WeeksList() {
//     const { weeks, week, loading, error, fetchWeeks, getWeekById, updateWeek, deleteWeek } = useWeeks();
//     const weekList = weeks?.data || [];
//     const pagination = weeks?.pagination || { currentPage: 1, totalPages: 1 };

//     const [isModalOpen, setIsModalOpen] = useState(false);
//     const [selectedWeek, setSelectedWeek] = useState(null);
//     const [updatedTheme, setUpdatedTheme] = useState("");
//     const [updatedDate, setUpdatedDate] = useState("");
//     const [weekId, setWeekId] = useState("");
//     const [currentPage, setCurrentPage] = useState(1);
//     const totalPages = weeks?.pagination?.totalPages || 1;


//     const openModal = (week) => {
//         setSelectedWeek(week);
//         setUpdatedTheme(week.theme);
//         setUpdatedDate(week.date_start);
//         setIsModalOpen(true);
//     };

//     const handleUpdate = async () => {
//         if (selectedWeek) {
//             await updateWeek(selectedWeek.id, { theme: updatedTheme, date_start: updatedDate });
//             setIsModalOpen(false);
//         }
//     };

//     const handleDelete = async (weekId) => {
//         await deleteWeek(weekId);
//         fetchWeeks();
//     };

//     const handleFetchWeekById = async () => {
//         if (weekId) {
//             await getWeekById(weekId);
//         }
//     };



//     const handleNextPage = () => {
//         if (currentPage < totalPages) {
//             const nextPage = currentPage + 1;
//             setCurrentPage(nextPage);
//             fetchWeeks(nextPage);
//         }
//     };

//     const handlePreviousPage = () => {
//         if (currentPage > 1) {
//             const prevPage = currentPage - 1;
//             setCurrentPage(prevPage);
//             fetchWeeks(prevPage);
//         }
//     };


//     return (
//         <div className="flex flex-col items-center bg-gray-100 p-6 w-full">
//             <div className="flex justify-between w-full max-w-4xl mb-4">
//                 <button
//                     onClick={() => fetchWeeks({ page: currentPage })}
//                     className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
//                     disabled={loading}
//                 >
//                     {loading ? "Loading..." : "Refresh Weeks"}
//                 </button>

//                 {/* <div className="flex gap-2">
//                     <input
//                         type="text"
//                         placeholder="Enter Week ID"
//                         value={weekId}
//                         onChange={(e) => setWeekId(e.target.value)}
//                         className="border p-2 rounded-lg"
//                     />
//                     <button
//                         onClick={handleFetchWeekById}
//                         className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
//                     >
//                         Get Week
//                     </button>
//                 </div> */}
//             </div>

//             {error && <p className="text-red-500">{error}</p>}

//             {week && (
//                 <div className="bg-white p-4 rounded-lg shadow-lg w-full max-w-md mb-6">
//                     <h3 className="text-xl font-bold mb-2">Week Details</h3>
//                     <p><strong>Number:</strong> {week.number}</p>
//                     <p><strong>Theme:</strong> {week.theme}</p>
//                     <p><strong>Start Date:</strong> {new Date(week.date_start).toLocaleDateString()}</p>
//                 </div>
//             )}

//             <div className="w-full max-w-4xl bg-white p-4 rounded-lg shadow-lg overflow-x-auto">
//                 <table className="w-full border-collapse">
//                     <thead>
//                         <tr className="bg-gray-200">
//                             <th className="border p-2 text-left">Number</th>
//                             <th className="border p-2 text-left">Theme</th>
//                             <th className="border p-2 text-left">Start Date</th>
//                             <th className="border p-2 text-left">Actions</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {weekList.length > 0 ? (
//                             weekList.map((week) => (
//                                 <tr key={week.id} className="border-t">
//                                     <td className="border p-2">{week.number}</td>
//                                     <td className="border p-2">{week.theme}</td>
//                                     <td className="border p-2">{new Date(week.date_start).toLocaleDateString()}</td>
//                                     <td className="border p-2 flex gap-2">
//                                         <button onClick={() => openModal(week)} className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600">
//                                             Edit
//                                         </button>
//                                         <button onClick={() => handleDelete(week.id)} className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600">
//                                             Delete
//                                         </button>
//                                     </td>
//                                 </tr>
//                             ))
//                         ) : (
//                             <tr>
//                                 <td colSpan="4" className="text-center p-4">No weeks found.</td>
//                             </tr>
//                         )}
//                     </tbody>

//                     {/* <tbody>
//                         {weekList.length > 0 ? (
//                             weekList.map((week) => (
//                                 <tr key={week.id} className="border-t">
//                                     <td className="border p-2">{week.number}</td>
//                                     <td className="border p-2">{week.theme}</td>
//                                     <td className="border p-2">{new Date(week.date_start).toLocaleDateString()}</td>
//                                     <td className="border p-2 flex gap-2">
//                                         <button
//                                             onClick={() => openModal(week)}
//                                             className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
//                                         >
//                                             Edit
//                                         </button>
//                                         <button
//                                             onClick={() => handleDelete(week.id)}
//                                             className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
//                                         >
//                                             Delete
//                                         </button>
//                                     </td>
//                                 </tr>
//                             ))
//                         ) : (
//                             <tr>
//                                 <td colSpan="4" className="text-center p-4">
//                                     No weeks found.
//                                 </td>
//                             </tr>
//                         )}
//                     </tbody> */}
//                 </table>
//             </div>

//             <div className="flex justify-center mt-4 space-x-2">
//                 <button
//                     onClick={handlePreviousPage}
//                     className={`px-4 py-2 rounded-lg ${currentPage > 1 ? "bg-blue-500 text-white hover:bg-blue-600" : "bg-gray-300 text-gray-500 cursor-not-allowed"}`}
//                     disabled={currentPage <= 1}
//                 >
//                     Previous
//                 </button>

//                 <span className="px-4 py-2 border rounded-lg bg-white">
//                     Page {currentPage} of {totalPages}
//                 </span>

//                 <button
//                     onClick={handleNextPage}
//                     className={`px-4 py-2 rounded-lg ${currentPage < totalPages ? "bg-blue-500 text-white hover:bg-blue-600" : "bg-gray-300 text-gray-500 cursor-not-allowed"}`}
//                     disabled={currentPage >= totalPages}
//                 >
//                     Next
//                 </button>
//             </div>


//             {isModalOpen && (
//                 <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
//                     <div className="bg-white p-6 rounded-lg shadow-lg w-96">
//                         <h2 className="text-xl font-bold mb-4">Edit Week</h2>
//                         <div className="space-y-4">
//                             <div>
//                                 <label className="block font-medium mb-1">Theme</label>
//                                 <input
//                                     type="text"
//                                     value={updatedTheme}
//                                     onChange={(e) => setUpdatedTheme(e.target.value)}
//                                     className="w-full border rounded-lg p-2 focus:ring focus:ring-blue-300"
//                                     required
//                                 />
//                             </div>

//                             <div>
//                                 <label className="block font-medium mb-1">Start Date</label>
//                                 <input
//                                     type="datetime-local"
//                                     value={updatedDate}
//                                     onChange={(e) => setUpdatedDate(e.target.value)}
//                                     className="w-full border rounded-lg p-2 focus:ring focus:ring-blue-300"
//                                     required
//                                 />
//                             </div>

//                             <div className="flex justify-end gap-2">
//                                 <button
//                                     onClick={() => setIsModalOpen(false)}
//                                     className="bg-gray-400 text-white px-3 py-1 rounded hover:bg-gray-500"
//                                 >
//                                     Cancel
//                                 </button>
//                                 <button
//                                     onClick={handleUpdate}
//                                     className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
//                                 >
//                                     Save
//                                 </button>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// }
