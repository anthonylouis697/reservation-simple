
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useBookingPage } from "../BookingPageContext";
import { BookingCustomTexts } from "../types";
import { Check, Pencil } from "lucide-react";
import { toast } from "sonner";

type TextFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

const TextField = ({ label, value, onChange, placeholder }: TextFieldProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempValue, setTempValue] = useState(value);
  
  const handleSave = () => {
    onChange(tempValue);
    setIsEditing(false);
    toast.success("Texte personnalisé mis à jour");
  };
  
  const handleCancel = () => {
    setTempValue(value);
    setIsEditing(false);
  };
  
  return (
    <div className="space-y-2">
      <Label className="text-sm">{label}</Label>
      <div className="flex items-center gap-2">
        {isEditing ? (
          <>
            <Input
              value={tempValue}
              onChange={e => setTempValue(e.target.value)}
              placeholder={placeholder}
              className="flex-1"
              autoFocus
            />
            <Button 
              size="sm" 
              variant="ghost" 
              onClick={handleCancel}
              className="text-muted-foreground"
            >
              Annuler
            </Button>
            <Button 
              size="sm" 
              onClick={handleSave}
              className="gap-1"
            >
              <Check size={16} />
              Valider
            </Button>
          </>
        ) : (
          <>
            <div className="flex-1 px-3 py-2 border rounded-md bg-muted/20 text-sm truncate">
              {value}
            </div>
            <Button 
              size="sm" 
              variant="ghost" 
              onClick={() => setIsEditing(true)}
              className="gap-1"
            >
              <Pencil size={16} />
              Modifier
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export function CustomTextsEditor() {
  const { customTexts, updateCustomText } = useBookingPage();

  const textFields: { key: keyof BookingCustomTexts; label: string; placeholder: string }[] = [
    { 
      key: 'selectServiceLabel', 
      label: 'Libellé sélection de service', 
      placeholder: 'Sélectionnez un service' 
    },
    { 
      key: 'selectDateLabel', 
      label: 'Libellé sélection de date', 
      placeholder: 'Sélectionnez une date' 
    },
    { 
      key: 'selectTimeLabel', 
      label: 'Libellé sélection d\'horaire', 
      placeholder: 'Sélectionnez un horaire' 
    },
    { 
      key: 'clientInfoLabel', 
      label: 'Libellé informations client', 
      placeholder: 'Vos informations' 
    },
    { 
      key: 'paymentMethodLabel', 
      label: 'Libellé méthode de paiement', 
      placeholder: 'Méthode de paiement' 
    },
  ];

  return (
    <div className="space-y-4">
      <Label className="text-base font-medium">Personnalisation des textes</Label>
      <div className="space-y-4 bg-accent/20 p-4 rounded-lg">
        {textFields.map((field) => (
          <TextField
            key={field.key}
            label={field.label}
            value={customTexts[field.key]}
            onChange={(value) => updateCustomText(field.key, value)}
            placeholder={field.placeholder}
          />
        ))}
      </div>
    </div>
  );
}
