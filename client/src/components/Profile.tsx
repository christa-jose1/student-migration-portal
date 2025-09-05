import React, { useEffect, useState } from "react";
import {
    Grid,
    Paper,
    Typography,
    IconButton,
    TextField,
    Button,
    Avatar,
} from "@mui/material";
import { Pencil } from "lucide-react";
import axios from "axios";
import { motion } from "framer-motion";

interface User {
    name: string;
    email: string;
    phone: string;
    countriesChosen: string[];
    courses: string[];
    universities: string[];
    image?: string;
    education?: string; // Changed to a single string field
}

const Profile: React.FC = () => {
    const [userData, setUserData] = useState<User | null>(null);
    const [editingField, setEditingField] = useState<null | string>(null);
    const [newValue, setNewValue] = useState("");
    const [preview, setPreview] = useState<string | null>(null);

    const userId = sessionStorage.getItem("mongoId");

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await axios.post("http://localhost:5000/api/auth/get-user-by-id", {
                    userId,
                });
                const user = res.data;
                setUserData(user);
                
                // Set profile image
                if (user?.image) {
                    setPreview(user.image.startsWith("http") 
                        ? user.image 
                        : `http://localhost:5000${user.image}`);
                }
            } catch (error) {
                console.error("Error fetching user:", error);
            }
        };
        fetchUser();
    }, []);

    const handleSave = async () => {
        if (!userData || !editingField) return;
        
        try {
            const updated = { ...userData, [editingField]: newValue };
            setUserData(updated);
            setEditingField(null);
            
            await axios.put(`http://localhost:5000/api/auth/update-${editingField}/${userId}`, {
                [editingField]: newValue,
            });
        } catch (error) {
            console.error("Error updating field:", error);
        }
    };

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !userId) return;

        const formData = new FormData();
        formData.append("image", file);

        try {
            const res = await axios.put(
                `http://localhost:5000/api/auth/upload-image/${userId}`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );
            const imagePath = res.data.user.image;
            const imageUrl = `http://localhost:5000${imagePath}`;
            setUserData((prev) => (prev ? { ...prev, image: imagePath } : null));
            setPreview(imageUrl);
        } catch (err) {
            console.error("Image upload failed", err);
        }
    };

    const cardStyles = {
        p: 3,
        bgcolor: "#1e293b",
        color: "#fff",
        border: "1px solid #334155",
        borderRadius: "12px",
        transition: "all 0.3s ease",
        "&:hover": {
            borderColor: "#60a5fa",
        },
    };

    return (
        <Grid container spacing={3} padding={4} color="#fff">
            {/* Left Column - Education */}
            <Grid item xs={12} md={3}>
                <Paper elevation={3} 
                    sx={{
                        ...cardStyles,
                        position: "relative"
                    }}>
                    <IconButton 
                        sx={{ position: "absolute", top: 8, right: 8 }}
                        onClick={() => {
                            setEditingField("education");
                            setNewValue(userData?.education || "");
                        }}
                    >
                        <Pencil color="#60a5fa" size={16} />
                    </IconButton>
                    <Typography variant="h6" gutterBottom>Education Qualification</Typography>
                    <Typography variant="body1">{userData?.education || "Not specified"}</Typography>
                </Paper>
            </Grid>

            {/* Center Column - User Info */}
            <Grid item xs={12} md={6}>
                <Paper
                    elevation={3}
                    sx={{
                        ...cardStyles,
                        borderWidth: "2px",
                        borderColor: "#60a5fa",
                        boxShadow: "0 0 0 3px rgba(96, 165, 250, 0.4)",
                    }}
                >
                    <Grid container direction="column" alignItems="center" spacing={2}>
                        <Grid item>
                            <Avatar
                                src={preview || ""}
                                sx={{ width: 100, height: 100 }}
                            />
                            <Button
                                variant="outlined"
                                component="label"
                                sx={{ mt: 1, color: "#60a5fa", borderColor: "#60a5fa" }}
                            >
                                Upload Image
                                <input hidden accept="image/*" type="file" onChange={handleImageChange} />
                            </Button>
                        </Grid>

                        {/* Name field - editable */}
                        <Grid
                            item
                            container
                            justifyContent="space-between"
                            alignItems="center"
                            sx={{ width: "100%", mt: 2 }}
                        >
                            <div>
                                <Typography variant="subtitle1">Name</Typography>
                                <Typography variant="body2">{userData?.name}</Typography>
                            </div>
                            <IconButton
                                onClick={() => {
                                    setEditingField("name");
                                    setNewValue(userData?.name || "");
                                }}
                            >
                                <Pencil color="#60a5fa" />
                            </IconButton>
                        </Grid>

                        {/* Email field - not editable */}
                        <Grid
                            item
                            container
                            justifyContent="space-between"
                            alignItems="center"
                            sx={{ width: "100%", mt: 2 }}
                        >
                            <div>
                                <Typography variant="subtitle1">Email</Typography>
                                <Typography variant="body2">{userData?.email}</Typography>
                            </div>
                        </Grid>

                        {/* Phone field - editable */}
                        <Grid
                            item
                            container
                            justifyContent="space-between"
                            alignItems="center"
                            sx={{ width: "100%", mt: 2 }}
                        >
                            <div>
                                <Typography variant="subtitle1">Phone</Typography>
                                <Typography variant="body2">{userData?.phone}</Typography>
                            </div>
                            <IconButton
                                onClick={() => {
                                    setEditingField("phone");
                                    setNewValue(userData?.phone || "");
                                }}
                            >
                                <Pencil color="#60a5fa" />
                            </IconButton>
                        </Grid>
                    </Grid>
                </Paper>
            </Grid>

            {/* Right Column - User Preferences */}
            <Grid item xs={12} md={3}>
                <Paper elevation={3} sx={cardStyles}>
                    <Typography variant="h6">Details</Typography>

                    <Typography variant="subtitle1" sx={{ mt: 2 }}>Countries</Typography>
                    <ul>{userData?.countriesChosen?.map((c, i) => <li key={i}>{c}</li>) || <li>None selected</li>}</ul>

                    <Typography variant="subtitle1" sx={{ mt: 2 }}>Courses</Typography>
                    <ul>{userData?.courses?.map((c, i) => <li key={i}>{c}</li>) || <li>None selected</li>}</ul>

                    <Typography variant="subtitle1" sx={{ mt: 2 }}>Universities</Typography>
                    <ul>{userData?.universities?.map((u, i) => <li key={i}>{u}</li>) || <li>None selected</li>}</ul>
                </Paper>
            </Grid>

            {/* Edit Field Modal */}
            {editingField && (
                <motion.div
                    className="fixed top-0 left-0 w-full h-full bg-black/60 flex items-center justify-center z-50"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                >
                    <motion.div
                        className="bg-[#1e293b] p-6 rounded-xl shadow-lg w-full max-w-md"
                        initial={{ y: -50 }}
                        animate={{ y: 0 }}
                    >
                        <Typography variant="h6" color="#60a5fa" gutterBottom>
                            Edit {editingField === "education" ? "Education Qualification" : editingField}
                        </Typography>
                        <TextField
                            fullWidth
                            variant="outlined"
                            value={newValue}
                            onChange={(e) => setNewValue(e.target.value)}
                            sx={{ 
                                mt: 2,
                                '& .MuiOutlinedInput-root': {
                                    '& fieldset': {
                                        borderColor: '#334155',
                                    },
                                    '&:hover fieldset': {
                                        borderColor: '#60a5fa',
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: '#60a5fa',
                                    },
                                    '& input': {
                                        color: 'white'
                                    }
                                }
                            }}
                        />
                        <Grid container justifyContent="flex-end" spacing={2} sx={{ mt: 2 }}>
                            <Grid item>
                                <Button 
                                    variant="outlined" 
                                    onClick={() => setEditingField(null)} 
                                    sx={{ color: '#fff', borderColor: '#334155' }}
                                >
                                    Cancel
                                </Button>
                            </Grid>
                            <Grid item>
                                <Button 
                                    variant="contained" 
                                    onClick={handleSave} 
                                    sx={{ bgcolor: '#60a5fa', '&:hover': { bgcolor: '#3b82f6' } }}
                                >
                                    Save
                                </Button>
                            </Grid>
                        </Grid>
                    </motion.div>
                </motion.div>
            )}
        </Grid>
    );
};

export default Profile;