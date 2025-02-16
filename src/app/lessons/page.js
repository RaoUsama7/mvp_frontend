"use client";

import Lesson from '../components/lessons/Lesson';
import LessonsList from '../components/lessons/GetLessons';
import { useRouter } from 'next/navigation';
import withAuth from '../components/auth/withAuth';

const Lessons = () => {
    const router = useRouter();

    return (
        <div>
            <button
                onClick={() => router.push('/')}
                className="m-4 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition"
            >
                Back to Dashboard
            </button>
            <Lesson />
            <LessonsList />
        </div>
    );
};

export default withAuth(Lessons);
