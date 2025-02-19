import React, { useEffect, useState } from "react";
import { getProviders } from "../../services/api";
import { Box, Grid, Card, CardContent, Typography, TextField, Button } from "@mui/material";

const ProviderList = () => {
    const [providers, setProviders] = useState([]);
    const [location, setLocation] = useState('');
    const [serviceType, setServiceType] = useState('');

    const fetchProviders = async () =>{
        try{
            const params = {};
            if(location) params.location = location;
            if(serviceType) params.service_type = serviceType;
            const res = await getProviders(params);
            setProviders(res.data);
        }catch(err){
            console.error('Failed to fetch providers:', err);
        }
    };

    useEffect(() =>{
        fetchProviders();
    }, []);

    const handleSearch = () =>{
        fetchProviders();
    };

    return(
        <Box sx={{ p: 2 }}>
            <Typography variant="h5" gutterBottom>Service Providers</Typography>
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                <TextField
                    label="Location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                />
                <TextField
                    label="Service Type"
                    value={serviceType}
                    onChange={(e) => setServiceType(e.target.value)}
                />
                <Button variant="contained" onClick={handleSearch}>
                    Search
                </Button>
            </Box>
    
            <Grid container spacing={2}>
                {providers.map((provider) => (
                    <Grid item xs={12} sm={6} md={4} key={provider._id}>
                        <Card>
                            <CardContent>
                            <Typography variant="h6">{provider.name}</Typography>
                            <Typography>Location: {provider.location}</Typography>
                            <Typography>Services: {provider.services_offered?.join(', ')}</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default ProviderList;