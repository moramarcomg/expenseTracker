import React from 'react'
import { LuUser, LuUpload, LuTrash } from 'react-icons/lu'

// ProfilePhotoSelector: componente para seleccionar foto de perfil
// Recibe props: image (valor actual) y onImageSelect (función para actualizar al padre)
const ProfilePhotoSelector = ({ image, onImageSelect }) => {
    // useRef: crea una referencia persistente al elemento <input> para controlarlo manualmente
    const inputRef = React.useRef(null);
    // previewUrl: estado para la URL temporal de la imagen seleccionada (para mostrar preview)
    const [previewUrl, setPreviewUrl] = React.useState(null);

    // handleImageSelect: se ejecuta cuando el usuario selecciona un archivo
    const handleImageSelect = (event) => {
        // event.target.files[0] obtiene el primer archivo seleccionado del input file
        const file = event.target.files[0];
        if (file) {
            onImageSelect(file);  // Envía el archivo al componente padre
            // URL.createObjectURL(file): crea una URL temporal para mostrar la imagen
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);  // Guarda la URL en el estado para mostrarla
        }
    };

    // handleRemoveImage: elimina la imagen seleccionada
    const handleRemoveImage = () => {
        onImageSelect(null);  // Notifica al padre que no hay imagen
        setPreviewUrl(null);  // Limpia la preview
    };

    // onChooseFile: simula un click en el input file oculto
    const onChooseFile = () => {
        inputRef.current.click();  // .current accede al elemento DOM real
    };

    return (
        <div className="flex items-center gap-6 mb-4">
            {/*
              Input de tipo file oculto (className="hidden")
              accept="image/*" solo permite seleccionar imágenes
              ref={inputRef} conecta este input con inputRef para controlarlo
            */}
            <input
                type="file"
                accept="image/*"
                ref={inputRef}
                onChange={handleImageSelect}
                className="hidden"
            />

            {/* Operador ternario: si NO hay imagen, muestra el icono; si hay, muestra la foto */}
            {!image ? (
                <div className="relative w-20 h-20">
                    <div className="w-20 h-20 flex items-center justify-center bg-purple-100 rounded-full">
                        {/* LuUser: icono de usuario (de react-icons) */}
                        <LuUser className="text-4xl text-primary" />
                    </div>
                    <button
                        type="button"  // type="button" evita que envíe el formulario
                        className="w-8 h-8 flex items-center justify-center bg-primary text-white rounded-full absolute -bottom-1 -right-1 cursor-pointer"
                        onClick={onChooseFile}
                    >
                        <LuUpload size={20} />
                    </button>
                </div>
            ) : (
                <div className="relative w-20 h-20">
                    {/* img de preview: src apunta a la URL temporal creada con createObjectURL */}
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
