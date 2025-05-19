import { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import {
  AlertTriangle,
  ArrowUpRight,
  Bell,
  Check,
  CheckCircle,
  Clock,
  Copy,
  Edit,
  Eye,
  Globe,
  Info,
  MessageCircle,
  MoreHorizontal,
  Plus,
  Search,
  Settings,
  Smartphone,
  Trash,
  User,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';

type NotificationType = 'push' | 'browser' | 'in-app';

interface NotificationTemplate {
  id: string;
  title: string;
  content: string;
  type: NotificationType;
  icon: string;
  triggeredBy: string;
  active: boolean;
  createdAt: Date;
}

export const Notifications = () => {
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<NotificationTemplate | null>(null);
  const [isTemplateFormOpen, setIsTemplateFormOpen] = useState(false);
  
  // Mock notification templates
  const [templates, setTemplates] = useState<NotificationTemplate[]>([
    {
      id: '1',
      title: 'Confirmation de rendez-vous',
      content: 'Votre rendez-vous a été confirmé pour {date} à {heure}.',
      type: 'push',
      icon: 'calendar',
      triggeredBy: 'appointment_created',
      active: true,
      createdAt: new Date('2025-01-15')
    },
    {
      id: '2',
      title: 'Rappel de rendez-vous',
      content: 'Rappel: vous avez un rendez-vous demain à {heure}.',
      type: 'push',
      icon: 'clock',
      triggeredBy: 'appointment_reminder',
      active: true,
      createdAt: new Date('2025-01-15')
    },
    {
      id: '3',
      title: 'Nouvelle promotion disponible',
      content: 'Une nouvelle offre spéciale est disponible! Vérifiez vos emails pour plus de détails.',
      type: 'in-app',
      icon: 'tag',
      triggeredBy: 'promotion_created',
      active: true,
      createdAt: new Date('2025-02-10')
    },
    {
      id: '4',
      title: 'Réservation annulée',
      content: 'Votre réservation pour le {date} a été annulée.',
      type: 'push',
      icon: 'x-circle',
      triggeredBy: 'appointment_cancelled',
      active: true,
      createdAt: new Date('2025-03-05')
    },
    {
      id: '5',
      title: 'Nouvel article de blog',
      content: 'Nous avons publié un nouvel article: "{title}". Cliquez pour le lire!',
      type: 'browser',
      icon: 'file-text',
      triggeredBy: 'blog_published',
      active: false,
      createdAt: new Date('2025-03-15')
    }
  ]);
  
  // Mock notification settings
  const [notificationConfig, setNotificationConfig] = useState({
    pushEnabled: true,
    browserEnabled: true,
    inAppEnabled: true,
    soundEnabled: true,
    webPushApiKey: 'BGJy4_X3kR5Aq2T8cjmJpgJLHAYM2soZYJu9',
    androidConfig: {
      enabled: true,
      fcmKey: 'AAAA2Yg_MXs:APA91bGHQKd2RSlNt0'
    },
    iosConfig: {
      enabled: true,
      apnsKey: 'ZGV2X3B1c2hfc2VydmljZXNAMTI'
    }
  });
  
  // New template state
  const [newTemplate, setNewTemplate] = useState<Partial<NotificationTemplate>>({
    title: '',
    content: '',
    type: 'push',
    icon: 'bell',
    triggeredBy: 'appointment_created',
    active: true
  });
  
  const handleToggleTemplate = (id: string, active: boolean) => {
    setTemplates(templates.map(template => 
      template.id === id ? { ...template, active } : template
    ));
    
    toast.success(`Notification ${active ? 'activée' : 'désactivée'}`);
  };
  
  const handleDeleteTemplate = (id: string) => {
    setTemplates(templates.filter(template => template.id !== id));
    toast.success("Template de notification supprimé");
  };
  
  const handleDuplicateTemplate = (template: NotificationTemplate) => {
    const newTemplate = {
      ...template,
      id: `${Date.now()}`,
      title: `${template.title} (copie)`,
      active: false,
      createdAt: new Date()
    };
    
    setTemplates([...templates, newTemplate]);
    toast.success("Template dupliqué avec succès");
  };
  
  const handleEditTemplate = (template: NotificationTemplate) => {
    setSelectedTemplate(template);
    setNewTemplate({
      title: template.title,
      content: template.content,
      type: template.type,
      icon: template.icon,
      triggeredBy: template.triggeredBy,
      active: template.active
    });
    setIsTemplateFormOpen(true);
  };
  
  const handleSaveTemplate = () => {
    if (!newTemplate.title || !newTemplate.content) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }
    
    if (selectedTemplate) {
      // Update existing template
      const updatedTemplates = templates.map(template => 
        template.id === selectedTemplate.id 
          ? {
              ...template,
              title: newTemplate.title || template.title,
              content: newTemplate.content || template.content,
              type: newTemplate.type || template.type,
              icon: newTemplate.icon || template.icon,
              triggeredBy: newTemplate.triggeredBy || template.triggeredBy,
              active: newTemplate.active === undefined ? template.active : newTemplate.active
            } 
          : template
      );
      setTemplates(updatedTemplates);
      toast.success("Template modifié avec succès");
    } else {
      // Create new template
      const createdTemplate: NotificationTemplate = {
        id: `${Date.now()}`,
        title: newTemplate.title!,
        content: newTemplate.content!,
        type: newTemplate.type || 'push',
        icon: newTemplate.icon || 'bell',
        triggeredBy: newTemplate.triggeredBy || 'custom',
        active: newTemplate.active || false,
        createdAt: new Date()
      };
      
      setTemplates([...templates, createdTemplate]);
      toast.success("Template créé avec succès");
    }
    
    resetTemplateForm();
  };
  
  const resetTemplateForm = () => {
    setIsTemplateFormOpen(false);
    setSelectedTemplate(null);
    setNewTemplate({
      title: '',
      content: '',
      type: 'push',
      icon: 'bell',
      triggeredBy: 'appointment_created',
      active: true
    });
  };
  
  const handleUpdateConfig = () => {
    toast.success("Configuration des notifications mise à jour");
    setIsConfigOpen(false);
  };
  
  // Filter templates by search query
  const filteredTemplates = templates.filter(template => {
    return template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
           template.content.toLowerCase().includes(searchQuery.toLowerCase());
  });
  
  // Get notification type badge
  const getTypeBadge = (type: NotificationType) => {
    switch (type) {
      case 'push':
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Push</Badge>;
      case 'browser':
        return <Badge className="bg-purple-100 text-purple-800 border-purple-200">Browser</Badge>;
      case 'in-app':
        return <Badge className="bg-green-100 text-green-800 border-green-200">In-App</Badge>;
      default:
        return null;
    }
  };
  
  // Get trigger event label
  const getTriggerLabel = (trigger: string) => {
    switch (trigger) {
      case 'appointment_created': return 'Création de rendez-vous';
      case 'appointment_reminder': return 'Rappel de rendez-vous';
      case 'appointment_cancelled': return 'Annulation de rendez-vous';
      case 'promotion_created': return 'Nouvelle promotion';
      case 'blog_published': return 'Publication d\'article';
      default: return 'Événement personnalisé';
    }
  };
  
  return (
    <div className="space-y-6">
      {/* Overview cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Notifications push</CardTitle>
              <Switch 
                checked={notificationConfig.pushEnabled} 
                onCheckedChange={(checked) => setNotificationConfig({...notificationConfig, pushEnabled: checked})}
              />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Smartphone className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                Notifications mobiles pour vos clients
              </span>
            </div>
            <div className="mt-2">
              <Badge variant={notificationConfig.pushEnabled ? "default" : "outline"}>
                {notificationConfig.pushEnabled ? "Activé" : "Désactivé"}
              </Badge>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Notifications navigateur</CardTitle>
              <Switch 
                checked={notificationConfig.browserEnabled} 
                onCheckedChange={(checked) => setNotificationConfig({...notificationConfig, browserEnabled: checked})}
              />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Globe className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                Notifications sur le navigateur web
              </span>
            </div>
            <div className="mt-2">
              <Badge variant={notificationConfig.browserEnabled ? "default" : "outline"}>
                {notificationConfig.browserEnabled ? "Activé" : "Désactivé"}
              </Badge>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Notifications in-app</CardTitle>
              <Switch 
                checked={notificationConfig.inAppEnabled} 
                onCheckedChange={(checked) => setNotificationConfig({...notificationConfig, inAppEnabled: checked})}
              />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Bell className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                Notifications dans l'application
              </span>
            </div>
            <div className="mt-2">
              <Badge variant={notificationConfig.inAppEnabled ? "default" : "outline"}>
                {notificationConfig.inAppEnabled ? "Activé" : "Désactivé"}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Configuration button */}
      <div className="flex justify-end">
        <Button variant="outline" onClick={() => setIsConfigOpen(true)}>
          <Settings className="mr-2 h-4 w-4" />
          Configuration des notifications
        </Button>
      </div>
      
      {/* Templates management */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher un template..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button onClick={() => {
          resetTemplateForm();
          setIsTemplateFormOpen(true);
        }}>
          <Plus className="h-4 w-4 mr-2" /> Nouveau template
        </Button>
      </div>
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Templates de notifications</CardTitle>
          <CardDescription>
            Gérez et personnalisez les notifications envoyées à vos clients
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Titre</TableHead>
                <TableHead>Contenu</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Événement déclencheur</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTemplates.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-10">
                    <div className="text-muted-foreground">Aucun template trouvé</div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredTemplates.map((template) => (
                  <TableRow key={template.id}>
                    <TableCell className="font-medium">{template.title}</TableCell>
                    <TableCell className="max-w-[300px] truncate">{template.content}</TableCell>
                    <TableCell>{getTypeBadge(template.type)}</TableCell>
                    <TableCell>{getTriggerLabel(template.triggeredBy)}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Switch 
                          checked={template.active} 
                          onCheckedChange={(checked) => handleToggleTemplate(template.id, checked)}
                        />
                        <span className="text-sm text-muted-foreground">
                          {template.active ? "Actif" : "Inactif"}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          
                          <DropdownMenuItem onClick={() => handleEditTemplate(template)}>
                            <Edit className="mr-2 h-4 w-4" />
                            <span>Modifier</span>
                          </DropdownMenuItem>
                          
                          <DropdownMenuItem onClick={() => handleDuplicateTemplate(template)}>
                            <Copy className="mr-2 h-4 w-4" />
                            <span>Dupliquer</span>
                          </DropdownMenuItem>
                          
                          <DropdownMenuItem onClick={() => {
                            // Preview notification
                            toast(template.title, {
                              description: template.content
                                .replace("{date}", "20/06/2025")
                                .replace("{heure}", "14:30")
                                .replace("{title}", "Titre de l'article"),
                            });
                          }}>
                            <Eye className="mr-2 h-4 w-4" />
                            <span>Aperçu</span>
                          </DropdownMenuItem>
                          
                          <DropdownMenuSeparator />
                          
                          <DropdownMenuItem className="text-red-600" onClick={() => handleDeleteTemplate(template.id)}>
                            <Trash className="mr-2 h-4 w-4" />
                            <span>Supprimer</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      {/* Notification examples */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Exemples de notifications</CardTitle>
          <CardDescription>
            Voici à quoi ressembleront vos notifications
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Push notification example */}
            <div className="border rounded-md p-4">
              <div className="text-sm font-medium mb-3">Notification Push</div>
              <div className="bg-slate-800 text-white p-4 rounded-md max-w-md">
                <div className="flex items-start">
                  <div className="bg-blue-600 rounded-md p-2 mr-3">
                    <Bell className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between w-full">
                      <div className="font-medium">BookWise</div>
                      <div className="text-xs text-slate-300">maintenant</div>
                    </div>
                    <div className="text-sm mt-1">Confirmation de rendez-vous</div>
                    <div className="text-xs text-slate-300 mt-0.5">
                      Votre rendez-vous a été confirmé pour le 20/06/2025 à 14:30.
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Browser notification example */}
            <div className="border rounded-md p-4">
              <div className="text-sm font-medium mb-3">Notification Navigateur</div>
              <div className="bg-white shadow-md border p-3 rounded-md max-w-md">
                <div className="flex items-start">
                  <div className="bg-gray-100 rounded-full p-2 mr-3">
                    <img src="https://picsum.photos/seed/logo/40/40" alt="Logo" className="h-5 w-5 rounded-sm" />
                  </div>
                  <div>
                    <div className="font-medium">BookWise</div>
                    <div className="text-sm mt-1">Rappel: vous avez un rendez-vous demain à 10:30.</div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* In-app notification example */}
            <div className="border rounded-md p-4">
              <div className="text-sm font-medium mb-3">Notification In-App</div>
              <div className="border-l-4 border-indigo-500 bg-indigo-50 p-3 rounded-md max-w-md">
                <div className="flex items-start">
                  <div className="mr-3 text-indigo-500">
                    <Info className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="font-medium text-indigo-800">Nouvelle promotion disponible!</div>
                    <div className="text-sm mt-1 text-indigo-600">
                      Une nouvelle offre spéciale est disponible! Vérifiez vos emails pour plus de détails.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Configuration Dialog */}
      <Dialog open={isConfigOpen} onOpenChange={setIsConfigOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Configuration des notifications</DialogTitle>
            <DialogDescription>
              Paramétrez les différents types de notifications
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Notifications push sur mobile</Label>
              <div className="flex items-center justify-between">
                <div className="text-sm">Activer les notifications push</div>
                <Switch 
                  checked={notificationConfig.pushEnabled} 
                  onCheckedChange={(checked) => setNotificationConfig({...notificationConfig, pushEnabled: checked})}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Configuration Android (FCM)</Label>
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm">Activer pour Android</div>
                <Switch 
                  checked={notificationConfig.androidConfig.enabled} 
                  onCheckedChange={(checked) => setNotificationConfig({
                    ...notificationConfig, 
                    androidConfig: {...notificationConfig.androidConfig, enabled: checked}
                  })}
                />
              </div>
              <Input 
                value={notificationConfig.androidConfig.fcmKey} 
                onChange={(e) => setNotificationConfig({
                  ...notificationConfig, 
                  androidConfig: {...notificationConfig.androidConfig, fcmKey: e.target.value}
                })}
                placeholder="Clé FCM"
                disabled={!notificationConfig.androidConfig.enabled}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Configuration iOS (APNS)</Label>
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm">Activer pour iOS</div>
                <Switch 
                  checked={notificationConfig.iosConfig.enabled} 
                  onCheckedChange={(checked) => setNotificationConfig({
                    ...notificationConfig, 
                    iosConfig: {...notificationConfig.iosConfig, enabled: checked}
                  })}
                />
              </div>
              <Input 
                value={notificationConfig.iosConfig.apnsKey} 
                onChange={(e) => setNotificationConfig({
                  ...notificationConfig, 
                  iosConfig: {...notificationConfig.iosConfig, apnsKey: e.target.value}
                })}
                placeholder="Clé APNS"
                disabled={!notificationConfig.iosConfig.enabled}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Notifications navigateur web</Label>
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm">Activer les notifications navigateur</div>
                <Switch 
                  checked={notificationConfig.browserEnabled} 
                  onCheckedChange={(checked) => setNotificationConfig({...notificationConfig, browserEnabled: checked})}
                />
              </div>
              <Input 
                value={notificationConfig.webPushApiKey} 
                onChange={(e) => setNotificationConfig({...notificationConfig, webPushApiKey: e.target.value})}
                placeholder="Clé API Web Push"
                disabled={!notificationConfig.browserEnabled}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Notifications in-app</Label>
              <div className="flex items-center justify-between">
                <div className="text-sm">Activer les notifications in-app</div>
                <Switch 
                  checked={notificationConfig.inAppEnabled} 
                  onCheckedChange={(checked) => setNotificationConfig({...notificationConfig, inAppEnabled: checked})}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Configuration générale</Label>
              <div className="flex items-center justify-between">
                <div className="text-sm">Sons de notification</div>
                <Switch 
                  checked={notificationConfig.soundEnabled} 
                  onCheckedChange={(checked) => setNotificationConfig({...notificationConfig, soundEnabled: checked})}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsConfigOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleUpdateConfig}>
              Enregistrer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Create/Edit Template Dialog */}
      <Dialog open={isTemplateFormOpen} onOpenChange={setIsTemplateFormOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{selectedTemplate ? "Modifier le template" : "Nouveau template de notification"}</DialogTitle>
            <DialogDescription>
              {selectedTemplate ? "Modifiez votre template de notification" : "Créez un nouveau template de notification"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Titre de la notification</Label>
              <Input
                id="title"
                value={newTemplate.title}
                onChange={(e) => setNewTemplate({...newTemplate, title: e.target.value})}
                placeholder="ex: Confirmation de rendez-vous"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="content">Contenu</Label>
              <Textarea
                id="content"
                value={newTemplate.content}
                onChange={(e) => setNewTemplate({...newTemplate, content: e.target.value})}
                placeholder="ex: Votre rendez-vous a été confirmé pour {date} à {heure}."
              />
              <div className="text-xs text-muted-foreground">
                Utilisez {'{prénom}'}, {'{date}'}, {'{heure}'}, etc. comme variables.
              </div>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="type">Type de notification</Label>
              <Select 
                value={newTemplate.type}
                onValueChange={(value: NotificationType) => setNewTemplate({...newTemplate, type: value})}
              >
                <SelectTrigger id="type">
                  <SelectValue placeholder="Sélectionner un type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="push">Push mobile</SelectItem>
                  <SelectItem value="browser">Navigateur web</SelectItem>
                  <SelectItem value="in-app">In-app</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="icon">Icône</Label>
              <Select 
                value={newTemplate.icon}
                onValueChange={(value) => setNewTemplate({...newTemplate, icon: value})}
              >
                <SelectTrigger id="icon">
                  <SelectValue placeholder="Sélectionner une icône" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bell">Cloche</SelectItem>
                  <SelectItem value="calendar">Calendrier</SelectItem>
                  <SelectItem value="clock">Horloge</SelectItem>
                  <SelectItem value="tag">Étiquette</SelectItem>
                  <SelectItem value="info">Information</SelectItem>
                  <SelectItem value="check-circle">Validé</SelectItem>
                  <SelectItem value="x-circle">Annulé</SelectItem>
                  <SelectItem value="alert-triangle">Alerte</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="trigger">Événement déclencheur</Label>
              <Select 
                value={newTemplate.triggeredBy}
                onValueChange={(value) => setNewTemplate({...newTemplate, triggeredBy: value})}
              >
                <SelectTrigger id="trigger">
                  <SelectValue placeholder="Sélectionner un événement" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="appointment_created">Création de rendez-vous</SelectItem>
                  <SelectItem value="appointment_reminder">Rappel de rendez-vous</SelectItem>
                  <SelectItem value="appointment_cancelled">Annulation de rendez-vous</SelectItem>
                  <SelectItem value="promotion_created">Nouvelle promotion</SelectItem>
                  <SelectItem value="blog_published">Publication d'article</SelectItem>
                  <SelectItem value="custom">Événement personnalisé</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch 
                id="active" 
                checked={newTemplate.active} 
                onCheckedChange={(checked) => setNewTemplate({...newTemplate, active: checked})}
              />
              <Label htmlFor="active">Activer ce template</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={resetTemplateForm}>
              Annuler
            </Button>
            <Button onClick={handleSaveTemplate} disabled={!newTemplate.title || !newTemplate.content}>
              {selectedTemplate ? "Mettre à jour" : "Créer le template"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
