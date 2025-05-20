
import { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Category } from "@/types/service";
import { ChevronRight, ChevronDown, Edit, Trash2, ToggleLeft, ToggleRight, GripVertical, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface DraggableCategoryItemProps {
  category: Category;
  depth?: number;
  isExpanded: boolean;
  hasChildren: boolean;
  serviceCount: number;
  onEdit: (category: Category) => void;
  onDelete: (categoryId: string) => void;
  onToggleStatus: (categoryId: string) => void;
  onToggleExpand: (categoryId: string) => void;
  children?: React.ReactNode;
}

export function DraggableCategoryItem({
  category,
  depth = 0,
  isExpanded,
  hasChildren,
  serviceCount,
  onEdit,
  onDelete,
  onToggleStatus,
  onToggleExpand,
  children
}: DraggableCategoryItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: category.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    backgroundColor: category.color ? `${category.color}22` : undefined, // 22 for transparency
    borderLeft: category.color ? `3px solid ${category.color}` : undefined,
    zIndex: isDragging ? 50 : 1
  };

  const hasImage = Boolean(category.imageUrl);

  return (
    <div className="category-item">
      <div 
        ref={setNodeRef}
        className={`flex items-center p-3 rounded-md hover:bg-secondary/20 mb-1 ${!category.isActive ? 'opacity-60' : ''} ${isDragging ? 'shadow-lg' : ''}`} 
        style={style}
      >
        <div className="flex-none cursor-grab mr-2" {...attributes} {...listeners}>
          <GripVertical className="h-4 w-4 text-muted-foreground" />
        </div>
        
        <div 
          className="flex-1 flex items-center"
          onClick={() => hasChildren && onToggleExpand(category.id)}
        >
          <div style={{ width: `${depth * 20}px` }} />
          {hasChildren ? (
            isExpanded ? (
              <ChevronDown className="h-4 w-4 mr-1 text-muted-foreground shrink-0" />
            ) : (
              <ChevronRight className="h-4 w-4 mr-1 text-muted-foreground shrink-0" />
            )
          ) : (
            <div className="w-5" />
          )}
          
          {hasImage ? (
            <div className="h-8 w-8 rounded-md overflow-hidden mr-2 bg-secondary flex-shrink-0">
              <img 
                src={category.imageUrl} 
                alt={category.name} 
                className="h-full w-full object-cover"
              />
            </div>
          ) : category.icon ? (
            <div 
              className="h-8 w-8 rounded-md flex items-center justify-center mr-2 flex-shrink-0"
              style={{ backgroundColor: category.color ? `${category.color}22` : undefined }}
            >
              <span className="text-lg" style={{ color: category.color }}>
                {category.icon}
              </span>
            </div>
          ) : (
            <div 
              className="h-8 w-8 rounded-md flex items-center justify-center mr-2 bg-secondary/50 flex-shrink-0"
            >
              <ImageIcon className="h-4 w-4 text-muted-foreground" />
            </div>
          )}
          
          <span className="font-medium">{category.name}</span>
          {!category.isActive && (
            <Badge variant="outline" className="ml-2 bg-gray-100 text-gray-500">
              Inactif
            </Badge>
          )}
          {serviceCount > 0 && (
            <Badge variant="secondary" className="ml-2">
              {serviceCount} service{serviceCount > 1 ? 's' : ''}
            </Badge>
          )}
        </div>
        
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={(e) => {
              e.stopPropagation();
              onToggleStatus(category.id);
            }}
          >
            {category.isActive ? (
              <ToggleLeft className="h-4 w-4" />
            ) : (
              <ToggleRight className="h-4 w-4" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(category);
            }}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-destructive"
                onClick={(e) => e.stopPropagation()}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
                <AlertDialogDescription>
                  Êtes-vous sûr de vouloir supprimer cette catégorie ?
                  {hasChildren && (
                    <p className="mt-2 font-semibold text-destructive">
                      Attention : Cette catégorie contient des sous-catégories qui seront également supprimées.
                    </p>
                  )}
                  {serviceCount > 0 && (
                    <p className="mt-2 font-semibold text-destructive">
                      Attention : {serviceCount} service{serviceCount > 1 ? 's' : ''} {serviceCount > 1 ? 'sont' : 'est'} associé{serviceCount > 1 ? 's' : ''} à cette catégorie.
                    </p>
                  )}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Annuler</AlertDialogCancel>
                <AlertDialogAction 
                  onClick={() => onDelete(category.id)}
                >
                  Supprimer
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
      
      {isExpanded && hasChildren && (
        <div className="category-children ml-2">
          {children}
        </div>
      )}
    </div>
  );
}
