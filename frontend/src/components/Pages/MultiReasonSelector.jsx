import React, { useState } from 'react';

const reasonForLeave = [
    "Sick Leave","Casual Leave", "Personal Work", "Maternity Leave", "Family Emergency", 
    "Vacation", "Medical Appointment",
    "Child Care", "Bereavement Leave", "Marriage Leave", "For 1st half", "For 2nd half",
    "For 1", "For 2", "For 3", "For 4", "For 5", "For 6","For 7","For 8","For 9"," 0","Days", "weeks", "Month"
];

const reasonForLeaveLong = [
  "Write a leave request for a one-day medical leave due to high fever",
  "Draft a leave application for urgent family emergency",
  "Generate a half-day leave request due to a doctor appointment",
  "Create a short leave letter for personal work",
  "Compose a letter for child’s annual school meeting"
];

const MultiReasonSelector = ({ selectedReasons, setSelectedReasons }) => {
  const [activeTab, setActiveTab] = useState('Concise');

  const handleReasonToggle = (value) => {
    if (selectedReasons.includes(value)) {
      setSelectedReasons(selectedReasons.filter((r) => r !== value));
    } else {
      setSelectedReasons([...selectedReasons, value]);
    }
  };

  const reasons = activeTab === 'Concise' ? reasonForLeave : reasonForLeaveLong;

  return (
    <div>
      <label className="block mb-1 font-medium">Reason</label>

      {/* Tabs */}
      <div className="flex gap-1 mb-2">
        <button
          className={`px-4 py-1 border rounded-t-lg font-bold ${activeTab === 'Concise' ? 'bg-yellow-300 text-orange-800' : 'bg-white border-b-0'}`}
          onClick={() => setActiveTab('Concise')}
        >
          Concise
        </button>
        <button
          className={`px-4 py-1 border rounded-t-lg font-bold ${activeTab === 'Long' ? 'bg-blue-200 text-red-700' : 'bg-white border-b-0'}`}
          onClick={() => setActiveTab('Long')}
        >
          Long
        </button>
      </div>

      {/* Multi-select options */}
      <div className="border p-3 rounded-md bg-white max-h-40 overflow-y-auto">
        {reasons.map((item, idx) => (
          <label key={idx} className="flex items-center space-x-2 mb-1">
            <input
              type="checkbox"
              value={item}
              checked={selectedReasons.includes(item)}
              onChange={() => handleReasonToggle(item)}
            />
            <span className="text-sm">{item}</span>
          </label>
        ))}
      </div>

      {/* Selected tokens */}
      <div className="mt-3 flex flex-wrap gap-2">
        {selectedReasons.map((item, idx) => (
          <span key={idx} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">
            {item}
          </span>
        ))}
      </div>
    </div>
  );
};

export default MultiReasonSelector;
