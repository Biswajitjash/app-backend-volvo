import React from "react";
import { Modal, Box, Typography, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import PrCustomTree from "./PrCustomTree"; // This is the recursive tree component

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "80%",
  maxHeight: "80vh",
  overflowY: "auto",
  bgcolor: "background.paper",
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
};

const PrShowRowModal = ({ open, onClose, clickedRow }) => {

console.log("selectdrow_1" , [clickedRow]);


const rowData = [
  {
    site_plant: '3102',
    matnr: 'CEMENT123',
    banfn: '10000123',
    bnfpo: '0010',
    Status: 'OPEN',
    OrdQty: 100,
    creationdate: '2025-07-23',
    Supplied: 'YES',
    afnam: 'Biswajit'
  },
   {
    site_plant: '3103',
    matnr: 'CEMENT123',
    banfn: '10000124',
    bnfpo: '0010',
    Status: 'CLOSE',
    OrdQty: 25,
    creationdate: '2025-07-23',
    Supplied: 'YES',
    afnam: 'Subrata'
  },
   {
    site_plant: '3106',
    matnr: 'CEMENT4444',
    banfn: '10000145',
    bnfpo: '0020',
    Status: 'URGENT',
    OrdQty: 5,
    creationdate: '2025-07-20',
    Supplied: 'NO',
    afnam: 'Tanmoy'
  }
];

const selectedRows = rowData ;
// const selectedRows = clickedRow ? [clickedRow] : [];



console.log("selectddata", selectedRows);
// console.log("rowdata", rowData);

//   const TreeField = [
//   {
//     id: 'general',
//     label: 'Basic Info',
//     children: [
//       { id: 'banfn', label: 'Requisition No' },
//       { id: 'creationdate', label: 'Created On' },
//       { id: 'bnfpo', label: 'Item No' },
//       { id: 'Status', label: 'Status' },
//     ],
//   },
//   {
//     id: 'status',
//     label: 'Material Info',
//     children: [
//       { id: 'matnr', label: 'Material No' },
//       { id: 'OrdQty', label: 'Ordered Qty' },
//     ],
//   },
//   {
//     id: 'status2',
//     label: 'Other Info',
//     children: [
//       { id: 'site_plant', label: 'Plant' },
//       { id: 'Supplied', label: 'Supplied' },
//       { id: 'afnam', label: 'Requester' },
//     ],
//   },
// ];

  
return (
    <Modal open={open} onClose={onClose}>
      <Box sx={modalStyle}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6">Selected Row Tree View</Typography>
          <IconButton onClick={onClose}><CloseIcon /></IconButton>
        </Box>

        {selectedRows?.length > 0 ? (

        <PrCustomTree
      data={selectedRows}

      treeFields={[
    { id: 'site_plant', label: 'Site PR No' },
    { id: 'matnr', label: 'Material No' },
    { id: 'Status', label: 'Status' },
    { id: 'Supplied', label: 'Sup_Plant' }
  ]}

  // treeFields={TreeField}
  // treeFields={[
  //     { id: 'site_plant', label: 'Site PR No' },
  //     { id: 'matnr', label: 'Material No' },
  //     { id: 'Status', label: 'Status' }
  // ]}

  // treeFields={['site_plant', 'matnr', 'Status']}
      />

        
        ) : (
          <Typography>No data selected.</Typography>
        )}
      </Box>
    </Modal>
  );
};

export default PrShowRowModal;








// import React, { useState, useEffect } from 'react';
// import DynamicFieldTree from './DynamicFieldTree';
// import PrCustomTree from './PrCustomTree';
// import {
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Button,
//   Typography,
//   Box,
// } from '@mui/material';

// // Grouped field options
// const TreeField = [
//   {
//     id: 'general',
//     label: 'Basic Info',
//     children: [
//       { id: 'banfn', label: 'Requisition No' },
//       { id: 'creationdate', label: 'Created On' },
//       { id: 'bnfpo', label: 'Item No' },
//       { id: 'Status', label: 'Status' },
//     ],
//   },
//   {
//     id: 'status',
//     label: 'Material Info',
//     children: [
//       { id: 'matnr', label: 'Material No' },
//       { id: 'OrdQty', label: 'Ordered Qty' },
//     ],
//   },
//   {
//     id: 'status2',
//     label: 'Other Info',
//     children: [
//       { id: 'site_plant', label: 'Plant' },
//       { id: 'Supplied', label: 'Supplied' },
//       { id: 'afnam', label: 'Requester' },
//     ],
//   },
// ];

// const DEFAULT_FIELDS = [
//   'banfn',
//   'bnfpo',
//   'Status',
//   'matnr',
//   'OrdQty',
//   'creationdate',
//   'site_plant',
//   'Supplied',
//   'afnam',
// ];

// const PrShowRowModal = ({ open, onClose, rowData = {} }) => {
//   const [selectedFields, setSelectedFields] = useState(DEFAULT_FIELDS);

//   useEffect(() => {
//     if (open) {
//       setSelectedFields(DEFAULT_FIELDS); // Reset to default when modal opens
//     }
//   }, [open]);

//   const handleFieldToggle = (updatedFields) => {
//     setSelectedFields(updatedFields);
//   };

//   const handleSaveDefault = () => {
//     alert('✅ Default fields saved (this is a demo placeholder)');
//     // In production: Save to localStorage or backend
//   };






//   return (
//     <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
//       <DialogTitle align="center" sx={{ color: '#1d4ed8' }}>
//         Selected Row Details
//       </DialogTitle>

//       <DialogContent dividers>
//         <Typography sx={{ mb: 1 }}>✅ Select Fields to Display:</Typography>

//         {/* Tree-based field selector */}
//         <DynamicFieldTree
//           fields={TreeField}
//           checkedFields={selectedFields}
//           onCheckChange={handleFieldToggle}
//         />

//         <Box sx={{ mt: 2 }}>
//           <Typography fontWeight="bold">📌 Selected Data:</Typography>
//           {selectedFields.map((key) => {
//             if (key.startsWith('__')) return null; // Hide metadata/sensitive
//             return (
//               <Box key={key} sx={{ py: 0.5 }}>
//                 <strong>{key}:</strong> {String(rowData?.[key] ?? '')}
//               </Box>
//             );
//           })}
//         </Box>
//       </DialogContent>

//       <DialogActions>
//         <Button variant="contained" onClick={handleSaveDefault}>
//           Save as Default
//         </Button>
//         <Button variant="contained" color="error" onClick={onClose}>
//           Close
//         </Button>
//       </DialogActions>
//     </Dialog>
//   );
// };

// export default PrShowRowModal;


























// import React, { useState, useEffect } from 'react';
// import DynamicFieldTree from './DynamicFieldTree';
// import {
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Button,
//   Typography,
//   Box,
// } from '@mui/material';

// // Field structure grouped by category
// const TreeField = [
//   {
//     id: 'general',
//     label: 'Basic Info',
//     children: [
//       { id: 'banfn', label: 'Requisition No' },
//       { id: 'creationdate', label: 'Created On' },
//       { id: 'bnfpo', label: 'Item No' },
//       { id: 'Status', label: 'Status' },
//     ],
//   },
//   {
//     id: 'status',
//     label: 'Material Info',
//     children: [
//       { id: 'matnr', label: 'Material No' },
//       { id: 'OrdQty', label: 'Ordered Qty' },
//     ],
//   },
//   {
//     id: 'status2',
//     label: 'Other Info',
//     children: [
//       { id: 'site_plant', label: 'Plant' },
//       { id: 'Supplied', label: 'Supplied' },
//       { id: 'afnam', label: 'Requester' },
//     ],
//   },
// ];

// // You can persist these defaults later in localStorage or backend
// const DEFAULT_FIELDS = [
//   'banfn',
//   'bnfpo',
//   'Status',
//   'matnr',
//   'OrdQty',
//   'creationdate',
//   'site_plant',
//   'Supplied',
//   'afnam',
// ];

// const PrShowRowModal = ({ open, onClose, rowData = {} }) => {
//   const [selectedFields, setSelectedFields] = useState(DEFAULT_FIELDS);

//   useEffect(() => {
//     if (open) {
//       setSelectedFields(DEFAULT_FIELDS); // Reset to default when modal opens
//     }
//   }, [open]);

//   const handleFieldToggle = (updatedFields) => {
//     setSelectedFields(updatedFields);
//   };

//   const handleSaveDefault = () => {
//     alert('✅ Default fields saved (dummy)');
//     // You can add real saving logic here (localStorage / backend)
//   };

//   return (
//     <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
//       <DialogTitle align="center" sx={{ color: '#1d4ed8' }}>
//         Selected Row Details
//       </DialogTitle>

//       <DialogContent dividers>
//         <Typography sx={{ mb: 1  }}>✅ Select Fields to Display:</Typography>

//         <DynamicFieldTree
//           fields={TreeField}
//           checkedFields={selectedFields}
//           onCheckChange={handleFieldToggle}
//         />

//         <Box sx={{ mt: 1  }}>
//           {selectedFields.map((key) => {
//             if (key === '__metadata') return null; // Hide sensitive field
//             const value = rowData?.[key];
//             return (
//               <Box  key={key} sx={{ py: 0.5 }}>
//                 {key}: {String(value ?? '')}
//               </Box>
//             );
//           })}
//         </Box>
        
//       </DialogContent>

//       <DialogActions>
//         <Button variant="contained" onClick={handleSaveDefault}>
//           Save as Default
//         </Button>
//         <Button variant="contained" color="error" onClick={onClose}>
//           Close
//         </Button>
//       </DialogActions>
//     </Dialog>
//   );
// };

// export default PrShowRowModal;






















// import React, { useState } from 'react';
// import DynamicFieldTree from './DynamicFieldTree';
// import {
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Button,
//   Typography,
//   Box,
// } from '@mui/material';

// const TreeField = [
//   {
//     id: 'general',
//     label: 'Basic Info',
//     children: [
//       { id: 'banfn', label: 'Requisition No' },
//       { id: 'creationdate', label: 'Created On' },
//       { id: 'bnfpo', label: 'Item No' },
//       { id: 'Status', label: 'Status' },
//     ],
//   },
//   {
//     id: 'status',
//     label: 'Material Info',
//     children: [
//       { id: 'matnr', label: 'Material No' },
//       { id: 'OrdQty', label: 'Ordered Qty' },
//     ],
//   },
//   {
//     id: 'status2',
//     label: 'Other Info',
//     children: [
//       { id: 'site_plant', label: 'Plant' },
//       { id: 'Supplied', label: 'Supplied' },
//       { id: 'afnam', label: 'Requester' },
//     ],
//   },
// ];

// const PrShowRowModal = ({ open, onClose, rowData }) => {
//   const [selectedFields, setSelectedFields] = useState([
//     'banfn',
//     'bnfpo',
//     'Status',
//     'matnr',
//     'OrdQty',
//     'creationdate',
//     'site_plant',
//     'Supplied',
//     'afnam',
//   ]);

//   const handleFieldToggle = (updatedFields) => {
//     setSelectedFields(updatedFields);
//   };

//   return (
//     <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
//       <DialogTitle align="center" style={{ color: '#1d4ed8' }}>
//         Selected Row Details
//       </DialogTitle>

//       <DialogContent>
//         <Typography sx={{ mb: 1 }}>Select Fields to Display:</Typography>

//         <DynamicFieldTree
//           fields={TreeField }
//           checkedFields={selectedFields}
//           onCheckChange={handleFieldToggle}
//         />

//         <Box sx={{ mt: 3 }}>
//           {selectedFields.map((key) => (
//             <Box key={key} sx={{ py: 0.5 }}>
//               <strong>{key}</strong>: {String(rowData?.[key] || '')}
//             </Box>
//           ))}
//         </Box>
//       </DialogContent>

      

//       <DialogActions>
//         <Button variant="contained" color="primary" onClick={() => alert('Saved!')}>
//           Save as Default
//         </Button>
//         <Button variant="contained" color="error" onClick={onClose}>
//           Close
//         </Button>
//       </DialogActions>
//     </Dialog>
//   );
// };

// export default PrShowRowModal;
