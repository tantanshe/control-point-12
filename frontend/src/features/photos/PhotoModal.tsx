import React from 'react';
import {Modal, Box, CardMedia, IconButton} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import {Photo} from '../../types';

const PhotoModal: React.FC<{ photo: Photo | null; onClose: () => void }> = ({photo, onClose}) => {
  return (
    <Modal open={!!photo} onClose={onClose}>
      <Box sx={{position: 'relative', maxWidth: 600, margin: 'auto', mt: 5}}>
        <IconButton onClick={onClose} sx={{position: 'absolute', right: 10, top: 10}}>
          <CloseIcon/>
        </IconButton>
        {photo && (
          <CardMedia
            component="img"
            image={`http://localhost:8000/${photo.image}`}
            alt={photo.title}
            sx={{width: '100%', height: 'auto'}}
          />
        )}
      </Box>
    </Modal>
  );
};

export default PhotoModal;
