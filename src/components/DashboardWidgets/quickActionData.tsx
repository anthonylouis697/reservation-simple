
import React from 'react';
import { Calendar, UserPlus, Settings, BarChart3, Tag } from "lucide-react";
import { QuickActionProps } from "./QuickAction";

export const getQuickActions = (navigateFunction: (path: string) => void): QuickActionProps[] => [
  {
    icon: <Calendar className="h-5 w-5 text-blue-600" />,
    label: "Nouveau rendez-vous",
    description: "Créer un nouveau rendez-vous",
    onClick: () => navigateFunction("/calendar"),
    color: "bg-blue-100"
  },
  {
    icon: <UserPlus className="h-5 w-5 text-green-600" />,
    label: "Nouveau client",
    description: "Ajouter un client à votre base",
    onClick: () => navigateFunction("/clients"),
    color: "bg-green-100"
  },
  {
    icon: <Tag className="h-5 w-5 text-purple-600" />,
    label: "Nouveau service",
    description: "Créer ou modifier vos services",
    onClick: () => navigateFunction("/settings?tab=services"),
    color: "bg-purple-100"
  },
  {
    icon: <BarChart3 className="h-5 w-5 text-amber-600" />,
    label: "Statistiques",
    description: "Voir vos données d'activité",
    onClick: () => navigateFunction("/statistics"),
    color: "bg-amber-100"
  },
  {
    icon: <Settings className="h-5 w-5 text-indigo-600" />,
    label: "Paramètres",
    description: "Configurer votre compte",
    onClick: () => navigateFunction("/settings"),
    color: "bg-indigo-100"
  }
];
