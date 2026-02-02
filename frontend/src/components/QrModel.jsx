import React from 'react';
import QRCode from 'react-qr-code';

const QrModal = ({ open, onClose, qrData,  venName }) => {
  if (!open) return null;

  let parsedData = null;
  try {
    parsedData = JSON.parse(qrData);
  } catch (e) {
    // Keep parsedData null if parsing fails
  }

  return (
    <div className="fixed inset-0 z-40 flex  items-center justify-center bg-black bg-opacity-40">
      <div className="bg-black rounded-lg  w-[60%] max-w-5xl relative shadow-lg">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-red-500 font-bold text-lg hover:text-red-700" >
          ✕
        </button>

        <div className="flex justify-center mb-2 mt-10 gap-4">
          <div className="bg-green-300 px-4 py-3 rounded text-blue-900 text-sm font-medium">
            <h2 className="text-lg font-semibold mb-2">{venName}  
              <span className="font-semibold"> (600001245)</span>
              </h2>
            <div className="mb-10">
              <span className="font-semibold mb-10">Contact 📞 700121452</span>
              </div>
            <div className="flex items-center ">
              <span className="font-semibold">Quotation:</span>
              <span className="ml-2 text-red-500 font-bold">3100002112</span>
              <span className="ml-4 text-blue-500 text-xs">Date 22/05/2025</span>
            </div>

            <div className="flex items-center mb-1">
              <span className="font-semibold">Deadline:</span>
              <span className="ml-4 text-red-500 font-bold">22/05/2025</span>
              <span className="ml-5 text-blue-500 text-xs">Time 18:00:00 PM</span>
            </div>

            <div className="mt-6 text-orange-600 font-semibold">
              
              <p >Contact Mr. Subrata Mukherjee</p>
              <p className="text-xs ml-9 font-bold mt-0 text-orange-500"> 📱7001251254 (10:00–16:00)</p>
            </div>

            <div className="mt-2 text-blue-700 font-semibold">
              <p className="ml-13" >Mr Pravin Singhania</p>
              <p className="ml-9 text-xs font-bold text-blue-500">📱7001245687 (10:00–16:00)</p>
            </div>
          </div>

          <QRCode value={qrData} size={250}
                  bgColor="#ffffff"
                  fgColor="#000000" 
                   level="H"   />
        </div>

        <div className="bg-green-200 p-4 rounded text-xs overflow-auto max-h-[300px] text-blue-700">
          {parsedData && Array.isArray(parsedData) ? (
            <div className="overflow-x-auto">
              <div>
                <button className='sticky  bg-yellow-300 rounded'> Update </button>
              </div>
              <table className="min-w-full   border border-green-400 text-left">
                <thead className="bg-green-300 sticky top-0 z-10">
                  <tr>
                    {Object.keys(parsedData[0]).map((key) => (
                      <th
                        key={key}
                        className="border border-green-400 px-3 py-2 font-semibold text-gray-700"
                      >
                        {key}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {parsedData.map((row, idx) => (
                    <tr key={idx} className="hover:bg-green-100">
                      {Object.values(row).map((value, i) => (
                        <td key={i} className="border border-green-300 px-2 py-1">
                          {value}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <pre className="whitespace-pre-wrap">{qrData}</pre>
          )}
        </div>
      </div>
    </div>
  );
};

export default QrModal;





// import React from 'react';
// import QRCode from 'react-qr-code';

// const QrModal = ({ open, onClose, qrData, venName }) => {
//   if (!open) return null;

//   let parsedData = null;
//   try {
//     parsedData = JSON.parse(qrData);
//   } catch (e) {
//     // Keep parsedData null if parsing fails
//   }

//   return (
//     <div className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-50">
//       <div className="bg-black rounded-lg p-6 w-[55%] max-w-4xl relative shadow-lg">
//         <button
//           onClick={onClose}
//           className="absolute top-2 right-2 text-red-500 font-bold text-lg hover:text-red-700">
//           ✕
//         </button>

//         <div className="flex  justify-center mb-4 gap-3">
//         <div className=" bg-green-300 px-2  w-[45%] rounded text-xl font-semibold text-blue-700 mb-0">  
//         <h2  className='mb-2 ' >{venName}</h2>
        
//           <h1 className='flex '> Quotation
//           <p className='ml-3 text-red-500'> 3100002112 </p>         

//           <p className="ml-1 text-blue-500 font-bold mt-2 text-xs">/22/05/2025</p>
//           </h1>
          
//           <h1 className='flex '> Deadline
//           <p className='ml-5 text-red-500'>22/05/2025 </p>         
//           <p className="ml-1 text-blue-500 font-bold mt-2 text-xs">/ 18:00:00 PM</p>
//           </h1>
          
//           <h1 className='flex mt-10 text-orange-400'> Contact
//           <p className='ml-2 '>Mr Subrata Mukherjee </p>         
//           </h1>
//           <p className="ml-2 text-center text-orange-400  font-bold mt-0 text-xs"> 7001251254 (10:00-16:00)</p>

//           {/* <h1 className='flex mt-1 text-orange-400'> Contact */}
//           <p className='ml-20 mt-2'>Mr Pravin Singhania </p>         
//           <p className="ml-2 text-center text-blue-500 font-bold mt-0 text-xs"> 7001245687 (10:00-16:00)</p>
//           {/* </h1> */}

//         </div>
//           <QRCode value={qrData} size={250} />
//         </div>

//         <div className="bg-green-200 p-4 rounded text-sm overflow-auto max-h-80 text-blue-600">
//           {parsedData && Array.isArray(parsedData) ? (
//             <table className="min-w-full border border-green-200 text-left text-sm">
//               <thead className="bg-green-200">
//                 <tr>
//                   {Object.keys(parsedData[0]).map((key) => (
//                     <th key={key} className="px-3 py-2 border border-green-200">{key}</th>
//                   ))}
//                 </tr>
//               </thead>
//               <tbody>
//                 {parsedData.map((row, idx) => (
//                   <tr key={idx} className="hover:bg-gray-100">
//                     {Object.values(row).map((value, i) => (
//                       <td key={i} className="px-3 py-2 border border-gray-300">{value}</td>
//                     ))}
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           ) : (
//             <pre className="whitespace-pre-wrap">{qrData}</pre>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default QrModal;

