import cloudinary from '../config/cloudinary.js';

// Upload image to Cloudinary
export const uploadImage = async (file, folder = 'shg-mart') => {
    try {
        const result = await cloudinary.uploader.upload(file.path, {
            folder: folder,
            resource_type: 'auto',
        });

        return {
            url: result.secure_url,
            publicId: result.public_id,
        };
    } catch (error) {
        throw new Error('Image upload failed: ' + error.message);
    }
};

// Delete image from Cloudinary
export const deleteImage = async (publicId) => {
    try {
        await cloudinary.uploader.destroy(publicId);
    } catch (error) {
        throw new Error('Image deletion failed: ' + error.message);
    }
};

// Upload multiple images
export const uploadMultipleImages = async (files, folder = 'shg-mart') => {
    try {
        const uploadPromises = files.map((file) => uploadImage(file, folder));
        return await Promise.all(uploadPromises);
    } catch (error) {
        throw new Error('Multiple image upload failed: ' + error.message);
    }
};
