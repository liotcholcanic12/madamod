import React, { useState } from 'react';
import { Box, CssBaseline, AppBar, Toolbar, Typography } from '@mui/material';
import Sidebar from './components/Sidebar';
import GradeSheet from './components/GradeSheet';
import './App.css';

const App: React.FC = () => {
  const [selectedClassId, setSelectedClassId] = useState<number | null>(null);

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <CssBaseline />
      
      {/* App Bar */}
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            🏫 School Task Tracker
          </Typography>
          <Typography variant="body2">
            Summer Program 2024
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Sidebar */}
      <Sidebar onSelectClass={setSelectedClassId} />

      {/* Main Content */}
      <Box component="main" sx={{ flexGrow: 1, p: 3, pt: 8 }}>
        <GradeSheet classId={selectedClassId} />
      </Box>
    </Box>
  );
};

export default App;