import axios from "axios";

const CLOUDINARY_UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
const CLOUDINARY_CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

export const uploadMedia = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET || "");

    try {
        const response = await axios.post(
            `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/upload`,
            formData
        );
        return response.data.secure_url;
    } catch (error) {
        console.error("Cloudinary upload failed:", error);
        throw error;
    }
};

export const getOptimizedImage = (url: string, width: number = 400) => {
    if (!url || !url.includes("cloudinary.com")) return url;

    const transformation = `c_scale,w_${width},f_auto,q_auto:low`;
    return url.replace("/upload/", `/upload/${transformation}/`);
};
