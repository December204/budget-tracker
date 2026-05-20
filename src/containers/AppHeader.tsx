import { Logout } from '@mui/icons-material';
import { AppBar, Chip, Container, IconButton, List, Paper, Toolbar } from '@mui/material';
import GithubLogo from 'assets/icons/Github.png';
import { SwitchTheme } from 'components';
import { AppMenu } from 'containers';
import { useLogout } from 'hooks/useAuth';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { profileSelector } from 'reducers/profileSlice';
import { privateRoute } from 'routes';

const AppHeader = () => {
  const { user } = useSelector(profileSelector);
  const { mutate: logout } = useLogout();

  const displayName = user
    ? `${user.firstName} ${user.lastName}`.trim() || user.email
    : '';

  return (
    <AppBar position='sticky' color='transparent' elevation={0} className='bg-paper-main'>
      <Toolbar component={Container} maxWidth='xl' className='flex items-center'>
        <div className='min-w-[240px]'>
          <Link to={privateRoute.home.path}>
            <img src={GithubLogo} alt='Logo' className='h-[40px]' />
          </Link>
        </div>

        <div className='flex flex-1 items-center justify-center py-3'>
          <List component={Paper} className='flex gap-2 rounded-full px-3'>
            <AppMenu />
          </List>
        </div>

        <div className='flex min-w-[240px] items-center justify-end gap-2'>
          <SwitchTheme />
          <Chip className='font-bold' label={displayName} />
          <IconButton onClick={() => logout()}>
            <Logout />
          </IconButton>
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default AppHeader;
