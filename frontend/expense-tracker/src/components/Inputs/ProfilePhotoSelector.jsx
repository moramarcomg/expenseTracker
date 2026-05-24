import React from 'react'
import { LuUser, LuUpload, LuTrash } from 'react-icons/lu'

const ProfilePhotoSelector = ({ image, onImageSelect }) => {
    const inputRef = React.useRef(null);
    const [previewUrl, setPreviewUrl] = React.useState(null);

    const handleImageSelect = (event) => {
        const file = event.target.files[0];
        if (file) {
            onImageSelect(file);
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
        }
    };

    const handleRemoveImage = () => {
        onImageSelect(null);
        setPreviewUrl(null);
    };

    const onChooseFile = () => {
        inputRef.current.click();
    };

    return (
        <div className="flex items-center gap-6 mb-4">
            <input
                type="file"
                accept="image/*"
                ref={inputRef}
                onChange={handleImageSelect}
                className="hidden"
            />

            {!image ? (
                <div className="relative w-20 h-20">
                    <div className="w-20 h-20 flex items-center justify-center bg-purple-100 rounded-full">
                        <LuUser className="text-4xl text-primary" />
                    </div>
                    <button
                        type="button"
                        className="w-8 h-8 flex items-center justify-center bg-primary text-white rounded-full absolute -bottom-1 -right-1 cursor-pointer"
                        onClick={onChooseFile}
                    >
                        <LuUpload size={20} />
                    </button>
                </div>
            ) : (
                <div className="relative w-20 h-20">
                    <img
                        src={previewUrl}
                        alt="Profile Photo"
                        className="w-20 h-20 rounded-full object-cover"
                    />
                    <button
                        type="button"
                        className="w-8 h-8 flex items-center justify-center bg-red-500 text-white rounded-full absolute -bottom-1 -right-1 cursor-pointer"
                        onClick={handleRemoveImage}
                    >
                        <LuTrash size={14} />
                    </button>
                </div>
            )}
        </div>
    );
}

export default ProfilePhotoSelector