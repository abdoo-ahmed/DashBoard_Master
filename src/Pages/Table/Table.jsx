
import { DataGrid } from '@mui/x-data-grid';
import {
  Box,
  Button,
  IconButton,
  Stack,
  Typography,
  useTheme,
} from '@mui/material';


import {
  AdminPanelSettingsOutlined,
  LockOpenOutlined,
  SecurityOutlined,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';

export default function Table() {
  const theme = useTheme();


  const rows = [
    {
  id: 1,
  name: "Jon Snow",
  email: "jonsnow@gmail.com",
  age: 35,
  phone: "(665)121-5454",
  access: "Admin",
    },
  ]


  const columns = [
    { field: 'id', headerName: 'ID',  width: 50, align: 'center', headerAlign: 'center' },
    { field: 'name', headerName: 'Name', width: 150, flex: 1 , align: 'center', headerAlign: 'center' },
    { field: 'email', headerName: 'Email', flex: 1, align: 'center', headerAlign: 'center' },
    { field: 'age', headerName: 'Age', width: 50, align: 'center', headerAlign: 'center' },
    { field: 'phone', headerName: 'Phone', flex: 1, align: 'center', headerAlign: 'center' },
    {
      field: 'access',
      headerName: 'Access',
      width: 100,
      align: 'center',
      headerAlign: 'center',
 renderCell: ({ row: { access } }) => (
  <Box
    sx={{
      height: '100%',
      width: '100%',
      display: 'flex',
      alignItems: 'center',         
      justifyContent: 'center',     
    }}
  >
    <Box
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        backgroundColor:
          access === 'Admin'
            ? theme.palette.primary.dark
            : access === 'Manager'
            ? theme.palette.secondary.dark
            : '#3da58a',
        color: '#fff',
        borderRadius: '5px',
        padding: '4px 10px',
        textAlign: 'center',
      }}
    >
      {access === 'Admin' ? (
        <AdminPanelSettingsOutlined fontSize="small" />
      ) : access === 'Manager' ? (
        <LockOpenOutlined fontSize="small" />
      ) : (
        <SecurityOutlined fontSize="small" />
      )}
      <Typography sx={{ fontSize: '14px' }}>{access}</Typography>
    </Box>
  </Box>
  )

    },
    {
      field: 'actions',
      headerName: 'Actions',
      renderCell: () => (
        <Stack direction="row" spacing={1}>
          <IconButton color="primary">
            <EditIcon />
          </IconButton>
          <IconButton color="error">
            <DeleteIcon />
          </IconButton>
        </Stack>
      ),
    },
  ];

  return (
    <>
      
      <section className="flex justify-between">
        <Box>
          <h1 style={{ color: theme.palette.info.main, fontSize: 25, margin: 0 }}>TEAM</h1>
          <p style={{ marginTop: 0 }}>Managing the Team Members</p>
        </Box>
        <Box className="pr-8">
          <Button variant="contained" color="info" startIcon={<AddIcon />} >
            Add User
          </Button>
        </Box>
      </section>

      
      <Box style={{ height: 500, width: '98%', mx: 'auto' }}>
        <DataGrid autoHeight rows={rows} columns={columns} />
      </Box>
      
      
     
    </>
  );
}
