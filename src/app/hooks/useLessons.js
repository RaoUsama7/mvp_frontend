import { useState, useEffect } from 'react';

const useLessons = () => {
  const [lessons, setLessons] = useState([]);
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const token =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2N2ExM2IxN2IwMDgxZDI1MjRlNGRlM2MiLCJlbWFpbCI6InJhb3J2cDIwQGdtYWlsLmNvbSIsImlhdCI6MTczODk0MzcxMywiZXhwIjoxNzM5NTQ4NTEzfQ.R4yC3IDUOydD_YiVv9JPSgCC6MB9wX4sAGf-zL-_yNw';

  const fetchLessons = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('https://www.talkietotz.com/lessons', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Failed to fetch lessons');

      const data = await response.json();
      setLessons(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getLessonById = async (lessonId) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://www.talkietotz.com/lessons/${lessonId}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error('Failed to fetch lesson');

      const data = await response.json();
      setLesson(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const createLesson = async (lessonData) => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch('https://www.talkietotz.com/lessons', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(lessonData),
      });

      if (!response.ok) throw new Error('Failed to create lesson');

      const data = await response.json();
      setSuccess('Lesson created successfully!');
      fetchLessons();
      return data;
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateLesson = async (lessonId, updatedData) => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch(
        `https://www.talkietotz.com/lessons/${lessonId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updatedData),
        }
      );

      if (!response.ok) throw new Error('Failed to update lesson');

      const data = await response.json();
      setSuccess('Lesson updated successfully!');
      fetchLessons();
      return data;
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteLesson = async (lessonId) => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch(
        `https://www.talkietotz.com/lessons/${lessonId}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error('Failed to delete lesson');

      setSuccess('Lesson deleted successfully!');
      fetchLessons();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLessons();
  }, []);

  return {
    lessons,
    lesson,
    loading,
    error,
    success,
    fetchLessons,
    getLessonById,
    createLesson,
    updateLesson,
    deleteLesson,
  };
};

export default useLessons;
