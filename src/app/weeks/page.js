"use client";

import CreateWeek from '../components/weeks/CreateWeek';
import WeeksList from '../components/weeks/GetWeeks';
import Week from '../components/weeks/Week';
import { useRouter } from 'next/navigation';

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
            {/* <CreateWeek />
             */}
            <Week />
            <WeeksList />
        </div>
    );
};

export default Weeks;
