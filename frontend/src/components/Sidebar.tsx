import React, { useState, useEffect } from 'react';
import { List, ListItem, ListItemText, Paper, Typography, Button, Alert } from '@mui/material';
import { getClasses, createClass } from '../services/api';

interface Class {
  id: number;
  name: string;
  year: string;
  is_active: boolean;
}

const Sidebar: React.FC<{ onSelectClass: (classId: number) => void }> = ({ onSelectClass }) => {
  const [classes, setClasses] = useState<Class[]>([]);
  const [newClassName, setNewClassName] = useState('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadClasses();
  }, []);

  const loadClasses = async () => {
    setLoading(true);
    setError('');
    console.log('Attempting to load classes...');
    
    try {
      console.log('API call: GET /classes/');
      const response = await getClasses();
      console.log('Classes loaded:', response.data);
      setClasses(response.data);
    } catch (error: any) {
      console.error('Full error details:', error);
      setError(`Failed to load classes: ${error.message}`);
      if (error.response) {
        console.error('Response error:', error.response.data);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAddClass = async () => {
    if (!newClassName.trim()) return;
    
    setError('');
    try {
      console.log('Creating class:', newClassName);
      const result = await createClass({ name: newClassName, year: '2024' });
      console.log('Class created successfully:', result.data);
      setNewClassName('');
      loadClasses();
    } catch (error: any) {
      console.error('Error creating class:', error);
      setError(`Failed to create class: ${error.message}`);
    }
  };

  return (
    <Paper 
      sx={{ 
        width: 280, 
        height: '100vh', 
        padding: 2, 
        backgroundColor: '#1976d2',
        color: 'white',
        borderRadius: 0,
        overflow: 'auto'
      }}
    >
      <Typography variant="h6" sx={{ mb: 3, color: 'white' }}>
        📚 Classes
      </Typography>
      
      {/* Debug info */}
      <div style={{ fontSize: '12px', marginBottom: '10px', backgroundColor: 'rgba(0,0,0,0.2)', padding: '8px', borderRadius: '4px' }}>
        <div>Backend: organic-train-579pv9wr6pj346gg-8000.app.github.dev</div>
        <div>Frontend: organic-train-579pv9wr6pj346gg-5173.app.github.dev</div>
        <div>Status: {loading ? 'Loading...' : 'Ready'}</div>
      </div>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      <div style={{ marginBottom: 20 }}>
        <input
          type="text"
          value={newClassName}
          onChange={(e) => setNewClassName(e.target.value)}
          placeholder="New class name"
          style={{
            width: '100%',
            padding: '8px',
            marginBottom: '8px',
            borderRadius: '4px',
            border: '1px solid #fff'
          }}
        />
        <Button 
          variant="contained" 
          onClick={handleAddClass}
          sx={{ 
            backgroundColor: 'white', 
            color: '#1976d2',
            '&:hover': { backgroundColor: '#f5f5f5' }
          }}
          fullWidth
          disabled={loading}
        >
          {loading ? 'Adding...' : 'Add Class'}
        </Button>
      </div>

      <Button 
        variant="outlined" 
        onClick={loadClasses}
        sx={{ 
          borderColor: 'white', 
          color: 'white',
          mb: 2
        }}
        fullWidth
        disabled={loading}
      >
        Refresh Classes
      </Button>

      <Typography variant="subtitle2" sx={{ mb: 1, color: 'rgba(255,255,255,0.8)' }}>
        Total Classes: {classes.length}
      </Typography>

      <List>
        {classes.map((classItem) => (
          <ListItem 
            key={classItem.id}
            onClick={() => onSelectClass(classItem.id)}
            sx={{
              mb: 1,
              borderRadius: 1,
              backgroundColor: 'rgba(255,255,255,0.1)',
              '&:hover': { 
                backgroundColor: 'rgba(255,255,255,0.2)',
                cursor: 'pointer'
              }
            }}
          >
            <ListItemText 
              primary={classItem.name} 
              secondary={`Year: ${classItem.year}`}
              primaryTypographyProps={{ color: 'white' }}
              secondaryTypographyProps={{ color: 'rgba(255,255,255,0.7)' }}
            />
          </ListItem>
        ))}
        
        {classes.length === 0 && !loading && !error && (
          <ListItem>
            <ListItemText 
              primary="No classes yet" 
              secondary="Click 'Add Class' to create one"
              primaryTypographyProps={{ color: 'rgba(255,255,255,0.7)', fontStyle: 'italic' }}
            />
          </ListItem>
        )}
      </List>
    </Paper>
  );
};

export default Sidebar;