import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Dialog, DialogTitle, DialogContent, TextField, DialogActions } from '@mui/material';
import axios from 'axios';
import { getToken } from 'src/routes/auth';
import { useRouter } from 'src/routes/hooks';

function PageList() {
    const { id } = useParams();
    const token = getToken();
    const [pageData, setPageData] = useState([]);
    const [idDelete, setIdDelete] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const [confirmDelete, setConfirmDelete] = useState(false)
    const [openDialogAdd, setOpenDialogAdd] = useState(false)
    const [openEdit, setOpenEdit] = useState(false);
    const [selectedPage, setSelectedPage] = useState(null);
    const [addPage, setAddPage] = useState({
        team_id: id,
        name: '',
        url: '',
        prioritized: false,
    })
    const [editPage, setEditPage] = useState({
        _id: '',
        name: '',
        url: '',
        prioritized: false,
    })

    //hiển thị dữ liệu
    useEffect(() => {
        const fetchPages = async () => {
            try {
                const response = await axios.get(`http://192.168.3.101:19999/api/teams/${id}/pages`,
                    { headers: { Authorization: `Bearer ${getToken()}` } });
                setPageData(response.data);
            } catch (error) {
                console.error('Error fetching page data:', error);
                setError('Failed to fetch data. Please try again later.');
            }
        };

        fetchPages();
    }, [id]);

    //open dialog add page
    const dialogAddPage = () => {
        setOpenDialogAdd(true)
    }
    //nhập giá trị bổ sung trang
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setAddPage(prevState => ({
            ...prevState,
            [name]: value
        }));
    };
    const handleDialogClose = () => {
        setOpenDialogAdd(false)
    }
    //xử lý lưu trang mới
    const handleSaveAdd = async () => {
        setLoading(true);
        setError(null);
        try {
            // Lấy token từ nơi nào đó
            const response = await axios.post(
                'http://192.168.3.101:19999/api/pages/new',
                [addPage],
                { headers: { Authorization: `Bearer ${token}` } }
            );
            console.log(response.data);
            router.reload();
            handleDialogClose();
        } catch (error) {
            setError(error.message);
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    }

    //sửa thông tin trang
    const handleEditPage = (page) => {
        console.log(page.name);
        setSelectedPage(page)
        setEditPage({
            _id: page._id,
            name: page.name,
            url: page.url,
            prioritized: false,
        })
        setOpenEdit(true)
    }
    const closeEditDialog = () => {
        setOpenEdit(false)
    }
    const handleInputChangeEdit = (e) => {

    };
    const handleEditPageSave = (page) => {
        setSelectedPage(page);
        setEditPage({
            _id: page._id,
            name: page.name,
            url: page.url,
            prioritized: false,
        });
        setOpenEdit(true);
    }
    const handleSaveEdit = async () => {
        try {
            console.log('edit');
            const response = await axios.put(
                'http://192.168.3.101:19999/api/pages',
                editPage,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            router.reload();
            closeEditDialog();
        } catch (error) {
            setError(error.message);
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    //mở dialog confirm delete
    const dialogConfirmDelete = (page) => {
        setIdDelete(page)
        setConfirmDelete(true)
    }
    const handleDialogDeleteClose = () => {
        setConfirmDelete(false)
    }
    const handleConfirmDelete = async () => {
        try {
            await axios.delete(`http://192.168.3.101:19999/api/pages/${idDelete}`, {
                headers: { Authorization: `Bearer ${getToken()}` }
            });
            router.reload();
            handleDialogDeleteClose();
        } catch (error) {
            console.error('Error deleting page:', error);
        }
    };
    return (
        <Container>
            <Typography variant="h4" component="h1" gutterBottom>
                Danh sách các trang
            </Typography>
            <Button
                variant="contained"
                color="primary"
                style={{ marginBottom: '10px' }}
                onClick={dialogAddPage}
            >
                Thêm trang mới
            </Button>
            {error && <Typography color="error">{error}</Typography>}
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>TT</TableCell>
                            <TableCell>Tên trang</TableCell>
                            <TableCell>Đường dẫn</TableCell>
                            <TableCell>Chức năng</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {pageData.map((row, index) => (
                            <TableRow key={row._id}>
                                <TableCell>{index + 1}</TableCell>
                                <TableCell>{row.name}</TableCell>
                                <TableCell><a href={row.url} target="_blank" rel="noopener noreferrer">{row.url}</a></TableCell>
                                <TableCell>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={() => handleEditPage(row)}
                                        style={{ marginRight: '10px' }}
                                    >
                                        Sửa
                                    </Button>
                                    <Button
                                        variant="contained"
                                        color="secondary"
                                        onClick={() => dialogConfirmDelete(row._id)}
                                    >
                                        Xoá
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <DialogAddPage
                openDialogAdd={openDialogAdd}
                handleInputChange={handleInputChange}
                handleDialogClose={handleDialogClose}
                handleSaveAdd={handleSaveAdd}
                addPage={addPage}
            ></DialogAddPage>

            <DialogDelete
                confirmDelete={confirmDelete}
                handleConfirmDelete={handleConfirmDelete}
                handleDialogDeleteClose={handleDialogDeleteClose}
            ></DialogDelete>

            <DialogEdit
                openEdit={openEdit}
                closeEditDialog={closeEditDialog}
                handleSaveEdit={handleSaveEdit}
                selectedPage={selectedPage}
                handleEditPageSave={handleEditPageSave}
                handleInputChangeEdit={handleInputChangeEdit}
            ></DialogEdit>
        </Container>
    );
}

const DialogAddPage = ({ openDialogAdd, handleDialogClose, handleSaveAdd, handleInputChange, }) => (
    <Dialog open={openDialogAdd} onClose={handleDialogClose}>
        <DialogTitle>Thêm trang mới</DialogTitle>
        <DialogContent>
            <TextField
                autoFocus
                margin="dense"
                name="name"
                label="Tên trang mới"
                type="text"
                fullWidth
                onChange={(e) => handleInputChange(e)}
            />
            <TextField
                margin="dense"
                name="url"
                label="Đường dẫn"
                type="text"
                fullWidth
                onChange={(e) => handleInputChange(e)}
            />
        </DialogContent>
        <DialogActions>
            <Button onClick={handleDialogClose} color="primary">
                Hủy
            </Button>
            <Button onClick={handleSaveAdd} color="primary">
                Thêm
            </Button>
        </DialogActions>
    </Dialog>
);
const DialogDelete = ({ confirmDelete, handleDialogDeleteClose, handleConfirmDelete }) => (
    <Dialog open={confirmDelete} onClose={handleDialogDeleteClose}>
        <DialogTitle>Xác nhận xóa</DialogTitle>
        <DialogContent>
            <Typography>Bạn có chắc chắn muốn xóa trang này không?</Typography>
        </DialogContent>
        <DialogActions>
            <Button onClick={handleDialogDeleteClose} color="primary">
                Hủy
            </Button>
            <Button onClick={handleConfirmDelete} color="secondary">
                Xóa
            </Button>
        </DialogActions>
    </Dialog>
);
const DialogEdit = ({ openEdit, closeEditDialog, handleInputChangeEdit, handleSaveEdit, handleEditPageSave, selectedPage }) => (
    <Dialog open={openEdit} onClose={closeEditDialog}>
        <DialogTitle>Sửa thông tin trang</DialogTitle>
        <DialogContent>
            <TextField
                autoFocus
                margin="dense"
                name="name"
                label="Tên trang"
                type="text"
                fullWidth
                defaultValue={selectedPage?.name || ''}
                onChange={handleInputChangeEdit}
            />
            <TextField
                margin="dense"
                name="url"
                label="Đường dẫn"
                type="text"
                fullWidth
                defaultValue={selectedPage?.url || ''}
                onChange={handleInputChangeEdit}
            />
        </DialogContent>
        <DialogActions>
            <Button onClick={closeEditDialog} color="primary">
                Hủy
            </Button>
            <Button onClick={handleSaveEdit} color="primary">
                Lưu
            </Button>
        </DialogActions>
    </Dialog>
);


export default PageList;
