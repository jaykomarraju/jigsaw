import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  TextField,
  Paper,
  Alert,
  CircularProgress,
  IconButton,
  Container
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import { styled } from '@mui/material/styles';

const VisuallyHiddenInput = styled('input')`
  clip: rect(0 0 0 0);
  clip-path: inset(50%);
  height: 1px;
  overflow: hidden;
  position: absolute;
  bottom: 0;
  left: 0;
  white-space: nowrap;
  width: 1px;
`;

const StyledDropZone = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  textAlign: 'center',
  cursor: 'pointer',
  border: `2px dashed ${theme.palette.divider}`,
  '&:hover': {
    borderColor: theme.palette.primary.main,
  },
}));

interface UploadResponse {
  id: number;
  name: string;
  img: string;
}

const UploadPuzzle: React.FC = () => {
  const [error, setError] = useState<string>('');
  const [preview, setPreview] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Create preview URL
    const previewUrl = URL.createObjectURL(file);
    setPreview(previewUrl);

    // Suggested name from filename (remove extension)
    const suggestedName = file.name.replace(/\.[^/.]+$/, "");
    if (!name) {
      setName(suggestedName);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    
    const file = event.dataTransfer?.files?.[0];
    if (file && file.type.startsWith('image/') && fileInputRef.current) {
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      fileInputRef.current.files = dataTransfer.files;
      handleFileSelect({ target: { files: dataTransfer.files } } as React.ChangeEvent<HTMLInputElement>);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    const fileInput = fileInputRef.current;
    if (!fileInput?.files?.[0]) {
      setError('Please select an image');
      setLoading(false);
      return;
    }

    if (!name.trim()) {
      setError('Please enter a puzzle name');
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append('image', fileInput.files[0]);
    formData.append('name', name.trim());

    try {
      const response = await fetch('http://localhost:8080/api/puzzles/', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Upload failed');
      }

      const result = await response.json() as UploadResponse;
      navigate(`/puzzle/${result.id}`);
    } catch (err) {
      const error = err as Error;
      setError(error.message || 'Failed to upload puzzle');
      setLoading(false);
    }
  };

  const clearImage = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setPreview('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4, mb: 6 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Upload New Puzzle
        </Typography>

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 4 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <TextField
            fullWidth
            label="Puzzle Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            margin="normal"
            required
            error={Boolean(error && !name.trim())}
          />

          <Box sx={{ mt: 3 }}>
            <StyledDropZone
              onDrop={handleDrop}
              onDragOver={(e: React.DragEvent) => e.preventDefault()}
              onClick={triggerFileInput}
            >
              {preview ? (
                <Box sx={{ position: 'relative' }}>
                  <img
                    src={preview}
                    alt="Preview"
                    style={{
                      maxHeight: '300px',
                      maxWidth: '100%',
                      objectFit: 'contain'
                    }}
                  />
                  <IconButton
                    sx={{
                      position: 'absolute',
                      top: 8,
                      right: 8,
                      bgcolor: 'background.paper'
                    }}
                    onClick={clearImage}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              ) : (
                <Box>
                  <CloudUploadIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }} />
                  <Typography variant="subtitle1" color="primary">
                    Click to upload or drag and drop
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    PNG, JPG, GIF up to 10MB
                  </Typography>
                </Box>
              )}
            </StyledDropZone>
            <VisuallyHiddenInput
              ref={fileInputRef}
              id="image-upload"
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
            />
          </Box>

          <Button
            type="submit"
            variant="contained"
            fullWidth
            size="large"
            disabled={loading || !preview || !name.trim()}
            sx={{ mt: 4 }}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              'Upload Puzzle'
            )}
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default UploadPuzzle;