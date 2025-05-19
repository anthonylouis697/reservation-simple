
import { useState } from "react";
import AccountLayout from "@/components/Account/AccountLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "@/components/ui/use-toast";
import { AlertCircle, Key, Smartphone, Check, X, ShieldCheck, Lock, AlertTriangle, LogIn } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// Validation schema for password change form
const passwordFormSchema = z.object({
  currentPassword: z.string().min(1, "Mot de passe actuel requis"),
  newPassword: z
    .string()
    .min(8, "Le mot de passe doit contenir au moins 8 caractères")
    .regex(/[A-Z]/, "Le mot de passe doit contenir au moins une lettre majuscule")
    .regex(/[a-z]/, "Le mot de passe doit contenir au moins une lettre minuscule")
    .regex(/[0-9]/, "Le mot de passe doit contenir au moins un chiffre")
    .regex(/[^A-Za-z0-9]/, "Le mot de passe doit contenir au moins un caractère spécial"),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Les mots de passe ne correspondent pas",
  path: ["confirmPassword"],
});

type PasswordFormValues = z.infer<typeof passwordFormSchema>;

export default function SecurityPage() {
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);
  const [showSetup2FA, setShowSetup2FA] = useState(false);
  
  // Mock login sessions - in a real app this would come from API
  const sessions = [
    { 
      id: "1", 
      device: "Firefox - MacOS", 
      ipAddress: "192.168.1.1", 
      location: "Paris, France", 
      lastActive: "Aujourd'hui à 14:32", 
      current: true 
    },
    { 
      id: "2", 
      device: "Chrome - Windows", 
      ipAddress: "83.45.123.45", 
      location: "Lyon, France", 
      lastActive: "Hier à 08:15", 
      current: false 
    },
    { 
      id: "3", 
      device: "Safari - iPhone", 
      ipAddress: "92.10.81.64", 
      location: "Marseille, France", 
      lastActive: "15 mai 2024 à 19:22", 
      current: false 
    }
  ];
  
  const form = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: ""
    },
  });
  
  // Handle password change form submission
  const onSubmit = (values: PasswordFormValues) => {
    console.log(values);
    
    // In a real app, this would call an API to change the password
    toast({
      title: "Mot de passe mis à jour",
      description: "Votre mot de passe a été changé avec succès.",
    });
    
    form.reset();
  };
  
  // Handle 2FA toggle
  const handle2FAToggle = (checked: boolean) => {
    if (checked && !is2FAEnabled) {
      setShowSetup2FA(true);
      // Don't enable 2FA yet, as we need to complete setup first
    } else if (!checked && is2FAEnabled) {
      // In a real app, this would call an API to disable 2FA
      setIs2FAEnabled(false);
      toast({
        title: "Authentification à deux facteurs désactivée",
        description: "La 2FA a été désactivée pour votre compte.",
      });
    }
  };
  
  // Handle 2FA setup completion
  const complete2FASetup = () => {
    setIs2FAEnabled(true);
    setShowSetup2FA(false);
    toast({
      title: "Authentification à deux facteurs activée",
      description: "La 2FA a été activée avec succès pour votre compte.",
    });
  };
  
  // Handle session revocation
  const revokeSession = (sessionId: string) => {
    // In a real app, this would call an API to revoke the session
    toast({
      title: "Session révoquée",
      description: "La session a été déconnectée avec succès.",
    });
  };
  
  return (
    <AccountLayout>
      <div className="space-y-6">
        {/* Password Change Form */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Changer de mot de passe</CardTitle>
                <CardDescription>
                  Mettez à jour votre mot de passe pour sécuriser votre compte
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="currentPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mot de passe actuel</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="••••••••" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="newPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nouveau mot de passe</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="••••••••" {...field} />
                      </FormControl>
                      <div className="mt-2 space-y-1.5">
                        <PasswordRequirement 
                          text="Au moins 8 caractères"
                          isValid={field.value.length >= 8}
                        />
                        <PasswordRequirement 
                          text="Au moins une majuscule (A-Z)"
                          isValid={/[A-Z]/.test(field.value)}
                        />
                        <PasswordRequirement 
                          text="Au moins une minuscule (a-z)"
                          isValid={/[a-z]/.test(field.value)}
                        />
                        <PasswordRequirement 
                          text="Au moins un chiffre (0-9)"
                          isValid={/[0-9]/.test(field.value)}
                        />
                        <PasswordRequirement 
                          text="Au moins un caractère spécial"
                          isValid={/[^A-Za-z0-9]/.test(field.value)}
                        />
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirmer le mot de passe</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="••••••••" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
              <CardFooter>
                <Button type="submit">Mettre à jour le mot de passe</Button>
              </CardFooter>
            </Card>
          </form>
        </Form>
        
        {/* 2FA Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Authentification à deux facteurs</CardTitle>
            <CardDescription>
              Ajoutez une couche de sécurité supplémentaire à votre compte
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {!showSetup2FA ? (
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <ShieldCheck className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium">Authentification à deux facteurs (2FA)</h4>
                    <p className="text-sm text-muted-foreground">
                      {is2FAEnabled 
                        ? "La 2FA est activée. Une vérification supplémentaire est requise lors de la connexion." 
                        : "La 2FA est désactivée. Activez-la pour une protection supplémentaire."}
                    </p>
                  </div>
                </div>
                <Switch checked={is2FAEnabled} onCheckedChange={handle2FAToggle} />
              </div>
            ) : (
              <div className="space-y-4">
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Configuration de la 2FA</AlertTitle>
                  <AlertDescription>
                    Scannez le QR code ci-dessous avec une application d'authentification comme Google Authenticator ou Microsoft Authenticator.
                  </AlertDescription>
                </Alert>
                
                <div className="flex justify-center py-4">
                  <div className="border border-dashed border-gray-300 p-2 rounded-md">
                    {/* In a real app, this would be an actual QR code */}
                    <div className="w-48 h-48 bg-gray-100 flex items-center justify-center">
                      <p className="text-gray-500 text-sm text-center">QR Code pour l'application d'authentification</p>
                    </div>
                  </div>
                </div>
                
                <FormItem>
                  <FormLabel>Code de vérification</FormLabel>
                  <FormControl>
                    <Input placeholder="Entrez le code à 6 chiffres" />
                  </FormControl>
                </FormItem>
                
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setShowSetup2FA(false)}>Annuler</Button>
                  <Button onClick={complete2FASetup}>Activer la 2FA</Button>
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter className="text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Key className="h-4 w-4" />
              <span>Utilisez une application d'authentification comme Google Authenticator ou Microsoft Authenticator</span>
            </div>
          </CardFooter>
        </Card>
        
        {/* Active Sessions */}
        <Card>
          <CardHeader>
            <CardTitle>Sessions actives</CardTitle>
            <CardDescription>
              Gérez les appareils connectés à votre compte
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {sessions.map((session) => (
              <div 
                key={session.id}
                className={`flex justify-between items-center p-3 rounded-md ${
                  session.current ? 'bg-primary/5 border border-primary/10' : 'bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-full ${session.current ? 'bg-primary/10' : 'bg-gray-100'}`}>
                    <LogIn className={`h-5 w-5 ${session.current ? 'text-primary' : 'text-gray-500'}`} />
                  </div>
                  <div>
                    <div className="flex items-center">
                      <h4 className="font-medium">{session.device}</h4>
                      {session.current && (
                        <Badge className="ml-2 bg-primary/10 text-primary hover:bg-primary/20">
                          Session actuelle
                        </Badge>
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {session.location} • {session.ipAddress}
                    </div>
                    <div className="text-xs text-muted-foreground mt-0.5">
                      Dernière activité : {session.lastActive}
                    </div>
                  </div>
                </div>
                {!session.current && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => revokeSession(session.id)}
                  >
                    Déconnecter
                  </Button>
                )}
              </div>
            ))}
          </CardContent>
          <CardFooter>
            <Alert variant="destructive" className="w-full">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Déconnexion de toutes les sessions</AlertTitle>
              <AlertDescription className="flex justify-between items-center">
                <span>Si vous suspectez une activité suspecte, déconnectez toutes vos sessions actives.</span>
                <Button 
                  variant="destructive"
                  size="sm"
                  onClick={() => {
                    toast({
                      title: "Toutes les sessions révoquées",
                      description: "Vous avez été déconnecté de tous les autres appareils.",
                      variant: "destructive",
                    });
                  }}
                >
                  Tout déconnecter
                </Button>
              </AlertDescription>
            </Alert>
          </CardFooter>
        </Card>
      </div>
    </AccountLayout>
  );
}

interface PasswordRequirementProps {
  text: string;
  isValid: boolean;
}

function PasswordRequirement({ text, isValid }: PasswordRequirementProps) {
  return (
    <div className="flex items-center gap-2 text-xs">
      {isValid ? (
        <Check className="h-3.5 w-3.5 text-green-500" />
      ) : (
        <X className="h-3.5 w-3.5 text-muted-foreground" />
      )}
      <span className={isValid ? "text-green-600" : "text-muted-foreground"}>
        {text}
      </span>
    </div>
  );
}
