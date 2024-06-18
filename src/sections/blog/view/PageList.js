import React from 'react';
import { useParams } from 'react-router-dom';
import { Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

const pageData = [
    { id: 1, name: 'Trang 1', url: 'http://page1.com' },
    { id: 2, name: 'Trang 2', url: 'http://page2.com' },
    { id: 3, name: 'Trang 3', url: 'http://page3.com' },
];

function PageList() {
    const { id } = useParams();
    const filteredPages = pageData.filter(page => page.id.toString() === id);

    return (
        <Container>
            <Typography variant="h4" component="h1" gutterBottom>
                Danh sách các trang
            </Typography>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>TT</TableCell>
                            <TableCell>Tên trang</TableCell>
                            <TableCell>Đường dẫn</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredPages.map((row, index) => (
                            <TableRow key={row.id}>
                                <TableCell>{index + 1}</TableCell>
                                <TableCell>{row.name}</TableCell>
                                <TableCell><a href={row.url} target="_blank" rel="noopener noreferrer">{row.url}</a></TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Container>
    );
}

export default PageList;
