
import { useState } from "react";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Category } from "@/types/service";
import { CategoryForm } from "./CategoryForm";
import { DraggableCategoryItem } from "./DraggableCategoryItem";
import {
  DndContext, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy
} from "@dnd-kit/sortable";

interface CategoriesManagementProps {
  categories: Category[];
  onAddCategory: (category: Category) => void;
  onUpdateCategory: (category: Category) => void;
  onDeleteCategory: (categoryId: string) => void;
  onToggleStatus: (categoryId: string) => void;
  onReorderCategories?: (categories: Category[]) => void;
  serviceCounts: Record<string, number>;
}

export const CategoriesManagement = ({
  categories,
  onAddCategory,
  onUpdateCategory,
  onDeleteCategory,
  onToggleStatus,
  onReorderCategories,
  serviceCounts
}: CategoriesManagementProps) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});
  
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );
  
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

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      const activeCategory = categories.find(cat => cat.id === active.id);
      const overCategory = categories.find(cat => cat.id === over.id);
      
      if (activeCategory && overCategory) {
        // Only reorder within the same level (siblings)
        if (activeCategory.parentId === overCategory.parentId) {
          const siblingCategories = categories.filter(cat => cat.parentId === activeCategory.parentId);
          const oldIndex = siblingCategories.findIndex(cat => cat.id === active.id);
          const newIndex = siblingCategories.findIndex(cat => cat.id === over.id);
          
          const reorderedSiblings = arrayMove(siblingCategories, oldIndex, newIndex);
          
          // Assign new order values
          const updatedCategories = [...categories];
          
          reorderedSiblings.forEach((cat, idx) => {
            const categoryIndex = updatedCategories.findIndex(c => c.id === cat.id);
            if (categoryIndex !== -1) {
              updatedCategories[categoryIndex] = {
                ...updatedCategories[categoryIndex],
                order: idx
              };
            }
          });
          
          if (onReorderCategories) {
            onReorderCategories(updatedCategories);
          }
        }
      }
    }
  };

  // Recursive component to render category tree with drag and drop
  const renderCategoryTree = (parentId?: string, depth = 0) => {
    const categoryList = parentId 
      ? categories.filter(cat => cat.parentId === parentId)
      : categories.filter(cat => !cat.parentId);
    
    const sortedCategories = sortCategories(categoryList);
    const categoryIds = sortedCategories.map(cat => cat.id);
    
    return (
      <SortableContext items={categoryIds} strategy={verticalListSortingStrategy}>
        {sortedCategories.map(category => {
          const childCategories = getChildCategories(category.id);
          const hasChildren = childCategories.length > 0;
          const isExpanded = expandedCategories[category.id] ?? false;
          const serviceCount = serviceCounts[category.id] || 0;
          
          return (
            <DraggableCategoryItem
              key={category.id}
              category={category}
              depth={depth}
              isExpanded={isExpanded}
              hasChildren={hasChildren}
              serviceCount={serviceCount}
              onEdit={handleEditCategory}
              onDelete={onDeleteCategory}
              onToggleStatus={onToggleStatus}
              onToggleExpand={toggleExpand}
            >
              {isExpanded && hasChildren && renderCategoryTree(category.id, depth + 1)}
            </DraggableCategoryItem>
          );
        })}
      </SortableContext>
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
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                {renderCategoryTree()}
              </DndContext>
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
