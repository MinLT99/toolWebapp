import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Input,
  Button,
  Box,
  Menu,
  MenuItem,
} from '@mui/material';

const initialPages = [
  { stt: 1, name: 'Trang 1', unit: 'A' },
  { stt: 2, name: 'Trang 2', unit: 'A' },
  { stt: 3, name: 'Trang 3', unit: 'B' },
  { stt: 4, name: 'Trang 4', unit: 'B' },
  { stt: 5, name: 'Trang 5', unit: 'C' },
];

export default function PageCheckTable() {
  const [selectedPages, setSelectedPages] = useState([]);
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleUnitSelect = (unit) => {
    setSelectedUnit(unit);
    setAnchorEl(null);
  };

  const handleCheckButtonClick = () => {
    console.log('Kiểm tra trang:', selectedPages);
  };

  return (
    <Box mt={4} sx={{ textAlign: 'center' }}>
      <Box display="inline-block" mb={2}>
        <Button
          variant="contained"
          color="primary"
          onClick={(e) => setAnchorEl(e.currentTarget)}
          sx={{ mr: 1 }}
        >
          Chọn đơn vị kiểm tra
        </Button>
        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
          <MenuItem onClick={() => handleUnitSelect(null)}>Tất cả</MenuItem>
          {Array.from(new Set(initialPages.map((page) => page.unit))).map((unit) => (
            <MenuItem key={unit} onClick={() => handleUnitSelect(unit)}>
              Đơn vị {unit}
            </MenuItem>
          ))}
        </Menu>
      </Box>
      <Box display="inline-block">
        <Button variant="contained" color="secondary" onClick={handleCheckButtonClick}>
          Kiểm tra
        </Button>
      </Box>
      <TableContainer component={Paper} mt={2}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>STT</TableCell>
              <TableCell>Chọn trang</TableCell>
              <TableCell>Tên trang</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {initialPages.map(
              (page) =>
                (selectedUnit === null || page.unit === selectedUnit) && (
                  <TableRow key={page.stt}>
                    <TableCell>{page.stt}</TableCell>
                    <TableCell>
                      <Input
                        type="checkbox"
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedPages([...selectedPages, page]);
                          } else {
                            setSelectedPages(
                              selectedPages.filter((selectedPage) => selectedPage.stt !== page.stt)
                            );
                          }
                        }}
                      />
                    </TableCell>
                    <TableCell>{page.name}</TableCell>
                  </TableRow>
                )
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
