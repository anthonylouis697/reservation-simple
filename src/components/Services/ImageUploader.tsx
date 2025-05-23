
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Upload, X, Image } from "lucide-react";

interface ImageUploaderProps {
  imageUrl?: string;
  onImageChange: (imageUrl: string | undefined) => void;
}

export const ImageUploader = ({ imageUrl, onImageChange }: ImageUploaderProps) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      // Créer une URL temporaire pour l'image
      const url = URL.createObjectURL(file);
      onImageChange(url);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileChange(file);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileChange(file);
    }
  };

  const removeImage = () => {
    onImageChange(undefined);
  };

  return (
    <div className="space-y-2">
      <Label>Image du service</Label>
      
      {imageUrl ? (
        <Card className="relative p-4">
          <div className="relative">
            <img 
              src={imageUrl} 
              alt="Service" 
              className="w-full h-48 object-cover rounded-md"
            />
            <Button
              type="button"
              variant="destructive"
              size="sm"
              className="absolute top-2 right-2"
              onClick={removeImage}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </Card>
      ) : (
        <Card 
          className={`border-2 border-dashed p-8 text-center cursor-pointer transition-colors ${
            isDragging ? 'border-primary bg-primary/5' : 'border-gray-300 hover:border-gray-400'
          }`}
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onDragEnter={() => setIsDragging(true)}
          onDragLeave={() => setIsDragging(false)}
          onClick={() => document.getElementById('image-upload')?.click()}
        >
          <div className="space-y-2">
            <Image className="h-8 w-8 mx-auto text-gray-400" />
            <div>
              <p className="text-sm font-medium">Cliquez pour ajouter une image</p>
              <p className="text-xs text-gray-500">ou glissez-déposez un fichier</p>
            </div>
            <p className="text-xs text-gray-400">PNG, JPG jusqu'à 5MB</p>
          </div>
          <input
            id="image-upload"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileInput}
          />
        </Card>
      )}
    </div>
  );
};
