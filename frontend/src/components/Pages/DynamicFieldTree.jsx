import React from "react";
import  { TreeView, TreeItem }  from "@mui/lab";

// import { TreeView } from '@mui/x-tree-view/TreeView';
// import { TreeItem } from '@mui/x-tree-view/TreeItem';

import { Checkbox, FormControlLabel } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

const DynamicFieldTree = ({ fields, checkedFields, onCheckChange }) => {

  const handleToggle = (fieldId) => {
    const updatedFields = checkedFields.includes(fieldId)
      ? checkedFields.filter((id) => id !== fieldId)
      : [...checkedFields, fieldId];
    onCheckChange(updatedFields);
  };

  const renderTreeItems = (nodes) =>
    nodes.map((node) => ( 
      <TreeItem
        key={node.id}
        nodeId={node.id}
        label={
          node.children ? (
            node.label
          ) : (
            <FormControlLabel
              control={
                <Checkbox
                  checked={checkedFields.includes(node.id)}
                  onChange={() => handleToggle(node.id)}
                  onClick={(e) => e.stopPropagation()}
                />
              }
              label={node.label}
            />
          )
        }
      >
        {node.children ? renderTreeItems(node.children) : null}
      </TreeItem>
    ));

  return (
    <TreeView
      defaultCollapseIcon={<ExpandMoreIcon />}
      defaultExpandIcon={<ChevronRightIcon />}
      sx={{
        flexGrow: 1,
        overflowY: "auto",
        maxHeight: 400,
        border: "1px solid #ccc",
        borderRadius: 2,
        p: 1,
      }}
    >
      {renderTreeItems(fields)}
    </TreeView>
  );
};

export default DynamicFieldTree;































// import React from 'react';
// import {TreeItem} from '@mui/x-tree-view';
// import { TreeView } from '@mui/lab';
// import { Checkbox, FormControlLabel } from '@mui/material';
// import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
// import ChevronRightIcon from '@mui/icons-material/ChevronRight';

// const DynamicFieldTree = ({ fields, checkedFields, onCheckChange }) => {

//   const handleToggle = (fieldId) => {
//     let updatedFields;
//     if (checkedFields.includes(fieldId)) {
//       updatedFields = checkedFields.filter(id => id !== fieldId);
//     } else {
//       updatedFields = [...checkedFields, fieldId];
//     }
//     onCheckChange(updatedFields);
//   };

//   const renderTreeItems = (nodes) =>
//     nodes.map((node) => {
//       if (node.children) {
//         return (
//           <TreeItem key={node.id} nodeId={node.id} label={node.label}>
//             {renderTreeItems(node.children)}
//           </TreeItem>
//         );
//       }

//       return (
//         <TreeItem
//           key={node.id}
//           nodeId={node.id}
//           label={
//             <FormControlLabel
//               control={
//                 <Checkbox
//                   checked={checkedFields.includes(node.id)}
//                   onChange={() => handleToggle(node.id)}
//                   onClick={(e) => e.stopPropagation()}
//                 />
//               }
//               label={node.label}
//             />
//           }
//         />
//       );
//     });

//   return (
//     <TreeView
//       defaultCollapseIcon={<ExpandMoreIcon />}
//       defaultExpandIcon={<ChevronRightIcon />}
//       sx={{ flexGrow: 1, overflowY: 'auto', maxHeight: 300, border: '1px solid #ccc', p: 1, borderRadius: 2 }}
//     >
//       {renderTreeItems(fields)}
//     </TreeView>
//   );
// };

// export default DynamicFieldTree;







////////////////////////////////////////////////////////////////////////////////////////////
// import * as React from 'react';
// import { TreeItem } from '@mui/lab';
// import { TreeView } from '@mui/lab'; // use lab version if @mui/x-tree-view fails
// // import { TreeItem } from '@mui/x-tree-view/TreeItem';
// import Checkbox from '@mui/material/Checkbox';
// import { Box } from '@mui/material';
// import { ExpandMore, ChevronRight } from '@mui/icons-material';

// const DynamicFieldTree = ({ fields = [], checkedFields = [], onCheckChange }) => {
//   const handleToggle = (field) => {
//     const isChecked = checkedFields.includes(field);
//     const updated = isChecked
//       ? checkedFields.filter(f => f !== field)
//       : [...checkedFields, field];

//     onCheckChange?.(updated);
//   };

//   const renderTreeItems = (data) =>
//     data.map((node) => (
//       <TreeItem
//         key={node.id}
//         nodeId={node.id}
//         label={
//           <Box sx={{ display: 'flex', alignItems: 'center' }}>
//             {node.children ? null : (
//               <Checkbox
//                 size="small"
//                 checked={checkedFields.includes(node.id)}
//                 onChange={() => handleToggle(node.id)}
//                 sx={{ mr: 1 }}
//               />
//             )}
//             {node.label}
//           </Box>
//         }
//       >
//         {Array.isArray(node.children) ? renderTreeItems(node.children) : null}
//       </TreeItem>
//     ));

//   return (
//     <TreeView
//       defaultCollapseIcon={<ExpandMore />}
//       defaultExpandIcon={<ChevronRight />}
//       sx={{ flexGrow: 1, overflowY: 'auto', maxHeight: 300, mt: 1 }}
//     >
//       {renderTreeItems(fields)}
//     </TreeView>
//   );
// };

// export default DynamicFieldTree;
