import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextareaAutosize from '@mui/material/TextareaAutosize';
import axios from 'axios';
import DisplayTable from './displayData'; // Assuming DisplayTable is correctly imported
import { getToken } from 'src/routes/auth';
import { initializeWebSocket } from './../../hooks/ws';

const CustomTextarea = ({ value, onChange }) => (
    <TextareaAutosize
        placeholder="Nhập nội dung bài viết cần kiểm tra"
        value={value}
        onChange={onChange}
        style={{
            width: '80%',
            padding: '10px',
            marginBottom: '10px',
            marginRight: '20px',
            marginTop: '50px',
            border: '1px solid #72b915',
            borderRadius: '5px',
            color: '#fff',
            backgroundColor: '#01434e',
        }}
    />
);

export default function PostContent() {
    const [inputUrls, setInputUrls] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [dataTable, setDataTable] = useState([]);
    const [dataApi, setDataApi] = useState(null);

    useEffect(() => {
        const cleanupWebSocket = initializeWebSocket(
            (payload) => {
                alert(JSON.stringify(payload));
            },
            () => {
                alert("Mất kết nối đến máy chủ");
            }
        );

        // Cleanup WebSocket khi component bị unmount
        return () => {
            cleanupWebSocket();
        };
    }, []);


    const handleChange = (event) => {
        const urls = event.target.value.split(',').map(url => url.trim()).filter(url => url);
        setInputUrls(urls);
    };

    const handleClick = async () => {
        setError(null); // Clear previous errors
        setLoading(true);

        try {
            const requestBody = inputUrls;
            const response = await axios.post('http://192.168.3.101:19999/api/crawl/post', requestBody, { headers: { Authorization: `Bearer ${getToken()}` } });

            if (response.status === 200) {
                setDataTable(response.data); // Update state with response data
            } else {
                setError(`Lỗi: ${response.statusText}`);
            }
        } catch (error) {
            setError(`Lỗi: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await axios.get('http://192.168.3.101:19999/api/crawl/result', { headers: { Authorization: `Bearer ${getToken()}` } });
                setDataApi(response.data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Example of using useEffect to observe loading state changes
    useEffect(() => {
        console.log("Loading state changed:", loading);
    }, [loading]);

    return (
        <>
            <CustomTextarea id="linkfb" onChange={handleChange} />
            <Box marginTop={2}>
                <Button variant="contained" color="primary" onClick={handleClick} disabled={loading}>
                    {loading ? 'Đang kiểm tra...' : 'Kiểm tra'}
                </Button>
            </Box>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {(Array.isArray(dataTable) && dataTable.length > 0) ? (
                <DisplayTable data={dataTable} />
            ) : (
                <DisplayTable data={Array.isArray(dataApi) ? dataApi : []} />
            )}
        </>
    );
}
