import React, {useState,} from 'react';
import {TextField, Button, Typography, Alert} from '@mui/material';
import {useNavigate, Navigate} from 'react-router-dom';
import {AppDispatch} from '../../app/store';
import {useAppDispatch, useAppSelector} from '../../app/hooks';
import {addPhoto} from './photosThunks';
import {selectUser} from '../users/usersSlice';
import FileInput from '../../UI/FileInput/FileInput';

const AddPhoto: React.FC = () => {
  const dispatch: AppDispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useAppSelector(selectUser);

  const [state, setState] = useState({
    title: '',
    image: null,
  });

  const [error, setError] = useState<string | null>(null);


  const fileInputChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {name, files} = e.target;
    if (files) {
      setState((prevState) => ({
        ...prevState,
        [name]: files[0],
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!state.title || !state.image) {
      setError('Both title and image are required.');
      return;
    }

    const formData = new FormData();
    formData.append('title', state.title);
    if (state.image) {
      formData.append('image', state.image);
    }

    dispatch(addPhoto(formData))
      .then(() => {
        navigate('/');
      })
      .catch((error) => {
        console.error('Failed to add photo:', error);
      });
  };

  return (
    <>
      {user ? (
        <div>
          <Typography variant="h4">Add New Photo</Typography>
          <form onSubmit={handleSubmit}>
            {error && <Alert severity="error">{error}</Alert>}
            <TextField
              label="Title"
              value={state.title}
              onChange={(e) => setState({...state, title: e.target.value})}
              fullWidth
              margin="normal"
              required
            />
            <FileInput
              onChange={fileInputChangeHandler}
              name="image"
              label="Upload Image"
            />
            <Button sx={{mt: 2}} variant="contained" type="submit">
              Submit
            </Button>
          </form>
        </div>
      ) : (
        <Navigate to="/login"/>
      )}
    </>
  );
};

export default AddPhoto;
