import React, { useState, useEffect } from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Button,
  Typography
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { getClassStudents, getClassTasks, createStudent } from '../services/api';

interface Student {
  id: number;
  name: string;
  class_id: number;
}

interface Task {
  id: number;
  description: string;
  max_points: number;
}

const GradeSheet: React.FC<{ classId: number | null }> = ({ classId }) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newStudentName, setNewStudentName] = useState('');
  const [grades, setGrades] = useState<Record<string, Record<string, number>>>({});

  useEffect(() => {
    if (classId) {
      loadData();
    }
  }, [classId]);

  const loadData = async () => {
    try {
      const [studentsRes, tasksRes] = await Promise.all([
        getClassStudents(classId!),
        getClassTasks(classId!)
      ]);
      setStudents(studentsRes.data);
      setTasks(tasksRes.data);
      
      // Initialize grades object
      const initialGrades: Record<string, Record<string, number>> = {};
      studentsRes.data.forEach((student: Student) => {
        initialGrades[student.id] = {};
        tasksRes.data.forEach((task: Task) => {
          initialGrades[student.id][task.id] = 0;
        });
      });
      setGrades(initialGrades);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const handleAddStudent = async () => {
    if (!newStudentName.trim() || !classId) return;
    try {
      await createStudent({ name: newStudentName, class_id: classId });
      setNewStudentName('');
      loadData();
    } catch (error) {
      console.error('Error adding student:', error);
    }
  };

  const handleGradeChange = (studentId: number, taskId: number, value: string) => {
    const numValue = parseInt(value) || 0;
    setGrades(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        [taskId]: numValue
      }
    }));
  };

  const handleSaveAll = () => {
    console.log('Saving grades:', grades);
    // TODO: Send to backend
    alert('Grades saved! (Backend integration coming soon)');
  };

  if (!classId) {
    return (
      <Paper sx={{ p: 4, textAlign: 'center', height: '100vh' }}>
        <Typography variant="h6" color="textSecondary">
          👈 Select a class from the sidebar to start grading
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper sx={{ p: 3, height: '100vh', overflow: 'auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <Typography variant="h5">📝 Grade Sheet</Typography>
        <Button 
          variant="contained" 
          startIcon={<SaveIcon />}
          onClick={handleSaveAll}
          sx={{ backgroundColor: '#1976d2' }}
        >
          Save All
        </Button>
      </div>

      {/* Add Student */}
      <Paper sx={{ p: 2, mb: 3, backgroundColor: '#f5f5f5' }}>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <PersonAddIcon color="action" />
          <TextField
            size="small"
            placeholder="New student name"
            value={newStudentName}
            onChange={(e) => setNewStudentName(e.target.value)}
            sx={{ flexGrow: 1 }}
          />
          <Button 
            variant="outlined" 
            onClick={handleAddStudent}
            sx={{ borderColor: '#1976d2', color: '#1976d2' }}
          >
            Add Student
          </Button>
        </div>
      </Paper>

      {/* Grades Table */}
      <TableContainer component={Paper}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell sx={{ backgroundColor: '#1976d2', color: 'white', fontWeight: 'bold' }}>
                Student Name
              </TableCell>
              {tasks.map((task) => (
                <TableCell 
                  key={task.id}
                  sx={{ backgroundColor: '#e3f2fd', fontWeight: 'bold' }}
                >
                  {task.description}
                  <Typography variant="caption" display="block" color="textSecondary">
                    Max: {task.max_points}
                  </Typography>
                </TableCell>
              ))}
              <TableCell sx={{ backgroundColor: '#1976d2', color: 'white', fontWeight: 'bold' }}>
                Total
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {students.map((student) => {
              const studentGrades = grades[student.id] || {};
              const total = Object.values(studentGrades).reduce((sum, grade) => sum + grade, 0);
              
              return (
                <TableRow key={student.id} hover>
                  <TableCell sx={{ fontWeight: 'bold' }}>
                    {student.name}
                  </TableCell>
                  {tasks.map((task) => (
                    <TableCell key={task.id}>
                      <TextField
                        type="number"
                        size="small"
                        value={studentGrades[task.id] || 0}
                        onChange={(e) => handleGradeChange(student.id, task.id, e.target.value)}
                        inputProps={{ 
                          min: 0, 
                          max: task.max_points,
                          style: { textAlign: 'center' }
                        }}
                        sx={{ 
                          width: 80,
                          '& .MuiOutlinedInput-root': {
                            '&:hover fieldset': { borderColor: '#1976d2' }
                          }
                        }}
                      />
                    </TableCell>
                  ))}
                  <TableCell sx={{ fontWeight: 'bold', color: '#1976d2' }}>
                    {total}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Additional Info Section */}
      <Paper sx={{ p: 2, mt: 3, backgroundColor: '#f8f9fa' }}>
        <Typography variant="subtitle1" gutterBottom color="#1976d2">
          📅 Date & Mentor Info
        </Typography>
        <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
          <TextField
            label="Date"
            type="date"
            size="small"
            InputLabelProps={{ shrink: true }}
            sx={{ minWidth: 200 }}
          />
          <TextField
            label="Mentor Name"
            size="small"
            placeholder="Enter mentor name"
            sx={{ minWidth: 200 }}
          />
          <TextField
            label="Mentor Email"
            type="email"
            size="small"
            placeholder="mentor@school.edu"
            sx={{ minWidth: 250 }}
          />
          <Button variant="outlined" sx={{ borderColor: '#1976d2', color: '#1976d2' }}>
            Assign Mentor
          </Button>
        </div>
      </Paper>
    </Paper>
  );
};

export default GradeSheet;