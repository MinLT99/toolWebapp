import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import axios from 'axios';

function StaffList() {
  const { id } = useParams();
  const [staffList, setStaffList] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://192.168.3.101:5000/api/profile/?team_id=${id}`);
        setStaffList(response.data);
      } catch (error) {
        console.error('Error fetching staff data:', error);
      }
    };

    fetchData();
  }, [id]);

  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom>
        Danh sách cán bộ
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>TT</TableCell>
              <TableCell>Tên cán bộ</TableCell>
              <TableCell>Đường dẫn</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {staffList.map((staff, index) => (
              <TableRow key={staff._id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{staff.fullname}</TableCell>
                <TableCell><a href={staff.url} target="_blank" rel="noopener noreferrer">{staff.url}</a></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}

export default StaffList;
