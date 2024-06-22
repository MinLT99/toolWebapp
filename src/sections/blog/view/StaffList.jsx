import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Button, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from '@mui/material';
// import EditIcon from '@mui/icons-material/Edit';
// import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';
import { getToken } from 'src/routes/auth';

function StaffList() {
  const { id } = useParams(); // Lấy id từ URL
  const [staffList, setStaffList] = useState([]);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [addStaffDialog, setAddStaffDialog] = useState({
    fullname: '',
    url: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://192.168.3.101:19999/api/teams/${id}/profiles`,
          { headers: { Authorization: `Bearer ${getToken()}` } }
        );
        setStaffList(response.data);
      } catch (error) {
        console.error('Error fetching staff data:', error);
        setError('Failed to fetch data. Please try again later.');
      }
    };

    fetchData(); // Gọi fetchData khi component mount và khi id thay đổi
  }, [id]);

  const addStaff = (staff) => {
    setOpen(true)
    setAddStaffDialog({
      ...selectedStaff,
      [staff.target.name]: staff.target.value,
    });
  }

  const handleEdit = (staff) => {
    setSelectedStaff(staff);
    setOpen(true);
  };

  const handleDelete = (staffId) => {
    console.log(`Delete staff with ID: ${staffId}`);
    // Thực hiện các hành động xóa nhân viên, ví dụ mở xác nhận xóa, gọi API xóa, cập nhật lại danh sách nhân viên, vv.
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedStaff(null);
  };

  const handleSave = () => {
    console.log(`Save changes for staff with ID: ${selectedStaff._id}`);
    // Thực hiện các hành động lưu thông tin đã chỉnh sửa, ví dụ gọi API để lưu thay đổi
    setOpen(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSelectedStaff(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleAdd = (e) => {
    const { name, value } = e.target;
    setSelectedStaff(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom>
        Danh sách cán bộ
      </Typography>
      <Button
        variant="contained"
        color="primary"
        style={{ marginBottom: '10px' }}
        onClick={addStaff}
      >
        Bổ sung cán bộ
      </Button>
      {error && <Typography color="error">{error}</Typography>}
      {!error && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>TT</TableCell>
                <TableCell>Tên cán bộ</TableCell>
                <TableCell>Đường dẫn</TableCell>
                <TableCell>Chức năng</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {staffList.map((staff, index) => (
                <TableRow key={staff._id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{staff.fullname}</TableCell>
                  <TableCell>
                    <a href={staff.url} target="_blank" rel="noopener noreferrer">{staff.url}</a>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleEdit(staff)}
                      style={{ marginRight: '10px' }}
                    >
                      {/* <EditIcon /> */}
                      Sửa
                    </Button>
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={() => handleDelete(staff._id)}
                    >
                      {/* <DeleteIcon /> */}
                      Xoá
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {selectedStaff && (
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Sửa thông tin cán bộ</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              name="fullname"
              label="Tên cán bộ"
              type="text"
              fullWidth
              value={selectedStaff.fullname}
              onChange={handleChange}
            />
            <TextField
              margin="dense"
              name="url"
              label="Đường dẫn"
              type="text"
              fullWidth
              value={selectedStaff.url}
              onChange={handleChange}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Hủy
            </Button>
            <Button onClick={handleSave} color="primary">
              Lưu
            </Button>
          </DialogActions>
        </Dialog>
      )}

      {addStaffDialog && (
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Thêm người mới</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              name="fullname"
              label="Tên người"
              type="text"
              fullWidth
              onChange={handleAdd}
            />
            <TextField
              margin="dense"
              name="url"
              label="Đường dẫn"
              type="text"
              fullWidth
              onChange={handleAdd}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Hủy
            </Button>
            <Button onClick={handleSave} color="primary">
              Thêm
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Container>
  );
}

export default StaffList;
