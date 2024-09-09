import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";
import '../styles/getHealthInfo.css';

const GetHealthInfo = () => {
    const { hash, userAddress } = useParams();
    const [healthInfo, setHealthInfo] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHealthInfo = async () => {
            try {
                // Fetch the health information from IPFS or backend server
                const response = await axios.post('http://localhost:3000/api/getHealthInfo', {
                    hash,
                    userAddress
                });

                const data = response.data;

                // Convert the timestamp to a readable date format (assuming it's in milliseconds)
                const formattedDate = data.date ? new Date(data.date).toLocaleString() : 'N/A';

                // Update the healthInfo state with the formatted date
                setHealthInfo({
                    ...data,
                    date: formattedDate,
                });

                setLoading(false);
            } catch (error) {
                console.error(error);
                toast.error("Failed to fetch health information");
                setLoading(false);
            }
        };

        if (hash) {
            fetchHealthInfo();
        }
    }, [hash, userAddress]);

    if (loading) {
        return <p>Loading...</p>;
    }

    return (
        <div className="get-health-info">
            <h1>Health Information</h1>
            {healthInfo ? (
                <div className="health-info-details">
                    <p><strong>Name:</strong> {healthInfo.name || 'N/A'}</p>
                    <p><strong>Date:</strong> {healthInfo.date}</p>
                    <p><strong>Description:</strong> {healthInfo.description || 'N/A'}</p>
                    {healthInfo.photos && healthInfo.photos.length > 0 ? (
                        <div className="health-info-images">
                            {healthInfo.photos.map((photo, index) => (
                                <img key={index} src={photo} alt={`Health Document ${index}`} />
                            ))}
                        </div>
                    ) : (
                        <p>No images available</p>
                    )}
                </div>
            ) : (
                <p>No health information found</p>
            )}
        </div>
    );
};

export default GetHealthInfo;



