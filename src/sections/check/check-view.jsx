import axios from 'axios';
import React, { useState } from 'react';

import Box from '@mui/material/Box';
import { styled } from '@mui/system';
import Input from '@mui/material/Input';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import TextareaAutosize from '@mui/material/TextareaAutosize';
import CircularProgress from '@mui/material/CircularProgress';

import DisplayTable from './displayData';

// Estil hóa tùy chỉnh bằng cách sử dụng styled của MUI
const CustomContainer = styled(Container)({
  textAlign: 'center',
  maxWidth: '800px',
  margin: '50px auto',
  backgroundColor: '#fff',
  padding: '20px',
  borderRadius: '10px',
  boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
});

const CustomTextarea = styled(TextareaAutosize)({
  width: '80%',
  padding: '10px',
  marginBottom: '10px',
  marginRight: '20px',
  marginTop: '50px',
  border: '1px solid #72b915',
  borderRadius: '5px',
  color: '#fff',
  backgroundColor: '#01434e',
});

// const CustomButton = styled(Button)({
//   color: '#fff',
//   border: 'none',
//   padding: '10px 20px',
//   borderRadius: '5px',
//   cursor: 'pointer',
//   margin: '15px',
// });

const FileUploadLabel = styled('label')({
  display: 'inline-block',
  backgroundColor: '#ff7b00',
  color: '#fff',
  padding: '10px 20px',
  borderRadius: '5px',
  cursor: 'pointer',
  marginBottom: '30px',
  // marginTop: '30px',

});

const CustomBox = styled(Box)({
  textAlign: 'center',
  width: "100%",
  marginRight: '20px',
});

const LoadingButton = styled(Button)(({ theme }) => ({
  position: 'relative',
}));

const LoadingIndicator = styled(CircularProgress)(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  marginTop: -12,
  marginLeft: -12,
}));

export default function CheckView() {
  const [inputUrls, setInputUrls] = useState([]);
  const [dataTable, setDataTable] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (event) => {
    const urls = event.target.value.split(',').map(url => url.trim()).filter(url => url);
    setInputUrls(urls);
  };

  const handleClick = async () => {
    const requestBody = { pageUrls: inputUrls };
    console.log(requestBody);
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('http://localhost:5000/api/crawl', requestBody);
      console.log(response);
      if (response.status === 200) {
        setDataTable(response.data); // Lưu dữ liệu nhận được dưới dạng mảng đối tượng
      } else {
        setError(`Lỗi: ${response.statusText}`);
      }
    } catch (error1) {
      setError(`Lỗi: ${error1.message}`);
    } finally {
      setLoading(false);
      console.log(loading);
    }
  };

  return (
    <CustomContainer>
      {/* <Box
        component="img"
        src="/assets/tt286.png"
        alt=""
        sx={{
          maxWidth: '15%',
          height: 'auto',
          display: 'block',
          margin: '0 auto',
        }}
      /> */}
      <Typography variant="h4" align="center" sx={{ color: 'red' }}>
        Hệ thống quản lý, giám sát tương tác các kênh truyền thông MXH Facebook
      </Typography>
      <CustomTextarea id="linkfb" onChange={handleChange} />
      <CustomBox id="blockD">
        <FileUploadLabel htmlFor="dataFile">
          <span>Tải lên tệp tin</span>
        </FileUploadLabel>
        <Input type="file" id="dataFile" sx={{ display: 'none' }} />
        <LoadingButton
          variant="contained"
          color="primary"
          disabled={loading}
          id="btnEd"
          onClick={handleClick} sx={{ backgroundColor: '#68cf08' }}>
          {loading ? 'Đang xử lý' : 'Kiểm tra'}
          {loading && <LoadingIndicator size={24} />}
        </LoadingButton>
      </CustomBox>
      <DisplayTable data={dataTable} />
      {error && <Typography color="error">{error}</Typography>}
    </CustomContainer>
  );
};
