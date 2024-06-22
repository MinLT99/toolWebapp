import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import axios from 'axios';
import { getToken } from 'src/routes/auth';

function PageList() {
    const { id } = useParams();
    const [pageData, setPageData] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPages = async () => {
            try {
                const response = await axios.get(`http://192.168.3.101:19999/api/teams/${id}/pages`,
                    { headers: { Authorization: `Bearer ${getToken()}` } });
                setPageData(response.data);
                console.log(response.data);
            } catch (error) {
                console.error('Error fetching page data:', error);
                setError('Failed to fetch data. Please try again later.');
            }
        };

        fetchPages();
    }, [id]);

    // useEffect(() => {
    //     // Dữ liệu cứng để thử nghiệm
    //     const hardcodedData = [
    //         { _id: '1', page: 'Fanpage 1', url: 'http://example.com/1' },
    //         { _id: '2', page: 'Fanpage 2', url: 'http://example.com/2' },
    //         { _id: '3', page: 'Fanpage 3', url: 'http://example.com/3' },
    //     ];

    //     setPageData(hardcodedData);
    //     setError(null); // Xóa lỗi trước đó nếu có
    // }, [id]);

    return (
        <Container>
            <Typography variant="h4" component="h1" gutterBottom>
                Danh sách các trang
            </Typography>
            {error && <Typography color="error">{error}</Typography>}
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
                        {pageData.map((row, index) => (
                            <TableRow key={row._id}>
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
