import React, { useState, useRef } from 'react';
import { Button, Box, Typography, Alert } from '@mui/material';
import { styled } from '@mui/material/styles';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { usePuzzle } from '../contexts/PuzzleContext';

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
;
`


const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export interface UploadImageProps { }

const UploadImage: React.FC<UploadImageProps> = () => {
  const { dispatch } = usePuzzle();
  const [error, setError] = useState<string>('');
  const [preview, setPreview] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): boolean => {
    if (!file.type.startsWith('image/jpeg')) {
      setError('Please upload a JPEG image.');
      return false;
    }
    if (file.size > MAX_FILE_SIZE) {
      setError('File size should be less than 5MB.');
      return false;
    }
    return true;
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setError('');

    if (!file) return;

    if (!validateFile(file)) {
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setPreview(result);
      dispatch({ type: 'SET_IMAGE', payload: result });
    };
    reader.readAsDataURL(file);
  };

  return (
    <Box sx={{ my: 4, textAlign: 'center' }}>
      <Button
        component="label"
        variant="contained"
        startIcon={<CloudUploadIcon />}
        sx={{
          mb: 2,
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 1,
          padding: '12px 24px',
          backgroundColor: '#04477a',
          color: '#fff',
          border: '3px solid black',
          borderRadius: '12px',
          fontSize: '1rem',
          fontWeight: 500,
          textTransform: 'uppercase',
          transition: 'background-color 0.2s ease-in, transform 0.2s ease-in',
          '&:hover': {
            backgroundColor: '#0569b5',
          },
          '&:active': {
            backgroundColor: '#222',
            transform: 'scale(0.98)',
          },
        }}
      >

        Upload Image
        <VisuallyHiddenInput
          ref={fileInputRef}
          type="file"
          accept=".jpg,.jpeg"
          onChange={handleFileChange}
        />
      </Button>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {preview && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle1" gutterBottom>
            Preview:
          </Typography>
          <Box
            component="img"
            src={preview}
            alt="Upload preview"
            sx={{
              maxWidth: '100%',
              maxHeight: '200px',
              objectFit: 'contain',
              borderRadius: 1,
            }}
          />
        </Box>
      )}
    </Box>
  );
};

export default UploadImage;