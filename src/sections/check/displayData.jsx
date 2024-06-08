import React from 'react';
import PropTypes from 'prop-types';

import { Table, Paper, TableRow, TableBody, TableCell, TableHead, TableContainer } from '@mui/material';

DisplayTable.propTypes = {
    data: PropTypes.arrayOf(
        PropTypes.shape({
            chuatuongtac: PropTypes.arrayOf(PropTypes.string).isRequired,
            datuongtac: PropTypes.arrayOf(PropTypes.string).isRequired,
            thongke: PropTypes.object.isRequired,
            tongtuongtac: PropTypes.number.isRequired,
            tongtuongtacdonvi: PropTypes.number.isRequired,
            tongtuongtackhongthuocdonvi: PropTypes.number.isRequired,
            tongcamxuc: PropTypes.number.isRequired,
            tongbinhluan: PropTypes.number.isRequired,
            tongdiem: PropTypes.number.isRequired
        })
    ).isRequired
};

export default function DisplayTable({ data }) {
    return (
        <TableContainer component={Paper}>
            <h2>Thống kê theo đơn vị</h2>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Bài viết</TableCell>
                        <TableCell>Đơn vị</TableCell>
                        <TableCell>Số lượng</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={4} align="center">Không có dữ liệu</TableCell>
                        </TableRow>
                    ) : (
                        data.map((item, index) => (
                            Object.entries(item.thongke).map(([donvi, soluong], idx) => (
                                <TableRow key={`${index}-${idx}`}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>{donvi}</TableCell>
                                    <TableCell>{soluong}</TableCell>
                                </TableRow>
                            ))
                        ))
                    )}
                </TableBody>
            </Table>
            <h2>Danh sách chưa tương tác</h2>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Bài viết</TableCell>
                        <TableCell>Đơn vị</TableCell>
                        <TableCell>Họ tên</TableCell>
                        <TableCell>Urls</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data.map((item, index) => (
                        item.chuatuongtac.map((chuatuongtacItem, idx) => {
                            const [donvi, hoten, url] = chuatuongtacItem.match(/\[(.*?)\]\s(.*?)\s\((.*)\)/).slice(1, 4);
                            return (
                                <TableRow key={`${index}-${idx}`}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>{donvi}</TableCell>
                                    <TableCell>{hoten}</TableCell>
                                    <TableCell>
                                        <a href={url} target="_blank" rel="noopener noreferrer">{url}</a>
                                    </TableCell>
                                </TableRow>
                            );
                        })
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
