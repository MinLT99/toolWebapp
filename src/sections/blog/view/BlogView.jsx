import { React, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Paper } from '@mui/material';
import axios from 'axios';

function BlogView() {
  const [unitData, setUnitData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch data from API when component mounts
        const response = await axios.get('http://192.168.3.101:5000/api/team/?committee_id=66698af1828bde24029ed147');
        setUnitData(response.data);
      } catch (error) {
        console.error('Error fetching unit data:', error);
        setError('Failed to fetch data. Please try again later.');
      }
    };

    fetchData(); // Call fetchData function to initiate data fetching
  }, []); // Empty dependency array ensures useEffect runs only once

  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom>
        Danh sách đơn vị
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>TT</TableCell>
              <TableCell>Đơn vị</TableCell>
              <TableCell>Chức năng</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {unitData.map((row, index) => (
              <TableRow key={row._id} >
                <TableCell>{index + 1}</TableCell>
                <TableCell>{row.name}</TableCell>
                <TableCell>
                  {/* Link to 'dvtt/staff' route */}
                  <Link to={`/dvtt/staff/${row._id}`}>
                    <Button variant="contained" color="primary" style={{ marginRight: '10px' }}>
                      Danh sách cán bộ
                    </Button>
                  </Link>
                  {/* Link to '/dvtt/pages' route */}
                  <Link to="/dvtt/pages">
                    <Button variant="contained" color="secondary">
                      Danh sách trang
                    </Button>
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container >
  );
}

export default BlogView;
