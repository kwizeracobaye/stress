import React from 'react';
import { MovementData } from '../../types/movement';
import { useMovements } from '../../hooks/useMovements';
import { InfoDisplay } from './InfoDisplay';
import { InputForm } from './InputForm';
import { Toast } from '../Toast';

interface Props {
  day: string;
}

export function DayMovements({ day }: Props) {
  const { movements, loading, error, addMovement, editMovement, removeMovement } = useMovements(day);
  const [editingMovement, setEditingMovement] = React.useState<MovementData | null>(null);
  const [toast, setToast] = React.useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const handleSubmit = async (data: Omit<MovementData, 'id'> & { id?: string }) => {
    let success;
    if (data.id) {
      success = await editMovement(data.id, data);
      if (success) {
        setEditingMovement(null);
        showToast('Movement updated successfully', 'success');
      } else {
        showToast('Failed to update movement', 'error');
      }
    } else {
      success = await addMovement(data);
      if (success) {
        showToast('Movement added successfully', 'success');
      } else {
        showToast('Failed to add movement', 'error');
      }
    }
  };

  const handleDelete = async (id: string) => {
    const success = await removeMovement(id);
    if (success) {
      showToast('Movement deleted successfully', 'success');
    } else {
      showToast('Failed to delete movement', 'error');
    }
  };

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  if (loading) {
    return <div className="text-center py-4">Loading movements...</div>;
  }

  if (error) {
    return <div className="text-red-600 text-center py-4">{error}</div>;
  }

  return (
    <div className="space-y-6">
      {editingMovement ? (
        <div>
          <h3 className="text-lg font-medium mb-4">Edit Movement</h3>
          <InputForm
            onSubmit={handleSubmit}
            editData={editingMovement}
            existingMovements={movements}
            onCancel={() => setEditingMovement(null)}
          />
        </div>
      ) : (
        <div>
          <h3 className="text-lg font-medium mb-4">Add New Movement</h3>
          <InputForm
            onSubmit={handleSubmit}
            existingMovements={movements}
          />
        </div>
      )}

      <div>
        <h3 className="text-lg font-medium mb-4">Current Movements</h3>
        <InfoDisplay
          info={movements}
          onEdit={setEditingMovement}
          onDelete={handleDelete}
        />
      </div>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}