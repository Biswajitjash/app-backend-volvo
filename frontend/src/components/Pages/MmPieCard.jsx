import React from 'react';

const MmPieCard = ({ data, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white rounded-2xl p-6 shadow-lg w-[300px]">
        <h2 className="text-xl font-semibold mb-2">Procurement Order Info</h2>
        <p><strong>Value Type:</strong> {data.name}</p>
        <p><strong>Value:</strong> {data.value}</p>
        <button
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default MmPieCard;
