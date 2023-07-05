import {useRef, useState} from 'react';

import {Avatar, Box, Button, CircularProgress, Divider, Hidden, lighten, Popover, Typography} from '@mui/material';

import {styled} from '@mui/material/styles';
import ExpandMoreTwoToneIcon from '@mui/icons-material/ExpandMoreTwoTone';
import LockOpenTwoToneIcon from '@mui/icons-material/LockOpenTwoTone';
import {useAuthState} from "react-firebase-hooks/auth";
import {auth} from "@/utils/Firebase";
import {signOut} from "@firebase/auth";

const UserBoxButton = styled(Button)(
    ({theme}) => `
        padding-left: ${theme.spacing(1)};
        padding-right: ${theme.spacing(1)};
`
);

const MenuUserBox = styled(Box)(
    ({theme}) => `
        background: ${theme.colors.alpha.black[5]};
        padding: ${theme.spacing(2)};
`
);

const UserBoxText = styled(Box)(
  ({ theme }) => `
        text-align: left;
        padding-left: ${theme.spacing(1)};
`
);

const UserBoxLabel = styled(Typography)(
  ({ theme }) => `
        font-weight: ${theme.typography.fontWeightBold};
        color: ${theme.palette.secondary.main};
        display: block;
`
);

const UserBoxDescription = styled(Typography)(
  ({ theme }) => `
        color: ${lighten(theme.palette.secondary.main, 0.5)}
`
);

function HeaderUserBox() {

    const [user, loading, error] = useAuthState(auth);

  const ref = useRef<any>(null);
  const [isOpen, setOpen] = useState<boolean>(false);

  const handleOpen = (): void => {
    setOpen(true);
  };

  const handleClose = (): void => {
    setOpen(false);
  };

  const logout = async () => {
      await signOut(auth)
      document.location.href = '/auth/login';
  };
  return (
      <>
          {loading ? (
              <CircularProgress/>
          ) : error ? (
              <p>Error: {error.message}</p>
          ) : user ? (
              <UserBoxButton color="secondary" ref={ref} onClick={handleOpen}>
                  <Avatar variant="rounded" alt={user.displayName} src={user.displayName}/>
                  <Hidden mdDown>
                      <UserBoxText>
                          <UserBoxLabel variant="body1">{user.displayName}</UserBoxLabel>
                          <UserBoxDescription variant="body2">{user.email}</UserBoxDescription>
                      </UserBoxText>
                  </Hidden>
                  <Hidden smDown>
                      <ExpandMoreTwoToneIcon sx={{ml: 1}}/>
                  </Hidden>
              </UserBoxButton>
          ) : (
              <p>Please sign in</p>
          )}
          <Popover
              anchorEl={ref.current}
              onClose={handleClose}
              open={isOpen}
              anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right'
              }}
              transformOrigin={{
                  vertical: 'top',
          horizontal: 'right'
        }}
      >
        <MenuUserBox sx={{ minWidth: 210 }} display="flex">
            <Avatar variant="rounded" alt={user?.displayName} src={user?.displayName}/>
            <UserBoxText>
                <UserBoxLabel variant="body1">{user?.displayName}</UserBoxLabel>
                <UserBoxDescription variant="body2">
                    {user?.email}
                </UserBoxDescription>
            </UserBoxText>
        </MenuUserBox>
        <Divider sx={{ mb: 0 }} />
        <Divider />
        <Box sx={{ m: 1 }}>
          <Button color="primary" fullWidth onClick={logout}>
            <LockOpenTwoToneIcon sx={{ mr: 1 }} />
             Sign out
          </Button>
        </Box>
      </Popover>
    </>
  );
}

export default HeaderUserBox;
