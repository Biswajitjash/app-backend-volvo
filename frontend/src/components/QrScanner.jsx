import React, { useEffect, useRef } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';

const QrScannerModal = ({ isOpen, onClose, onScan }) => {
  const scannerRef = useRef(null);

  useEffect(() => {
    if (isOpen && scannerRef.current) {
      const scanner = new Html5QrcodeScanner('qr-scanner', {
        fps: 10,
        qrbox: 180,
      });

      scanner.render(
        (decodedText) => {
          onScan(decodedText);
          scanner.clear().then(() => onClose());
        },
        (error) => {
          console.warn("QR error:", error);
        }
      );

      return () => {
        scanner.clear().catch(err => console.error("Clear error:", err));
      };
    }
  }, [isOpen, onClose, onScan]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-white p-4 rounded shadow-lg w-full max-w-md">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-semibold">Scan QR Code</h2>
          <button onClick={onClose} className="text-red-600 font-bold">✖</button>
        </div>
        <div id="qr-scanner" ref={scannerRef} />
      </div>
    </div>
  );
};

export default QrScannerModal;
