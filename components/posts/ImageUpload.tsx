import { Upload, X, Loader2 } from 'lucide-react';
import Image from 'next/image';

interface ImageUploadProps {
  imagePreview: string | null;
  onImageSelect: (file: File | null) => void;
  onRemoveImage: () => void;
  disabled?: boolean;
  isLoading?: boolean;
}

export default function ImageUpload({
  imagePreview,
  onImageSelect,
  onRemoveImage,
  disabled = false,
  isLoading = false,
}: ImageUploadProps) {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    onImageSelect(file || null);
  };

  const loadingOverlay = isLoading && (
    <div className="absolute inset-0 flex items-center justify-center bg-white/60 z-10 backdrop-blur-[1px]">
      <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
    </div>
  );

  if (imagePreview) {
    return (
      <div className="relative w-full h-64 rounded-lg overflow-hidden border border-slate-200">
        {loadingOverlay}
        <Image
          src={imagePreview}
          alt="Preview"
          fill
          className="object-cover"
        />
        <button
          type="button"
          onClick={onRemoveImage}
          disabled={disabled || isLoading}
          className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors disabled:opacity-50 z-20"
        >
          <X size={16} />
        </button>
      </div>
    );
  }

  return (
    <label className={`relative flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-slate-300 rounded-lg transition-colors bg-slate-50 ${disabled || isLoading ? 'cursor-not-allowed opacity-70' : 'cursor-pointer hover:border-blue-400'}`}>
      {loadingOverlay}
      <div className="flex flex-col items-center justify-center pt-5 pb-6">
        <Upload className="w-12 h-12 text-slate-400 mb-3" />
        <p className="mb-2 text-sm text-slate-600">
          <span className="font-semibold">Clique para fazer upload</span>
        </p>
        <p className="text-xs text-slate-500">PNG, JPG, WEBP (máx. 10MB)</p>
      </div>
      <input
        type="file"
        className="hidden"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        onChange={handleFileChange}
        disabled={disabled || isLoading}
      />
    </label>
  );
}
