import './App.css';
import {Container, Typography} from '@mui/material';
import {Route, Routes} from 'react-router-dom';
import PhotoGallery from './features/photos/PhotoGallery';
import AuthorPhotosPage from './features/photos/AuthorPhotosPage';
import AddPhoto from './features/photos/AddPhoto';
import Register from './features/users/Register';
import Login from './features/users/Login';
import AppToolbar from './UI/AppToolbar/AppToolbar';

const App = () => {

  return (
    <>
      <header>
        <AppToolbar/>
      </header>
      <Container maxWidth="lg" component="main">
        <Routes>
          <Route path="/" element={<PhotoGallery/>}/>
          <Route path="/register" element={<Register/>}/>
          <Route path="/login" element={<Login/>}/>
          <Route path="/photos/:authorId" element={<AuthorPhotosPage/>}/>
          <Route path="/addPhoto" element={<AddPhoto/>}/>
          <Route path="*" element={<Typography variant="h1">Not found</Typography>}/>
        </Routes>
      </Container>
    </>
  );
};

export default App;
