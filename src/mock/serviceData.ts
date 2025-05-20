
import { Service, Category } from '@/types/service';

// Données fictives des services
export const initialServices: Service[] = [
  {
    id: "1",
    name: "Consultation standard",
    description: "Consultation initiale pour évaluer les besoins du client",
    duration: 30,
    price: 50,
    location: "Cabinet principal",
    capacity: 1,
    category: "Consultations",
    categoryId: "cat1",
    bufferTimeBefore: 5,
    bufferTimeAfter: 5,
    assignedEmployees: ["1", "2"],
    isRecurring: false,
    isActive: true,
  },
  {
    id: "2",
    name: "Traitement complet",
    description: "Session de traitement complète incluant diagnostic et soins",
    duration: 60,
    price: 100,
    location: "Cabinet principal",
    capacity: 1,
    category: "Traitements",
    categoryId: "cat2",
    bufferTimeBefore: 10,
    bufferTimeAfter: 10,
    assignedEmployees: ["1"],
    isRecurring: false,
    isActive: true,
  },
  {
    id: "3",
    name: "Atelier en groupe",
    description: "Atelier collectif pour apprendre des techniques spécifiques",
    duration: 90,
    price: 30,
    location: "Salle commune",
    capacity: 10,
    category: "Ateliers",
    categoryId: "cat4",
    bufferTimeBefore: 15,
    bufferTimeAfter: 15,
    assignedEmployees: ["2", "3"],
    isRecurring: true,
    recurringFrequency: "weekly",
    recurringExceptions: ["2025-06-15", "2025-07-20"],
    isActive: true,
  },
  {
    id: "4",
    name: "Thérapie intensive",
    description: "Session de thérapie approfondie pour cas complexes",
    duration: 120,
    price: 150,
    location: "Cabinet spécialisé",
    capacity: 1,
    category: "Thérapies",
    categoryId: "cat3",
    bufferTimeBefore: 10,
    bufferTimeAfter: 10,
    assignedEmployees: ["1"],
    isRecurring: false,
    isActive: true,
    variableDurationOptions: [
      { id: "opt1", name: "Standard", duration: 60, price: 100 },
      { id: "opt2", name: "Intensive", duration: 90, price: 150 },
      { id: "opt3", name: "Premium", duration: 120, price: 200 }
    ]
  },
  {
    id: "5",
    name: "Massage relaxant",
    description: "Massage pour détendre les muscles et réduire le stress",
    duration: 60,
    price: 80,
    location: "Salle de massage",
    capacity: 1,
    category: "Massages",
    categoryId: "cat5",
    bufferTimeBefore: 5,
    bufferTimeAfter: 10,
    assignedEmployees: ["3"],
    isRecurring: false,
    isActive: true,
  },
  {
    id: "6",
    name: "Séance spéciale",
    description: "Séance pour traitement spécifique et personnalisé",
    duration: 45,
    price: 75,
    location: "Cabinet principal",
    capacity: 1,
    category: "Traitements",
    categoryId: "cat2",
    bufferTimeBefore: 5,
    bufferTimeAfter: 5,
    assignedEmployees: ["2"],
    isRecurring: false,
    isActive: false,
  }
];

// Données fictives des catégories
export const initialCategories: Category[] = [
  {
    id: "cat1",
    name: "Consultations",
    description: "Services de consultation et d'évaluation initiale",
    isActive: true,
    color: "#8B5CF6", // Purple
    imageUrl: "https://images.unsplash.com/photo-1500673922987-e212871fec22?w=300&h=300&fit=crop",
    order: 0
  },
  {
    id: "cat2",
    name: "Traitements",
    description: "Services de traitement et de soins",
    isActive: true,
    color: "#10B981", // Green
    imageUrl: "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=300&h=300&fit=crop",
    order: 1
  },
  {
    id: "cat3",
    name: "Thérapies",
    description: "Services thérapeutiques spécialisés",
    isActive: true,
    color: "#3B82F6", // Blue
    imageUrl: "/placeholder.svg",
    order: 2
  },
  {
    id: "cat4",
    name: "Ateliers",
    description: "Activités en groupe et ateliers collectifs",
    isActive: true,
    color: "#F59E0B", // Amber
    order: 3
  },
  {
    id: "cat5",
    name: "Massages",
    description: "Services de massage et relaxation",
    parentId: "cat2",
    isActive: true,
    color: "#06B6D4", // Cyan
    imageUrl: "https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=300&h=300&fit=crop",
    order: 0
  },
  {
    id: "cat6",
    name: "Soins du visage",
    description: "Traitements pour le visage",
    parentId: "cat2",
    isActive: false,
    color: "#EC4899", // Pink
    order: 1
  }
];
