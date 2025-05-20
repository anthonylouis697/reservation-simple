
import React, { useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { BookingStep } from '../types';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Move, Eye, CheckCircle, Pencil, Check, X } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

interface SortableStepProps {
  step: BookingStep;
  onChange: (id: string, enabled: boolean) => void;
  isFirst: boolean;
  onEditLabel?: (id: string, label: string) => void;
}

const SortableStep = ({ step, onChange, isFirst, onEditLabel }: SortableStepProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: step.id });

  const [isEditing, setIsEditing] = useState(false);
  const [tempLabel, setTempLabel] = useState(step.customLabel || step.name);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
  };

  const handleEditStart = (e: React.MouseEvent) => {
    e.stopPropagation();
    setTempLabel(step.customLabel || step.name);
    setIsEditing(true);
  };

  const handleSave = () => {
    if (onEditLabel && tempLabel.trim()) {
      onEditLabel(step.id, tempLabel.trim());
      toast.success("Nom de l'étape mis à jour");
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setTempLabel(step.customLabel || step.name);
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      className={cn(
        "flex items-center justify-between p-3 bg-white border rounded-md mb-2 transition-all",
        isDragging && "shadow-lg border-primary border-2",
        !step.enabled && "opacity-70",
        isFirst && step.enabled && "border-primary/50 bg-primary/5"
      )}
    >
      <div className="flex items-center gap-3">
        <Button 
          variant="ghost" 
          size="sm" 
          className="cursor-move text-muted-foreground" 
          {...attributes} 
          {...listeners}
        >
          <Move className="h-4 w-4" />
        </Button>
        
        <div className="flex items-center gap-2">
          <div className={cn(
            "w-8 h-8 flex items-center justify-center rounded-full", 
            step.enabled 
              ? "bg-primary/10 text-primary" 
              : "bg-muted text-muted-foreground"
          )}>
            {step.icon}
          </div>
          
          <div>
            {isEditing ? (
              <div className="flex gap-2 items-center">
                <Input
                  value={tempLabel}
                  onChange={(e) => setTempLabel(e.target.value)}
                  className="h-8 w-48"
                  autoFocus
                />
                <Button 
                  size="sm" 
                  variant="ghost" 
                  onClick={handleSave}
                  className="h-8 w-8 p-0 text-green-600 hover:bg-green-50 hover:text-green-700"
                >
                  <Check className="h-4 w-4" />
                </Button>
                <Button 
                  size="sm" 
                  variant="ghost" 
                  onClick={handleCancel}
                  className="h-8 w-8 p-0 text-red-600 hover:bg-red-50 hover:text-red-700"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-1">
                <span className={cn(
                  "font-medium",
                  !step.enabled && "text-muted-foreground"
                )}>
                  {step.customLabel || step.name}
                </span>
                {onEditLabel && (
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    onClick={handleEditStart}
                    className="h-6 w-6 p-0 text-muted-foreground hover:text-primary"
                  >
                    <Pencil className="h-3 w-3" />
                  </Button>
                )}
              </div>
            )}
            
            {isFirst && step.enabled && (
              <div className="text-xs text-primary flex items-center gap-1 mt-0.5">
                <CheckCircle className="h-3 w-3" />
                <span>Étape active dans l'aperçu</span>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        {isFirst && step.enabled && (
          <span className="text-xs bg-primary/10 text-primary rounded-full px-2 py-0.5">
            Visible
          </span>
        )}
        <Switch 
          checked={step.enabled} 
          onCheckedChange={(checked) => onChange(step.id, checked)} 
        />
      </div>
    </div>
  );
};

interface SortableStepListProps {
  steps: BookingStep[];
  setSteps: (steps: BookingStep[]) => void;
  onStepChange?: (id: string, enabled: boolean) => void;
  onEditLabel?: (id: string, label: string) => void;
}

export const SortableStepList = ({ steps, setSteps, onStepChange, onEditLabel }: SortableStepListProps) => {
  // Capteurs pour le système de drag and drop
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Only activate after moving 8px to avoid accidental drags
      }
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );
  
  // Fonction pour gérer le drag and drop
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      const oldIndex = steps.findIndex((item) => item.id === active.id);
      const newIndex = steps.findIndex((item) => item.id === over.id);
      
      if (oldIndex !== -1 && newIndex !== -1) {
        const newSteps = arrayMove(steps, oldIndex, newIndex);
        setSteps(newSteps);
        toast.success("Ordre des étapes mis à jour");
      }
    }
  };

  // Get enabled steps to determine which is first
  const enabledSteps = steps.filter(step => step.enabled);
  const firstEnabledStepId = enabledSteps.length > 0 ? enabledSteps[0].id : null;
  
  return (
    <div className="space-y-4">
      <div className="bg-muted p-4 rounded-md mb-4 text-sm">
        <div className="flex items-start gap-3">
          <Eye className="h-5 w-5 text-primary mt-0.5" />
          <div>
            <p className="font-medium mb-1">Personnalisation des étapes</p>
            <p className="text-muted-foreground">
              Glissez-déposez pour réorganiser les étapes. Activez ou désactivez les étapes selon vos besoins. 
              Cliquez sur le nom pour le personnaliser.
            </p>
          </div>
        </div>
      </div>
      
      <DndContext 
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext 
          items={steps.map(step => step.id)}
          strategy={verticalListSortingStrategy}
        >
          {steps.map((step) => (
            <SortableStep 
              key={step.id} 
              step={step} 
              onChange={onStepChange || ((id, enabled) => {})} 
              isFirst={step.id === firstEnabledStepId}
              onEditLabel={onEditLabel}
            />
          ))}
        </SortableContext>
      </DndContext>
    </div>
  );
};
