import { useState, useRef } from 'react';
import { Camera, Upload, File, X, Check, AlertCircle } from 'lucide-react';
import { Button } from '../ui/button';
import { cn } from '../ui/utils';
import { motion, AnimatePresence } from 'motion/react';

interface DocumentUploadMobileProps {
  label: string;
  description?: string;
  accept?: string;
  onUpload: (file: File) => void;
  variant?: 'mobile' | 'desktop';
  required?: boolean;
  documentType?: 'id' | 'proof' | 'other';
}

export function DocumentUploadMobile({
  label,
  description,
  accept = 'image/*',
  onUpload,
  variant = 'mobile',
  required = false,
  documentType = 'other'
}: DocumentUploadMobileProps) {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsUploading(true);
      
      // Créer une preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
      
      setUploadedFile(file);
      onUpload(file);
    }
  };

  const handleRemove = () => {
    setUploadedFile(null);
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (cameraInputRef.current) cameraInputRef.current.value = '';
  };

  const getDocumentFrame = () => {
    switch (documentType) {
      case 'id':
        return (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-[85%] h-[60%] border-4 border-white rounded-lg shadow-2xl">
              <div className="absolute top-2 left-2 w-8 h-8 border-t-4 border-l-4 border-white rounded-tl-lg" />
              <div className="absolute top-2 right-2 w-8 h-8 border-t-4 border-r-4 border-white rounded-tr-lg" />
              <div className="absolute bottom-2 left-2 w-8 h-8 border-b-4 border-l-4 border-white rounded-bl-lg" />
              <div className="absolute bottom-2 right-2 w-8 h-8 border-b-4 border-r-4 border-white rounded-br-lg" />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  // Variante Mobile : Gros bouton tactile avec capture photo
  if (variant === 'mobile') {
    return (
      <div className="space-y-3">
        {/* Label */}
        <div className="flex items-center justify-between">
          <label className="font-medium text-[#111827]">
            {label}
            {required && <span className="text-[#DC2626] ml-1">*</span>}
          </label>
          {uploadedFile && (
            <span className="text-sm text-[#10B981] flex items-center gap-1">
              <Check className="h-4 w-4" />
              Envoyé
            </span>
          )}
        </div>
        
        {description && (
          <p className="text-sm text-[#6B7280]">{description}</p>
        )}

        <AnimatePresence mode="wait">
          {!uploadedFile ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-3"
            >
              {/* Bouton principal : Prendre une photo */}
              <button
                onClick={() => cameraInputRef.current?.click()}
                disabled={isUploading}
                className={cn(
                  "w-full flex flex-col items-center justify-center gap-3 p-8",
                  "bg-gradient-to-br from-[#2563EB] to-[#1d4ed8] text-white rounded-xl",
                  "active:scale-[0.98] transition-all shadow-lg",
                  "disabled:opacity-50 disabled:cursor-not-allowed"
                )}
              >
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                  <Camera className="h-8 w-8" />
                </div>
                <div className="text-center">
                  <p className="font-semibold text-lg">Prendre une photo</p>
                  <p className="text-sm text-white/80 mt-1">
                    {documentType === 'id' ? 'de votre pièce d\'identité' : 'du document'}
                  </p>
                </div>
              </button>

              {/* Input caché pour la caméra */}
              <input
                ref={cameraInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleFileChange}
                className="hidden"
              />

              {/* Séparateur */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[#E5E7EB]" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-[#F9FAFB] text-[#6B7280]">ou</span>
                </div>
              </div>

              {/* Bouton secondaire : Choisir un fichier */}
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className={cn(
                  "w-full flex items-center justify-center gap-2 p-4",
                  "border-2 border-dashed border-[#E5E7EB] rounded-xl",
                  "text-[#6B7280] hover:border-[#2563EB] hover:text-[#2563EB]",
                  "active:scale-[0.98] transition-all",
                  "disabled:opacity-50 disabled:cursor-not-allowed"
                )}
              >
                <Upload className="h-5 w-5" />
                <span className="font-medium">Choisir un fichier</span>
              </button>

              {/* Input caché pour les fichiers */}
              <input
                ref={fileInputRef}
                type="file"
                accept={accept}
                onChange={handleFileChange}
                className="hidden"
              />

              {/* Tips */}
              {documentType === 'id' && (
                <div className="flex items-start gap-2 p-3 bg-[#EFF6FF] rounded-lg">
                  <AlertCircle className="h-5 w-5 text-[#2563EB] flex-shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <p className="text-[#2563EB] font-medium">Conseils de prise de vue :</p>
                    <ul className="text-[#6B7280] mt-1 space-y-0.5 list-disc list-inside">
                      <li>Bien éclairer le document</li>
                      <li>Éviter les reflets</li>
                      <li>Cadrer l'intégralité de la pièce</li>
                    </ul>
                  </div>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative group"
            >
              {/* Preview du fichier */}
              <div className="relative rounded-xl overflow-hidden border-2 border-[#10B981] bg-white">
                {preview ? (
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-full h-48 object-cover"
                  />
                ) : (
                  <div className="w-full h-48 bg-[#F9FAFB] flex items-center justify-center">
                    <File className="h-12 w-12 text-[#6B7280]" />
                  </div>
                )}

                {/* Badge de succès */}
                <div className="absolute top-2 right-2 bg-[#10B981] text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1.5 shadow-lg">
                  <Check className="h-4 w-4" />
                  Envoyé
                </div>

                {/* Info fichier */}
                <div className="p-3 bg-white border-t border-[#E5E7EB]">
                  <p className="text-sm font-medium text-[#111827] truncate">
                    {uploadedFile.name}
                  </p>
                  <p className="text-xs text-[#6B7280] mt-0.5">
                    {(uploadedFile.size / 1024).toFixed(0)} Ko
                  </p>
                </div>
              </div>

              {/* Bouton de suppression */}
              <button
                onClick={handleRemove}
                className="absolute -top-2 -right-2 w-8 h-8 bg-[#DC2626] text-white rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-10"
              >
                <X className="h-4 w-4" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // Variante Desktop : Upload classique
  return (
    <div className="space-y-2">
      <label className="font-medium text-[#111827]">
        {label}
        {required && <span className="text-[#DC2626] ml-1">*</span>}
      </label>
      
      {description && (
        <p className="text-sm text-[#6B7280]">{description}</p>
      )}

      {!uploadedFile ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-[#E5E7EB] rounded-lg p-6 hover:border-[#2563EB] hover:bg-[#2563EB]/5 transition-all cursor-pointer"
        >
          <div className="flex flex-col items-center gap-2 text-center">
            <Upload className="h-8 w-8 text-[#6B7280]" />
            <p className="font-medium text-[#111827]">
              Cliquez pour télécharger
            </p>
            <p className="text-sm text-[#6B7280]">
              ou glissez-déposez votre fichier ici
            </p>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept={accept}
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
      ) : (
        <div className="flex items-center gap-3 p-4 bg-[#F9FAFB] rounded-lg border border-[#E5E7EB]">
          <File className="h-8 w-8 text-[#2563EB] flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-[#111827] truncate">
              {uploadedFile.name}
            </p>
            <p className="text-xs text-[#6B7280]">
              {(uploadedFile.size / 1024).toFixed(0)} Ko
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRemove}
            className="flex-shrink-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}

// Composant wrapper responsive
export function ResponsiveDocumentUpload(props: DocumentUploadMobileProps) {
  return (
    <>
      {/* Mobile */}
      <div className="md:hidden">
        <DocumentUploadMobile {...props} variant="mobile" />
      </div>
      
      {/* Desktop */}
      <div className="hidden md:block">
        <DocumentUploadMobile {...props} variant="desktop" />
      </div>
    </>
  );
}
