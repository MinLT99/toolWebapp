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
} from '@mui/material';

const initialPages = [
  { stt: 1, name: 'Trang 1' },
  { stt: 2, name: 'Trang 2' },
  { stt: 3, name: 'Trang 3' },
  // Thêm dữ liệu trang tương ứng với đơn vị tại đây
];

export default function PageCheckTable() {
  const [selectedPages, setSelectedPages] = useState([]);

  const handleCheckButtonClick = () => {
    // Xử lý logic kiểm tra trang
    console.log('Kiểm tra trang:', selectedPages);
  };

  return (
    <Box mt={4}>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>STT</TableCell>
              <TableCell>Cột chọn</TableCell>
              <TableCell>Tên trang</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {initialPages.map((page) => (
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
                          selectedPages.filter(
                            (selectedPage) => selectedPage.stt !== page.stt
                          )
                        );
                      }
                    }}
                  />
                </TableCell>
                <TableCell>{page.name}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Box mt={2}>
        <Button variant="contained" color="primary" onClick={handleCheckButtonClick}>
          Kiểm tra
        </Button>
      </Box>
    </Box>
  );
}
