"use client";

import CreateActivity from '../components/activities/CreateActivity';
import GetActivities from '../components/activities/GetActivities';
import { useRouter } from 'next/navigation';

const ActivitiesPage = () => {
    const router = useRouter();

    return (
        <div className="auto">
            <button
                onClick={() => router.push('/')}
                className="m-4 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition"
            >
                Back to Dashboard
            </button>
            <CreateActivity />
            <GetActivities />
        </div>
    );
};

export default ActivitiesPage;
