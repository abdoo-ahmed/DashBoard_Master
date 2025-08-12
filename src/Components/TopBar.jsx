import styled from '@emotion/styled';
import { alpha, Box, IconButton, InputBase, Stack, Toolbar, useTheme } from '@mui/material';
import React from 'react';
import { Avatar } from '@mui/material';
import MuiAppBar from '@mui/material/AppBar';
import SearchIcon from '@mui/icons-material/Search';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';

const drawerWidth = 240;

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
}));

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

export default function TopBar({ open  , setMode}) {
  const theme = useTheme();
  return (
    <AppBar position="fixed" open={open}>
      <Toolbar>
        <Box>
          <Avatar
            alt="Logo"
            src="https://cdn-icons-png.flaticon.com/512/6821/6821002.png"
            sx={{ width: 48, height: 48 }}
          />
        </Box>

        <Search>
          <SearchIconWrapper>
            <SearchIcon />
          </SearchIconWrapper>
          <StyledInputBase
            placeholder="Search…"
            inputProps={{ 'aria-label': 'search' }}
          />
        </Search>

        <Box flexGrow = {1}/>

        <Stack direction={"row"}>
          { theme.palette.mode === "light" ? (
            <IconButton  onClick={() => {
              localStorage.setItem("currentMode" , theme.palette.mode === 'dark' ? 'light': 'dark' )
              setMode((prevMode => prevMode === 'light' ? 'dark' : 'light')) 
            }} color="inherit">
              <LightModeOutlinedIcon />
            </IconButton>
          )  : (
            <IconButton onClick={() => {
              localStorage.setItem("currentMode" , theme.palette.mode === 'dark' ? 'light': 'dark' )
              setMode((prevMode => prevMode === 'light' ? 'dark' : 'light')) 
            }} color="inherit">
              <DarkModeOutlinedIcon />
            </IconButton>
          ) }
        </Stack>
      </Toolbar>
    </AppBar>
  );
}
