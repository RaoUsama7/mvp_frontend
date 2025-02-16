"use client";

import Week from '../components/weeks/Week';
import WeeksList from '../components/weeks/GetWeeks';
import { useRouter } from 'next/navigation';
import withAuth from '../components/auth/withAuth';

const Weeks = () => {
    const router = useRouter();

    return (
        <div>
            <button
                onClick={() => router.push('/')}
                className="m-4 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition"
            >
                Back to Dashboard
            </button>
            <Week />
            <WeeksList />
        </div>
    );
};

export default withAuth(Weeks);
