
import React from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
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
import { Move } from 'lucide-react';

interface SortableStepProps {
  step: BookingStep;
  onChange: (id: string, enabled: boolean) => void;
}

const SortableStep = ({ step, onChange }: SortableStepProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: step.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      className="flex items-center justify-between p-3 bg-white border rounded-md mb-2"
    >
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" className="cursor-move" {...attributes} {...listeners}>
          <Move className="h-4 w-4" />
        </Button>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 flex items-center justify-center rounded-full bg-primary/10">
            {step.icon}
          </div>
          <span className="font-medium">{step.name}</span>
        </div>
      </div>
      <Switch 
        checked={step.enabled} 
        onCheckedChange={(checked) => onChange(step.id, checked)} 
      />
    </div>
  );
};

interface SortableStepListProps {
  steps: BookingStep[];
  setSteps: (steps: BookingStep[]) => void;
  onStepChange: (id: string, enabled: boolean) => void;
}

export const SortableStepList = ({ steps, setSteps, onStepChange }: SortableStepListProps) => {
  // Capteurs pour le système de drag and drop
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );
  
  // Fonction pour gérer le drag and drop
  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    
    if (active.id !== over.id) {
      setSteps((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };
  
  return (
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
            onChange={onStepChange} 
          />
        ))}
      </SortableContext>
    </DndContext>
  );
};
