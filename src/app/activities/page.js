"use client";

import CreateActivity from '../components/activities/CreateActivity';
import GetActivities from '../components/activities/GetActivities';

const ActivitiesPage = () => {
    return (
        <div className="auto">
            <CreateActivity />
            <GetActivities />
        </div>
    );
};

export default ActivitiesPage;
