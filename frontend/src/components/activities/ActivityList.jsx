import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchActivities } from '../../store/activitySlice';
import ActivityCard from './ActivityCard';
import { Loader2 } from 'lucide-react';

const ActivityList = ({ departmentId, status, limit }) => {
  const dispatch = useDispatch();
  const { activities, loading, error } = useSelector((state) => state.activities);

  useEffect(() => {
    const filters = {};
    if (departmentId) filters.department_id = departmentId;
    if (status) filters.status = status;
    
    dispatch(fetchActivities(filters));
  }, [dispatch, departmentId, status]);

  const handleActivityExecuted = () => {
    // Refresh activities after execution
    const filters = {};
    if (departmentId) filters.department_id = departmentId;
    if (status) filters.status = status;
    dispatch(fetchActivities(filters));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-4 text-red-200">
        {error.message || 'Failed to load activities'}
      </div>
    );
  }

  const displayActivities = limit ? activities.slice(0, limit) : activities;

  if (displayActivities.length === 0) {
    return (
      <div className="text-center py-12 text-gray-400">
        No activities found
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {displayActivities.map((activity) => (
        <ActivityCard
          key={activity.id}
          activity={activity}
          onExecute={handleActivityExecuted}
        />
      ))}
    </div>
  );
};

export default ActivityList;