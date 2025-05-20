
import React from 'react';
import { BookingStep } from '../types';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { DndContext, closestCenter, DragEndEvent } from '@dnd-kit/core';
import { GripVertical } from 'lucide-react';

interface SortableItemProps {
  step: BookingStep;
  onStepChange: (id: string, enabled: boolean) => void;
  onEditLabel: (id: string, label: string) => void;
}

const SortableItem = ({ step, onStepChange, onEditLabel }: SortableItemProps) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: step.id });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  // Create instance of the Lucide icon component
  const IconComponent = step.icon;
  
  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center justify-between p-3 mb-2 bg-background rounded-md border"
    >
      <div className="flex items-center gap-4">
        <div
          className="cursor-grab touch-none" 
          {...attributes} 
          {...listeners}
        >
          <GripVertical className="h-5 w-5 text-muted-foreground" />
        </div>
        
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 flex items-center justify-center text-primary">
            <IconComponent size={18} />
          </div>
          <span className="font-medium">{step.name}</span>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        {step.enabled && (
          <div className="max-w-[180px]">
            <Input 
              placeholder="Personnaliser le libellé"
              value={step.customLabel || ''}
              onChange={(e) => onEditLabel(step.id, e.target.value)}
              className="h-8 text-xs"
            />
          </div>
        )}
        
        <div className="flex items-center gap-2">
          <Switch
            id={`step-${step.id}`}
            checked={step.enabled}
            onCheckedChange={(checked) => onStepChange(step.id, checked)}
          />
          <Label htmlFor={`step-${step.id}`} className="text-xs cursor-pointer">
            {step.enabled ? 'Activé' : 'Désactivé'}
          </Label>
        </div>
      </div>
    </div>
  );
};

interface SortableStepListProps {
  steps: BookingStep[];
  setSteps: (steps: BookingStep[]) => void;
  onStepChange: (id: string, enabled: boolean) => void;
  onEditLabel: (id: string, label: string) => void;
}

export const SortableStepList: React.FC<SortableStepListProps> = ({
  steps,
  setSteps,
  onStepChange,
  onEditLabel
}) => {
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      const oldIndex = steps.findIndex((step) => step.id === active.id);
      const newIndex = steps.findIndex((step) => step.id === over.id);
      
      const newSteps = [...steps];
      const [movedStep] = newSteps.splice(oldIndex, 1);
      newSteps.splice(newIndex, 0, movedStep);
      
      setSteps(newSteps);
    }
  };
  
  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={steps.map(step => step.id)} strategy={verticalListSortingStrategy}>
        <div>
          {steps.map((step) => (
            <SortableItem 
              key={step.id} 
              step={step} 
              onStepChange={onStepChange}
              onEditLabel={onEditLabel}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
};
