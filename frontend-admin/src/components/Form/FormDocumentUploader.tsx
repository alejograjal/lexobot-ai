import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Label } from "@/components/ui/label";
import { UploadCloud, FileText } from "lucide-react";

interface FormDocumentUploaderProps {
    onFileChange: (file: File | null) => void;
    error?: string;
    initialFile?: File | null;
}

export const FormDocumentUploader = ({
    onFileChange,
    error,
    initialFile = null
}: FormDocumentUploaderProps) => {
    const [selectedFile, setSelectedFile] = useState<File | null>(initialFile);

    const onDrop = useCallback(
        (acceptedFiles: File[]) => {
            const file = acceptedFiles[0];
            setSelectedFile(file);
            onFileChange(file);
        },
        [onFileChange]
    );

    const {
        getRootProps,
        getInputProps,
        isDragActive,
        open
    } = useDropzone({
        onDrop,
        accept: {
            "application/pdf": [".pdf"]
        },
        multiple: false,
        noClick: true,
        noKeyboard: true
    });

    return (
        <div className="space-y-2">
            <Label className="font-medium">Archivo PDF</Label>
            <div
                {...getRootProps()}
                className={`flex flex-col items-center justify-center h-60 border-2 border-dashed rounded-xl cursor-pointer transition-colors py-4 px-4 ${isDragActive ? "border-primary bg-muted" : "border-gray-300"}`}
            >
                <input {...getInputProps()} />
                <UploadCloud className="mb-3 h-6 w-6 text-muted-foreground" />
                {selectedFile ? (
                    <p className="text-sm text-foreground flex items-center justify-center gap-1">
                        <FileText className="h-4 w-4 text-primary" />
                        {selectedFile.name}
                    </p>
                ) : (
                    <p className="text-sm text-muted-foreground text-center">
                        Arrastra el archivo aquí o{" "}
                        <span
                            className="text-primary font-medium hover:underline cursor-pointer"
                            onClick={open}
                        >
                            haz clic para seleccionarlo
                        </span>
                    </p>
                )}
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}
        </div>
    );
};
