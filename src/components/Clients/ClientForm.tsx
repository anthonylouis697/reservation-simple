
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Client } from "@/pages/Clients";

interface ClientFormProps {
  initialData?: Client;
  onSubmit: (data: Omit<Client, "id"> | Client) => void;
  onCancel: () => void;
}

export const ClientForm = ({ initialData, onSubmit, onCancel }: ClientFormProps) => {
  const [formData, setFormData] = useState<Omit<Client, "id"> | Client>({
    id: initialData?.id || "",
    name: initialData?.name || "",
    email: initialData?.email || "",
    phone: initialData?.phone || "",
    notes: initialData?.notes || "",
    totalAppointments: initialData?.totalAppointments || 0,
    lastVisit: initialData?.lastVisit || null,
    totalSpent: initialData?.totalSpent || 0,
    status: initialData?.status || "active",
    address: {
      street: initialData?.address?.street || "",
      city: initialData?.address?.city || "",
      zipCode: initialData?.address?.zipCode || "",
      country: initialData?.address?.country || "France",
    },
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData({
        ...formData,
        [parent]: {
          ...(formData as any)[parent],
          [child]: value,
        },
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-4 py-2 pb-4">
        <div className="space-y-2">
          <Label htmlFor="name">Nom complet</Label>
          <Input
            id="name"
            name="name"
            placeholder="Prénom Nom"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="client@example.com"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="phone">Téléphone</Label>
          <Input
            id="phone"
            name="phone"
            placeholder="06 12 34 56 78"
            value={formData.phone}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="address.street">Adresse</Label>
          <Input
            id="address.street"
            name="address.street"
            placeholder="Rue"
            value={formData.address?.street}
            onChange={handleChange}
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="address.city">Ville</Label>
            <Input
              id="address.city"
              name="address.city"
              placeholder="Ville"
              value={formData.address?.city}
              onChange={handleChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="address.zipCode">Code postal</Label>
            <Input
              id="address.zipCode"
              name="address.zipCode"
              placeholder="Code postal"
              value={formData.address?.zipCode}
              onChange={handleChange}
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="notes">Notes</Label>
          <Textarea
            id="notes"
            name="notes"
            placeholder="Informations supplémentaires sur ce client..."
            value={formData.notes || ""}
            onChange={handleChange}
            className="min-h-[100px]"
          />
        </div>
      </div>
      
      <div className="flex justify-end space-x-4 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Annuler
        </Button>
        <Button type="submit">
          {initialData ? "Mettre à jour" : "Ajouter"} le client
        </Button>
      </div>
    </form>
  );
};
