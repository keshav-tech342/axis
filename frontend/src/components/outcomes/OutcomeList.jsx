import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOutcomes } from '../../store/outcomeSlice';
import OutcomeCard from './OutcomeCard';
import { Loader2 } from 'lucide-react';

const OutcomeList = ({ departmentId, onViewOutcome, onUpdateOutcome, onDeleteOutcome }) => {
  const dispatch = useDispatch();
  const { outcomes, loading, error } = useSelector((state) => state.outcomes);

  useEffect(() => {
    const filters = { include_signals: true };
    if (departmentId) filters.department_id = departmentId;
    
    dispatch(fetchOutcomes(filters));
  }, [dispatch, departmentId]);

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
        {error.message || 'Failed to load outcomes'}
      </div>
    );
  }

  if (outcomes.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400 mb-2">No outcomes found</p>
        <p className="text-sm text-gray-500">Create your first outcome to start tracking</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {outcomes.map((outcome) => (
        <OutcomeCard
          key={outcome.id}
          outcome={outcome}
          onView={onViewOutcome}
          onUpdate={onUpdateOutcome}
          onDelete={onDeleteOutcome}
        />
      ))}
    </div>
  );
};

export default OutcomeList;