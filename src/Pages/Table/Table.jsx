import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";

import { DataGrid } from "@mui/x-data-grid";
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Stack,
  TextField,
  Typography,
  useTheme,
  MenuItem,
} from "@mui/material";

import {
  AdminPanelSettingsOutlined,
  LockOpenOutlined,
  SecurityOutlined,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import { addUser, getUsers, updateUser } from "../../supaBase.js";

export default function Table() {
  const theme = useTheme();
  const { searchQuery } = useOutletContext();
  const [rows, setRows] = useState([]);
  const [open, setOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editingRow, setEditingRow] = useState(null);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    age: "",
    phone: "",
    access: "User",
  });
  const [filteredRows, setFilteredRows] = useState([]);
  useEffect(() => {
    async function fetchData() {
      const data = await getUsers();
      setRows(data);
      setFilteredRows(data);
    }
    fetchData();
  }, []);

  // وظيفة البحث الذكي
  const smartSearch = (query, data) => {
    if (!query || !query.trim()) {
      return data;
    }

    const searchTerm = query.toLowerCase().trim();
    
    return data.filter(user => {
      // البحث في الاسم
      const nameMatch = user.name && user.name.toLowerCase().includes(searchTerm);
      
      // البحث في العمر (إذا كان البحث رقم)
      const ageMatch = !isNaN(searchTerm) && user.age && user.age.toString() === searchTerm;
      
      return nameMatch || ageMatch;
    });
  };

  // تطبيق البحث عند تغيير searchQuery
  useEffect(() => {
    const filtered = smartSearch(searchQuery, rows);
    setFilteredRows(filtered);
  }, [searchQuery, rows]);
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setIsEdit(false);
    setEditingRow(null);
    setFormData({ name: "", email: "", age: "", phone: "", access: "User" });
    setErrors({});
  };
  const handleAdd = async () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (formData.name.trim().length < 3) {
      newErrors.name = "Name must be at least 3 characters";
    }
    if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Email is invalid";
    if (isNaN(formData.age) || Number(formData.age) <= 0)
      newErrors.age = "Enter a valid age";
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone is required";
    } else if (!/^01[0125][0-9]{8}$/.test(formData.phone)) {
      newErrors.phone = "Enter a valid Egyptian phone number";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const addedUser = await addUser(
        formData.name,
        formData.email,
        formData.age,
        formData.phone,
        formData.access
      );
      setRows((prev) => [...prev, addedUser[0]]);
      handleClose();
      setFormData({
        name: "",
        email: "",
        age: "",
        phone: "",
        access: "User",
      });
      setErrors({});
    } catch (err) {
      console.error("Failed to add user:", err.message);
    }
  };

  const handleEdit = (row) => {
    setIsEdit(true);
    setEditingRow(row);
    setFormData({
      name: row.name || "",
      email: row.email || "",
      age: row.age ?? "",
      phone: row.phone || "",
      access: row.access || "User",
    });
    setOpen(true);
  };

  const handleSave = async () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (formData.name.trim().length < 3) {
      newErrors.name = "Name must be at least 3 characters";
    }
    if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Email is invalid";
    if (isNaN(formData.age) || Number(formData.age) <= 0)
      newErrors.age = "Enter a valid age";
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone is required";
    } else if (!/^01[0125][0-9]{8}$/.test(formData.phone)) {
      newErrors.phone = "Enter a valid Egyptian phone number";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const updated = await updateUser(editingRow.id, {
        name: formData.name,
        email: formData.email,
        age: formData.age,
        phone: formData.phone,
        access: formData.access,
      });
      const updatedUser = Array.isArray(updated) ? updated[0] : updated;
      setRows((prev) => prev.map((r) => (r.id === updatedUser.id ? updatedUser : r)));
      handleClose();
    } catch (err) {
      console.error("Failed to update user:", err.message);
    }
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };




  const columns = [
    {
      field: "id",
      headerName: "ID",
      width: 50,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "name",
      headerName: "Name",
      width: 150,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "email",
      headerName: "Email",
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "age",
      headerName: "Age",
      width: 50,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "phone",
      headerName: "Phone",
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "access",
      headerName: "Access",
      width: 100,
      align: "center",
      headerAlign: "center",
      renderCell: ({ row: { access } }) => (
        <Box
          sx={{
            height: "100%",
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Box
            sx={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              backgroundColor:
                access === "Admin"
                  ? theme.palette.primary.dark
                  : access === "Manager"
                  ? theme.palette.secondary.dark
                  : "#3da58a",
              color: "#fff",
              borderRadius: "5px",
              padding: "4px 10px",
              textAlign: "center",
            }}
          >
            {access === "Admin" ? (
              <AdminPanelSettingsOutlined fontSize="small" />
            ) : access === "Manager" ? (
              <LockOpenOutlined fontSize="small" />
            ) : (
              <SecurityOutlined fontSize="small" />
            )}
            <Typography sx={{ fontSize: "14px" }}>{access}</Typography>
          </Box>
        </Box>
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      renderCell: (params) => (
        <Stack direction="row" spacing={1}>
          <IconButton color="primary" onClick={() => handleEdit(params.row)}>
            <EditIcon />
          </IconButton>
          <button>
            <IconButton color="error">
              <DeleteIcon />
            </IconButton>
          </button>
        </Stack>
      ),
    },
  ];

  return (
    <>
      <section className="flex justify-between">
        <Box>
          <h1
            style={{ color: theme.palette.info.main, fontSize: 25, margin: 0 }}
          >
            TEAM
          </h1>
          <p style={{ marginTop: 0 }}>Managing the Team Members</p>
        </Box>
        <Box className="pr-8">
          <Button
            variant="contained"
            color="info"
            startIcon={<AddIcon />}
            onClick={handleOpen}
          >
            Add User
          </Button>
        </Box>
      </section>


      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{isEdit ? "Edit User" : "Add New User"}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1, minWidth: "400px" }}>
            <TextField
              name="name"
              label="Name"
              fullWidth
              value={formData.name}
              onChange={handleChange}
              error={!!errors.name}
              helperText={errors.name}
            />

            <TextField
              name="email"
              label="Email"
              fullWidth
              value={formData.email}
              onChange={handleChange}
              error={!!errors.email}
              helperText={errors.email}
            />

            <TextField
              name="age"
              label="Age"
              fullWidth
              value={formData.age}
              onChange={handleChange}
              error={!!errors.age}
              helperText={errors.age}
            />

            <TextField
              name="phone"
              label="Phone"
              fullWidth
              value={formData.phone}
              onChange={handleChange}
              error={!!errors.phone}
              helperText={errors.phone}
            />

            <TextField
              name="access"
              label="Access"
              select
              fullWidth
              value={formData.access}
              onChange={handleChange}
            >
              <MenuItem value="Admin">Admin</MenuItem>
              <MenuItem value="Manager">Manager</MenuItem>
              <MenuItem value="User">User</MenuItem>
            </TextField>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          {isEdit ? (
            <Button variant="contained" color="info" onClick={handleSave}>
              Save
            </Button>
          ) : (
            <Button variant="contained" color="info" onClick={handleAdd}>
              Add
            </Button>
          )}
        </DialogActions>
      </Dialog>
      <Box style={{ height: 500, width: "98%", mx: "auto" }}>
        <DataGrid 
          autoHeight 
          rows={filteredRows} 
          columns={columns} 
        />
        {searchQuery && (
          <Box sx={{ mt: 2, textAlign: "center" }}>
            <Typography variant="body2" color="text.secondary">
              Showing {filteredRows.length} result(s) for "{searchQuery}"
            </Typography>
          </Box>
        )}
      </Box>
    </>
  );
}
