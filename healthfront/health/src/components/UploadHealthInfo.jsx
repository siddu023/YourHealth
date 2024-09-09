
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useWeb3Context } from "../contexts/useWeb3Context";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import "../styles/UploadHealthInfo.css";

const UploadHealthInfo = () => {
    const [name, setName] = useState('');
    const [date, setDate] = useState('');
    const [description, setDescription] = useState('');
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [address, setAddress] = useState('');
    const [accessAddress, setAccessAddress] = useState('');
    const [duration, setDuration] = useState('');
    const [healthRecords, setHealthRecords] = useState([]);
    const [inputAddress, setInputAddress] = useState('');

    const { web3State } = useWeb3Context();
    const { contractInstance, selectedAccount } = web3State;
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch health records for the selected account when the component mounts
        const fetchHealthRecords = async () => {
            try {
                const records = await contractInstance.getHealthData(selectedAccount);
                
                // Fetch the HealthInfo events for the selected account
                const eventFilter = contractInstance.filters.healthInfo(null, selectedAccount);
                const events = await contractInstance.queryFilter(eventFilter);
        
                // Create a detailed records array with health data, doctor address, and timestamp
                const detailedRecords = records.map((hash, index) => {
                    const event = events[index];
                    const timestamp = event.args[2];
                    const timestampNumber = parseInt(timestamp.toString(), 10);
                    return {
                        hash,
                        doctorAddress: event.args[0],
                        userAddress: event.args[1],
                        timestamp: new Date(timestampNumber * 1000).toLocaleString(),
                    };
                });
        
                setHealthRecords(detailedRecords);
                toast.success("Health records fetched successfully");
            } catch (error) {
                console.error(error);
                toast.error("Failed to fetch health records");
            }
        };
        
        fetchHealthRecords();
    }, [contractInstance, selectedAccount]);

    const fetchHealthRecordsByAddress = async (address) => {
        try {
            const records = await contractInstance.getHealthData(address);
    
            // Fetch the HealthInfo events for the specified address
            const eventFilter = contractInstance.filters.healthInfo(null, address);
            const events = await contractInstance.queryFilter(eventFilter);
    
            // Create a detailed records array with health data, doctor address, and timestamp
            const detailedRecords = records.map((hash, index) => {
                const event = events[index];
                const timestamp = event.args[2];
                const timestampNumber = parseInt(timestamp.toString(), 10);
                return {
                    hash,
                    doctorAddress: event.args[0],
                    userAddress: event.args[1],
                    timestamp: new Date(timestampNumber * 1000).toLocaleString(),
                };
            });
    
            setHealthRecords(detailedRecords);
            toast.success("Health records fetched successfully");
        } catch (error) {
            console.error(error);
            toast.error("Failed to fetch health records");
        }
    };

    const uploadInfoHash = async (healthInfoHash) => {
        await toast.promise(contractInstance.reigisterUsersHealthInfo(healthInfoHash, address), {
            loading: "Transaction is pending",
            success: "Transaction is successful",
            error: "Transaction failed"
        });
    };

    const handleImage = (e) => {
        const fileList = e.target.files;
        setImages(prevImages => [
            ...prevImages,
            ...Array.from(fileList)
        ]);
    };

    const handleHealthInfoUpload = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('name', name);
        formData.append('date', date);
        formData.append('description', description);
        formData.append('address', address);
        images.forEach((file) => {
            formData.append('images', file);
        });

        try {
            const url = `http://localhost:3000/api/uploadHealthInfo`;
            const config = {
                headers: {
                    'content-type': 'multipart/form-data',
                }
            };
            const res = await axios.post(url, formData, config);
            toast.success("File uploaded");
            await uploadInfoHash(res.data.ipfshash);
            setLoading(false);
        } catch (error) {
            console.error(error);
            toast.error("Data update failed");
        } finally {
            setLoading(false);
        }
    };

    const handleAccess = async (e) => {
        e.preventDefault();
        await toast.promise(contractInstance.grantAccess(accessAddress, duration * 60), {
            loading: "Transaction is pending",
            success: "Transaction is successful",
            error: "Transaction failed"
        });
        toast.success("Access granted");
    };

    const handleGetData = async (e) => {
        e.preventDefault();
        await fetchHealthRecordsByAddress(inputAddress);
    };

    const handleViewDocument = (hash, userAddress) => {
        navigate(`/getHealthInfo/${hash}/${userAddress}`);
    };

    return (
        <div className="container">
            <section className="upload-section">
                <h1>Upload Patient Data</h1>
                <form onSubmit={handleHealthInfoUpload}>
                    <div className="form-group">
                        <label>Date</label>
                        <input type='date' value={date} onChange={(e) => setDate(e.target.value)} required />
                    </div>
                    <div className="form-group">
                        <label>Name</label>
                        <input type='text' value={name} onChange={(e) => setName(e.target.value)} required />
                    </div>
                    <div className="form-group">
                        <label>Description</label>
                        <input type='text' value={description} onChange={(e) => setDescription(e.target.value)} required />
                    </div>
                    <div className="form-group">
                        <label>Images</label>
                        <input type="file" accept="image/*" onChange={handleImage} required multiple />
                    </div>
                    <div className="form-group">
                        <label>Address</label>
                        <input type='text' value={address} onChange={(e) => setAddress(e.target.value)} required />
                    </div>
                    <button type="submit">Submit</button>
                </form>
            </section>

            <section className="access-section">
                <h2>Give Access</h2>
                <form onSubmit={handleAccess}>
                    <div className="form-group">
                        <label>Access Address</label>
                        <input type='text' value={accessAddress} onChange={(e) => setAccessAddress(e.target.value)} required />
                    </div>
                    <div className="form-group">
                        <label>Duration (in minutes)</label>
                        <input type='number' value={duration} onChange={(e) => setDuration(e.target.value)} required />
                    </div>
                    <button type="submit">Give Access</button>
                </form>
            </section>

            <section className="fetch-section">
                <h2>Fetch Health Data by Address</h2>
                <div className="form-group">
                    <label>Input Address</label>
                    <input type='text' value={inputAddress} onChange={(e) => setInputAddress(e.target.value)} />
                    <button type="button" onClick={handleGetData}>Get Data</button>
                </div>
            </section>

            <section className="records-section">
                <h2>Health Records</h2>
                <div className="records-list">
                    {healthRecords.length > 0 ? (
                        healthRecords.map((record, index) => (
                            <div key={index} className="record-box">
                                {/* <p><strong>Hash:</strong> {record.hash}</p> */}
                                <p><strong>Doctor Address:</strong> {record.doctorAddress}</p>
                                <p><strong>Timestamp:</strong> {record.timestamp}</p>
                                <button onClick={() => handleViewDocument(record.hash, record.userAddress)} className="view-link">View Document</button>
                            </div>
                        ))
                    ) : (
                        <p>No records available</p>
                    )}
                </div>
            </section>
        </div>
    );
};

export default UploadHealthInfo;
