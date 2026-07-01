"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
    label: string;
    value: string;
    onChange: (url: string) => void;
    optional?: boolean;
    hint?: string;
    onUploadingChange?: (uploading: boolean) => void;
};

export default function ImageUploadField({
    label,
    value,
    onChange,
    optional = false,
    hint,
    onUploadingChange,
}: Props) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState("");
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    useEffect(() => {
        return () => {
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [previewUrl]);

    async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;

        setError("");

        if (previewUrl) {
            URL.revokeObjectURL(previewUrl);
        }

        setPreviewUrl(URL.createObjectURL(file));
        setUploading(true);
        onUploadingChange?.(true);

        try {
            const formData = new FormData();
            formData.append("file", file);

            const response = await fetch("/api/admin/upload", {
                method: "POST",
                body: formData,
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.error || "No se pudo subir la imagen");
                setPreviewUrl(null);
                onChange("");
                return;
            }

            onChange(data.url);
        } catch {
            setError("Error al subir la imagen");
            setPreviewUrl(null);
            onChange("");
        } finally {
            setUploading(false);
            onUploadingChange?.(false);
            if (inputRef.current) {
                inputRef.current.value = "";
            }
        }
    }

    function handleRemove() {
        if (previewUrl) {
            URL.revokeObjectURL(previewUrl);
            setPreviewUrl(null);
        }
        onChange("");
        setError("");
        if (inputRef.current) {
            inputRef.current.value = "";
        }
    }

    const displayUrl = previewUrl || value || null;

    return (
        <div>
            <label className="block mb-1 font-medium">
                {label}
                {optional && (
                    <span className="text-gray-400 font-normal"> (opcional)</span>
                )}
            </label>

            {hint && <p className="text-sm text-gray-500 mb-2">{hint}</p>}

            <div className="flex flex-col sm:flex-row gap-4 items-start">
                {displayUrl ? (
                    <img
                        src={displayUrl}
                        alt="Vista previa"
                        className="w-24 h-24 object-cover rounded border shrink-0"
                    />
                ) : (
                    <div className="w-24 h-24 border rounded flex items-center justify-center text-xs text-gray-400 shrink-0">
                        Sin imagen
                    </div>
                )}

                <div className="flex flex-col gap-2">
                    <input
                        ref={inputRef}
                        type="file"
                        accept="image/jpeg,image/png,image/webp,image/gif"
                        onChange={handleFileChange}
                        disabled={uploading}
                        className="block w-full text-sm text-gray-700 file:mr-3 file:rounded file:border file:border-gray-300 file:bg-white file:px-3 file:py-2 file:text-sm file:font-medium hover:file:bg-gray-50 disabled:opacity-60"
                    />

                    {value && !uploading && (
                        <button
                            type="button"
                            onClick={handleRemove}
                            className="text-sm text-red-600 underline w-fit"
                        >
                            Quitar imagen
                        </button>
                    )}

                    {uploading && (
                        <p className="text-sm text-gray-500">Subiendo imagen...</p>
                    )}
                </div>
            </div>

            {error && (
                <p className="text-red-600 text-sm mt-2" role="alert">
                    {error}
                </p>
            )}
        </div>
    );
}
