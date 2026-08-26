import React, { useState } from 'react';
import {
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  List,
  ListItem,
  ListItemText,
  Alert,
  CircularProgress,
  Chip
} from '@mui/material';
import { TrendingUp } from '@mui/icons-material';
import databaseService from '../services/databaseService';

const RangeQuery = () => {
  const [startKey, setStartKey] = useState('');
  const [endKey, setEndKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [error, setError] = useState(null);

  const handleQuery = async () => {
    if (!startKey || !endKey) return;
    
    setLoading(true);
    setError(null);
    setResults([]);

    try {
      const response = await databaseService.rangeQuery(
        parseInt(startKey),
        parseInt(endKey)
      );
      if (response.success) {
        setResults(response.data || []);
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to perform range query');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper sx={{ p: 3, backgroundColor: '#1e2936' }}>
      <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <TrendingUp /> Range Query
      </Typography>

      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mt: 2 }}>
        <TextField
          label="Start Key"
          type="number"
          value={startKey}
          onChange={(e) => setStartKey(e.target.value)}
          required
          InputProps={{ inputProps: { min: 0 } }}
          sx={{ flex: 1, minWidth: '150px' }}
        />
        <TextField
          label="End Key"
          type="number"
          value={endKey}
          onChange={(e) => setEndKey(e.target.value)}
          required
          InputProps={{ inputProps: { min: 0 } }}
          sx={{ flex: 1, minWidth: '150px' }}
        />
        <Button
          variant="contained"
          onClick={handleQuery}
          disabled={loading || !startKey || !endKey}
          sx={{ height: '56px' }}
        >
          {loading ? <CircularProgress size={24} /> : 'Query'}
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}

      {results.length > 0 && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle2" color="textSecondary" gutterBottom>
            Found {results.length} records
          </Typography>
          <Paper sx={{ maxHeight: 400, overflow: 'auto', backgroundColor: '#2d3a4a' }}>
            <List>
              {results.map((record, index) => (
                <ListItem key={index} divider={index < results.length - 1}>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="body1">
                          Key: <strong>{record.key}</strong>
                        </Typography>
                        <Chip
                          label={`Value: ${record.value}`}
                          size="small"
                          color="primary"
                          variant="outlined"
                        />
                      </Box>
                    }
                    secondary={record.timestamp && 
                      `Timestamp: ${new Date(record.timestamp).toLocaleString()}`
                    }
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Box>
      )}

      {results.length === 0 && !loading && !error && (
        <Alert severity="info" sx={{ mt: 2 }}>
          No records found in this range
        </Alert>
      )}
    </Paper>
  );
};

export default RangeQuery;