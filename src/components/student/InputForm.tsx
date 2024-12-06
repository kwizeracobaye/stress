import React from 'react';
import { Bus, Users, AlertTriangle } from 'lucide-react';
import { MovementData } from '../../types/movement';
import { ClassInfo } from '../../types/class';
import { BusInfo } from '../../types/bus';
import { getClasses } from '../../utils/class-storage';
import { getBuses } from '../../utils/bus-storage';

interface Props {
  onSubmit: (data: MovementFormData) => void;
  editData?: MovementData;
  selectedClass?: ClassInfo;
  selectedBus?: BusInfo;
  existingMovements: MovementData[];
  onCancel?: () => void;
}

interface MovementFormData {
  id?: string;
  day: string;
  busType: string;
  capacity: number;
  className: string;
  classSize: number;
  inCharge: string;
  inChargePhone: string;
}

export function InputForm({ onSubmit, editData, selectedClass, selectedBus, existingMovements, onCancel }: Props) {
  const [formData, setFormData] = React.useState<MovementFormData>(() => ({
    day: editData?.day || '',
    busType: editData?.busType || selectedBus?.type || '',
    capacity: editData?.capacity || selectedBus?.capacity || 0,
    className: editData?.className || selectedClass?.name || '',
    classSize: editData?.classSize || selectedClass?.size || 0,
    inCharge: editData?.inCharge || '',
    inChargePhone: editData?.inChargePhone || '',
  }));

  const classes = getClasses();
  const buses = getBuses();

  const [capacityError, setCapacityError] = React.useState<string>('');

  React.useEffect(() => {
    if (selectedClass) {
      setFormData(prev => ({
        ...prev,
        className: selectedClass.name,
        classSize: selectedClass.size
      }));
    }
  }, [selectedClass]);

  React.useEffect(() => {
    if (selectedBus) {
      setFormData(prev => ({
        ...prev,
        busType: selectedBus.type,
        capacity: selectedBus.capacity
      }));
    }
  }, [selectedBus]);

  const validateCapacity = (day: string, classSize: number) => {
    const dayMovements = existingMovements
      .filter(m => m.day === day && (!editData || m.id !== editData.id));
    const totalStudents = dayMovements.reduce((sum, m) => sum + m.classSize, 0) + classSize;
    const totalBusCapacity = buses.reduce((sum, b) => sum + b.capacity, 0);

    if (totalStudents > totalBusCapacity) {
      setCapacityError(`Warning: This will exceed the total bus capacity for ${day} by ${totalStudents - totalBusCapacity} students`);
      return false;
    }

    setCapacityError('');
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateCapacity(formData.day, formData.classSize)) {
      onSubmit(editData?.id ? { ...formData, id: editData.id } : formData);
    }
  };

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Day</label>
          <select
            required
            value={formData.day}
            onChange={(e) => {
              const newDay = e.target.value;
              setFormData({ ...formData, day: newDay });
              if (formData.classSize) {
                validateCapacity(newDay, formData.classSize);
              }
            }}
            className="mt-1 block w-full rounded-md border-gray-300"
          >
            <option value="">Select day</option>
            {days.map(day => (
              <option key={day} value={day}>{day}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Class Name</label>
          <select
            required
            value={formData.className}
            onChange={(e) => {
              const selectedClass = classes.find(c => c.name === e.target.value);
              const newSize = selectedClass?.size || 0;
              setFormData({
                ...formData,
                className: e.target.value,
                classSize: newSize
              });
              if (formData.day) {
                validateCapacity(formData.day, newSize);
              }
            }}
            className="mt-1 block w-full rounded-md border-gray-300"
          >
            <option value="">Select class</option>
            {classes.map(c => (
              <option key={c.id} value={c.name}>
                {c.name} ({c.size} students)
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Bus Type</label>
          <div className="mt-1 relative">
            <select
              required
              value={formData.busType}
              onChange={(e) => {
                const selectedBus = buses.find(b => b.type === e.target.value);
                setFormData({
                  ...formData,
                  busType: e.target.value,
                  capacity: selectedBus?.capacity || 0
                });
              }}
              className="block w-full rounded-md border-gray-300"
            >
              <option value="">Select type</option>
              {buses.map(bus => (
                <option key={bus.id} value={bus.type}>
                  {bus.type} (Capacity: {bus.capacity})
                </option>
              ))}
            </select>
            <Bus className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Class Size</label>
          <div className="mt-1 relative">
            <input
              type="number"
              required
              value={formData.classSize}
              readOnly
              className="block w-full rounded-md border-gray-300 bg-gray-50"
            />
            <Users className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Lecturer in Charge</label>
          <input
            type="text"
            required
            value={formData.inCharge}
            onChange={(e) => setFormData({ ...formData, inCharge: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Phone Number</label>
          <input
            type="tel"
            required
            pattern="[0-9+\s-]+"
            value={formData.inChargePhone}
            onChange={(e) => setFormData({ ...formData, inChargePhone: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300"
            placeholder="+250 7XX XXX XXX"
          />
        </div>
      </div>

      {capacityError && (
        <div className="flex items-center p-3 bg-yellow-50 rounded-md text-yellow-800">
          <AlertTriangle className="w-5 h-5 mr-2 text-yellow-500" />
          {capacityError}
        </div>
      )}

      <div className="flex justify-end space-x-3">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
        >
          {editData ? 'Update Movement' : 'Add Movement'}
        </button>
      </div>
    </form>
  );
}