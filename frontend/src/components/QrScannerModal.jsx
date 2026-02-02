import React, { useState } from 'react';
import QrReader from 'react-qr-reader';

export default function QrScannerModal({ isOpen, onClose, onScan }) {
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-4 py-2 border-b flex justify-between items-center">
          <h3 className="text-lg font-semibold">Scan QR Code</h3>
          <button onClick={onClose} className="text-xl leading-none">&times;</button>
        </div>

        {/* Body */}
        <div className="p-4 flex-1">
          <QrReader
            delay={300}
            onError={(err) => setError(err.message)}
            onScan={(data) => {
              if (data) {
                onScan(data);
                onClose();
              }
            }}
            style={{ width: '100%' }}
          />
          {error && <p className="mt-2 text-red-600">Error: {error}</p>}
        </div>

        {/* Footer */}
        <div className="px-4 py-2 border-t text-right">
          <button
            onClick={onClose}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-1 rounded"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
