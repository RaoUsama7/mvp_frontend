import { useState, useEffect } from 'react';

const useActivities = () => {
  const [activities, setActivities] = useState([]);
  const [activity, setActivity] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const token =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2N2ExM2IxN2IwMDgxZDI1MjRlNGRlM2MiLCJlbWFpbCI6InJhb3J2cDIwQGdtYWlsLmNvbSIsImlhdCI6MTczODk0MzcxMywiZXhwIjoxNzM5NTQ4NTEzfQ.R4yC3IDUOydD_YiVv9JPSgCC6MB9wX4sAGf-zL-_yNw';

  const fetchActivities = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:4000/activities', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Failed to fetch activities');

      const data = await response.json();
      setActivities(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getActivityById = async (activityId) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `http://localhost:4000/activities/${activityId}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error('Failed to fetch activity');

      const data = await response.json();
      setActivity(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const createActivity = async (activityData) => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch('http://localhost:4000/activities', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(activityData),
      });

      if (!response.ok) throw new Error('Failed to create activity');

      const data = await response.json();
      setSuccess('Activity created successfully!');
      fetchActivities();
      return data;
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateActivity = async (activityId, updatedData) => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch(
        `http://localhost:4000/activities/${activityId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updatedData),
        }
      );

      if (!response.ok) throw new Error('Failed to update activity');

      const data = await response.json();
      setSuccess('Activity updated successfully!');
      fetchActivities();
      return data;
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteActivity = async (activityId) => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch(
        `http://localhost:4000/activities/${activityId}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error('Failed to delete activity');

      setSuccess('Activity deleted successfully!');
      fetchActivities();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  return {
    activities,
    activity,
    loading,
    error,
    success,
    fetchActivities,
    getActivityById,
    createActivity,
    updateActivity,
    deleteActivity,
  };
};

export default useActivities;
