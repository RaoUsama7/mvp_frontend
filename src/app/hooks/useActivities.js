import { useState, useEffect } from "react";
import { getLocalStorage } from "../utils/localStorage";

const useActivities = () => {
  const [activities, setActivities] = useState([]);
  const [activity, setActivity] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    setToken(getLocalStorage("token"));
  }, []);

  const fetchActivities = async () => {
    if (!token) return;
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("https://www.talkietotz.com/activities", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch activities");

      const data = await response.json();
      setActivities(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchActivities();
    }
  }, [token]);

  const getActivityById = async (activityId) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://www.talkietotz.com/activities/${activityId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch activity");

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
      const response = await fetch("https://www.talkietotz.com/activities", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(activityData),
      });

      if (!response.ok) throw new Error("Failed to create activity");

      const data = await response.json();
      setSuccess("Activity created successfully!");
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
        `https://www.talkietotz.com/activities/${activityId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updatedData),
        }
      );

      if (!response.ok) throw new Error("Failed to update activity");

      const data = await response.json();
      setSuccess("Activity updated successfully!");
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
        `https://www.talkietotz.com/activities/${activityId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to delete activity");

      setSuccess("Activity deleted successfully!");
      fetchActivities();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

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
