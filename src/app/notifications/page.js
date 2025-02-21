"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import withAuth from '../components/auth/withAuth';
import { getLocalStorage } from '../utils/localStorage';

const NotificationsPage = () => {
    const router = useRouter();
    const [formData, setFormData] = useState({
        title: '',
        text: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            const token = getLocalStorage('token');
            const response = await fetch('https://www.talkietotz.com/notifications/send', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                throw new Error('Failed to send notification');
            }

            setSuccess('Notification sent successfully!');
            setFormData({ title: '', text: '' }); // Reset form
        } catch (err) {
            setError(err.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <button
                onClick={() => router.push('/')}
                className="mb-6 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition"
            >
                Back to Dashboard
            </button>

            <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
                <h1 className="text-2xl font-bold mb-6">Send Push Notification</h1>

                {error && (
                    <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">
                        {success}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Notification Title
                        </label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            className="w-full border rounded-lg p-2 focus:ring focus:ring-blue-300"
                            required
                            placeholder="Enter notification title"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Notification Text
                        </label>
                        <textarea
                            name="text"
                            value={formData.text}
                            onChange={handleChange}
                            className="w-full border rounded-lg p-2 focus:ring focus:ring-blue-300 h-32"
                            required
                            placeholder="Enter notification message"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition ${
                            loading ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                    >
                        {loading ? 'Sending...' : 'Send Notification'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default withAuth(NotificationsPage); 