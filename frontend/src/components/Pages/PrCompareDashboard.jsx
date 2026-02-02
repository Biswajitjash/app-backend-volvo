import React, { useMemo } from "react";
import {
  Box,
  Card,
  CardContent,
  Tabs,
  Tab,
  Typography,
} from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const Data = [
  { name: "Vendor A", value: 2400 },
  { name: "Vendor B", value: 1398 },
  { name: "Vendor C", value: 9800 },
];

const PrCompareDashboard = () => {
  const [tabIndex, setTabIndex] = React.useState(0);

  const groupedData = useMemo(() => {
    // You can replace this with your own logic to group your actual data
    return {
      Open: Data,
      Closed: Data,
    };
  }, []);

  const tabs = Object.keys(groupedData);

  return (
    <Box sx={{ p: 3 }}>
      <Card variant="outlined">
        <CardContent>
          <Typography variant="h6" gutterBottom>
            PR Comparison Dashboard
          </Typography>

          <Tabs
            value={tabIndex}
            onChange={(e, newIndex) => setTabIndex(newIndex)}
            variant="scrollable"
            scrollButtons="auto"
          >
            {tabs.map((tab, idx) => (
              <Tab key={tab} label={tab} />
            ))}
          </Tabs>

          {tabs.map((tab, idx) => (
            tabIndex === idx && (
              <Box key={tab} sx={{ mt: 4 }}>
                <Typography variant="subtitle1" gutterBottom>
                  {tab} Data
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={groupedData[tab]}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            )
          ))}
        </CardContent>
      </Card>
    </Box>
  );
};

export default PrCompareDashboard;
