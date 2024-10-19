import {AppBar, Avatar, Button, Grid, styled, Toolbar, Typography} from '@mui/material';
import {Link, NavLink} from 'react-router-dom';
import {useAppDispatch, useAppSelector} from '../../app/hooks';
import {selectUser} from '../../features/users/usersSlice';
import {logout} from '../../features/users/usersThunks';

const StyledLink = styled(Link)({
  color: 'lightblue',
  textDecoration: 'none',
  '&:hover': {
    color: 'inherit',
  }
});

const buttonStyles = {
  backgroundColor: '#ffffff',
  border: '2px solid #3f51b5',
  borderRadius: '10px',
  padding: '8px',
  margin: '5px 0',
  '&:hover': {
    backgroundColor: '#a7b2df',
  },
};

const AppToolbar = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <AppBar position="sticky" sx={{mb: 2, pt: 1, pb: 1}}>
      <Toolbar>
        <Grid container justifyContent="space-between" alignItems="center">
          <Grid item>
            <Typography variant="h6" component="div" sx={{flexGrow: 1}}>
              <StyledLink to="/">Photo Gallery</StyledLink>
            </Typography>
          </Grid>
          {user ? (
            <Grid item>
              <Grid container alignItems="center" justifyContent="flex-end" sx={{mb: 1}}>
                <Typography variant="h6" sx={{mr: 1}}>
                  Hello
                </Typography>
                <Typography variant="h6" sx={{mr: 1}}>
                  <StyledLink to={`/photos/${user._id}`}>{user.displayName}</StyledLink>
                </Typography>
                {user.avatar && <Avatar src={user.avatar} alt={user.displayName}/>}
              </Grid>
              <Grid container spacing={1} justifyContent="flex-end">
                <Grid item>
                  <Button onClick={handleLogout} sx={buttonStyles}>
                    Logout
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          ) : (
            <Grid item>
              <Button component={NavLink} to="/register" color="inherit">
                Sign up
              </Button>
              <Button component={NavLink} to="/login" color="inherit">
                Sign in
              </Button>
            </Grid>
          )}
        </Grid>
      </Toolbar>
    </AppBar>
  );
};

export default AppToolbar;