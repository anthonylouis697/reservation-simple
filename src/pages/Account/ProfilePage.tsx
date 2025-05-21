import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { AppLayout } from '@/components/AppLayout';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';

const profileFormSchema = z.object({
  name: z.string().min(2, { message: "Le nom doit contenir au moins 2 caractères" }),
  email: z.string().email({ message: "Email invalide" }),
  phone: z.string().optional(),
  company: z.string().optional(),
  jobTitle: z.string().optional(),
  bio: z.string().max(500, { message: "La bio ne peut pas dépasser 500 caractères" }).optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export default function ProfilePage() {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      company: "",
      jobTitle: "",
      bio: "",
    },
    mode: "onChange",
  });
  
  // Charger les données du profil
  useEffect(() => {
    if (profile) {
      form.reset({
        name: `${profile.first_name || ''} ${profile.last_name || ''}`.trim(),
        email: profile.email || user?.email || '',
        phone: profile.phone || '',
        company: profile.company || '',
        jobTitle: profile.job_title || '',
        bio: profile.bio || '',
      });
      
      if (profile.avatar_url) {
        setAvatarUrl(profile.avatar_url);
      }
    }
  }, [profile, user, form]);

  async function onSubmit(data: ProfileFormValues) {
    if (!user) return;
    
    setIsLoading(true);
    try {
      // Séparer le nom complet en prénom et nom
      const nameParts = data.name.trim().split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';

      // Mettre à jour le profil
      const { error } = await supabase
        .from('profiles')
        .update({
          first_name: firstName,
          last_name: lastName,
          email: data.email,
          phone: data.phone || null,
          company: data.company || null,
          job_title: data.jobTitle || null,
          bio: data.bio || null,
        })
        .eq('id', user.id);

      if (error) {
        throw error;
      }

      toast.success("Profil mis à jour avec succès");
    } catch (error: any) {
      toast.error(`Erreur: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  }

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    setIsLoading(true);
    try {
      // Créer un nom de fichier unique
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      // Uploader le fichier
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      // Obtenir l'URL publique
      const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      const newAvatarUrl = data.publicUrl;
      setAvatarUrl(newAvatarUrl);

      // Mettre à jour le profil avec la nouvelle URL d'avatar
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: newAvatarUrl })
        .eq('id', user.id);

      if (updateError) {
        throw updateError;
      }

      toast.success("Photo de profil mise à jour");
    } catch (error: any) {
      toast.error(`Erreur: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAvatarDelete = async () => {
    if (!user || !avatarUrl) return;
    
    setIsLoading(true);
    try {
      // Mettre à jour le profil pour supprimer l'URL de l'avatar
      const { error } = await supabase
        .from('profiles')
        .update({ avatar_url: null })
        .eq('id', user.id);

      if (error) {
        throw error;
      }

      setAvatarUrl(null);
      toast.success("Photo de profil supprimée");
    } catch (error: any) {
      toast.error(`Erreur: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const getInitials = () => {
    if (!profile) return "?";
    return `${profile.first_name?.[0] || ''}${profile.last_name?.[0] || ''}`;
  };

  return (
    <AppLayout>
      <Helmet>
        <title>Profil - Reservatoo</title>
      </Helmet>
      
      <div className="space-y-6">
        <div className="flex items-center gap-2 mb-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Profil</h1>
            <p className="text-muted-foreground">Gérez vos informations personnelles</p>
          </div>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Photo de profil</CardTitle>
            <CardDescription>
              Cette photo sera affichée sur votre profil et apparaîtra à vos clients lors de la réservation.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex items-center gap-6">
            <Avatar className="h-20 w-20">
              <AvatarImage src={avatarUrl || ""} />
              <AvatarFallback className="text-lg">{getInitials()}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Button disabled={isLoading}>
                <label htmlFor="avatar-upload" className="cursor-pointer">
                  {isLoading ? "Chargement..." : "Changer la photo"}
                  <input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarUpload}
                    disabled={isLoading}
                  />
                </label>
              </Button>
              <Button 
                variant="outline" 
                onClick={handleAvatarDelete} 
                disabled={isLoading || !avatarUrl}
              >
                Supprimer
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Informations personnelles</CardTitle>
                <CardDescription>
                  Modifiez vos informations personnelles et de contact.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nom complet</FormLabel>
                        <FormControl>
                          <Input placeholder="Votre nom" {...field} disabled={isLoading} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="email@example.com" {...field} disabled={isLoading} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Téléphone</FormLabel>
                        <FormControl>
                          <Input placeholder="+33 6 00 00 00 00" {...field} disabled={isLoading} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <Separator />
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="company"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Entreprise</FormLabel>
                        <FormControl>
                          <Input placeholder="Nom de l'entreprise" {...field} disabled={isLoading} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="jobTitle"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Fonction</FormLabel>
                        <FormControl>
                          <Input placeholder="Votre fonction" {...field} disabled={isLoading} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="bio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>À propos de moi</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Présentez-vous en quelques mots..." 
                          className="resize-none h-20" 
                          {...field} 
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormDescription>
                        {field.value?.length || 0}/500 caractères
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Enregistrement..." : "Enregistrer"}
                </Button>
              </CardFooter>
            </Card>
          </form>
        </Form>
      </div>
    </AppLayout>
  );
}
