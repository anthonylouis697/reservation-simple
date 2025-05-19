
import { useState } from "react";
import { PlusCircle, ChevronRight, ChevronDown, Edit, Trash2, ToggleLeft, ToggleRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
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
import { Category } from "@/types/service";
import { CategoryForm } from "./CategoryForm";

interface CategoriesManagementProps {
  categories: Category[];
  onAddCategory: (category: Category) => void;
  onUpdateCategory: (category: Category) => void;
  onDeleteCategory: (categoryId: string) => void;
  onToggleStatus: (categoryId: string) => void;
  serviceCounts: Record<string, number>;
}

export const CategoriesManagement = ({
  categories,
  onAddCategory,
  onUpdateCategory,
  onDeleteCategory,
  onToggleStatus,
  serviceCounts
}: CategoriesManagementProps) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});
  
  // Get root categories (those without parents)
  const rootCategories = categories.filter(cat => !cat.parentId);
  
  // Sort categories by order if available, or by name
  const sortCategories = (cats: Category[]) => {
    return [...cats].sort((a, b) => {
      if (a.order !== undefined && b.order !== undefined) {
        return a.order - b.order;
      }
      return a.name.localeCompare(b.name);
    });
  };

  const sortedRootCategories = sortCategories(rootCategories);
  
  // Get children of a specific category
  const getChildCategories = (parentId: string) => {
    return sortCategories(categories.filter(cat => cat.parentId === parentId));
  };
  
  const toggleExpand = (categoryId: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  };
  
  const handleAddCategory = () => {
    setEditingCategory(null);
    setIsFormOpen(true);
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setIsFormOpen(true);
  };

  const handleSubmit = (categoryData: Category) => {
    if (editingCategory) {
      onUpdateCategory(categoryData);
    } else {
      onAddCategory(categoryData);
    }
    setIsFormOpen(false);
    setEditingCategory(null);
  };

  const handleCancel = () => {
    setIsFormOpen(false);
    setEditingCategory(null);
  };

  // Recursive component to render category tree
  const CategoryItem = ({ category, depth = 0 }: { category: Category, depth?: number }) => {
    const childCategories = getChildCategories(category.id);
    const hasChildren = childCategories.length > 0;
    const isExpanded = expandedCategories[category.id] ?? false;
    const serviceCount = serviceCounts[category.id] || 0;
    
    const bgColorStyle = {
      backgroundColor: category.color ? `${category.color}22` : undefined, // 22 for transparency
      borderLeft: category.color ? `3px solid ${category.color}` : undefined,
    };

    return (
      <div className="category-item">
        <div 
          className={`flex items-center p-3 rounded-md hover:bg-secondary/20 cursor-pointer mb-1 ${!category.isActive ? 'opacity-60' : ''}`} 
          style={bgColorStyle}
        >
          <div 
            className="flex-1 flex items-center"
            onClick={() => hasChildren && toggleExpand(category.id)}
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
              onClick={() => onToggleStatus(category.id)}
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
              onClick={() => handleEditCategory(category)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-destructive"
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
                    onClick={() => onDeleteCategory(category.id)}
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
            {childCategories.map(childCategory => (
              <CategoryItem 
                key={childCategory.id} 
                category={childCategory} 
                depth={depth + 1} 
              />
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="categories-management mb-6">
      {isFormOpen ? (
        <CategoryForm 
          initialData={editingCategory || undefined} 
          categories={categories}
          onSubmit={handleSubmit} 
          onCancel={handleCancel} 
        />
      ) : (
        <>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Catégories</h2>
            <Button onClick={handleAddCategory}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Nouvelle catégorie
            </Button>
          </div>
          
          <Separator className="mb-4" />
          
          <div className="category-list">
            {sortedRootCategories.length > 0 ? (
              sortedRootCategories.map(category => (
                <CategoryItem key={category.id} category={category} />
              ))
            ) : (
              <div className="text-center p-4 text-muted-foreground">
                Aucune catégorie n'a encore été créée. Créez une catégorie pour organiser vos services.
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};
