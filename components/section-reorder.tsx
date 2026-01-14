"use client"

import React from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export type SectionId = 'experience' | 'education' | 'projects' | 'certifications';

export const DEFAULT_SECTION_ORDER: SectionId[] = [
  'experience',
  'education', 
  'projects',
  'certifications'
];

export const SECTION_LABELS: Record<SectionId, string> = {
  experience: 'Experience',
  education: 'Education',
  projects: 'Projects',
  certifications: 'Certifications'
};

interface SortableItemProps {
  id: SectionId;
}

function SortableItem({ id }: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`
        flex items-center gap-3 px-4 py-3 bg-white border border-sumi/20 
        rounded-lg shadow-sm cursor-grab active:cursor-grabbing
        ${isDragging ? 'opacity-50 shadow-lg z-50' : 'opacity-100'}
        hover:border-vermilion/50 transition-colors
      `}
      {...attributes}
      {...listeners}
    >
      <GripVertical className="w-5 h-5 text-sumi/40" />
      <span className="font-medium text-sumi">{SECTION_LABELS[id]}</span>
    </div>
  );
}

interface SectionReorderProps {
  sectionOrder: SectionId[];
  onOrderChange: (newOrder: SectionId[]) => void;
  onClose: () => void;
}

export function SectionReorder({ sectionOrder, onOrderChange, onClose }: SectionReorderProps) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = sectionOrder.indexOf(active.id as SectionId);
      const newIndex = sectionOrder.indexOf(over.id as SectionId);
      onOrderChange(arrayMove(sectionOrder, oldIndex, newIndex));
    }
  }

  function handleReset() {
    onOrderChange([...DEFAULT_SECTION_ORDER]);
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-washi border border-sumi/20 rounded-xl shadow-2xl w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-sumi/10">
          <div>
            <h2 className="text-lg font-semibold text-sumi">Reorder Sections</h2>
            <p className="text-sm text-sumi/60">Drag sections to change their order</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-sumi/10 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-sumi/60" />
          </button>
        </div>

        {/* Sortable List */}
        <div className="p-6 space-y-2">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={sectionOrder}
              strategy={verticalListSortingStrategy}
            >
              {sectionOrder.map((id) => (
                <SortableItem key={id} id={id} />
              ))}
            </SortableContext>
          </DndContext>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-sumi/10 bg-sumi/5">
          <button
            onClick={handleReset}
            className="text-sm text-sumi/70 hover:text-vermilion transition-colors duration-200 font-normal"
          >
            Reset to Default
          </button>
          <Button
            onClick={onClose}
            className="bg-vermilion hover:bg-vermilion/90 text-white"
          >
            Done
          </Button>
        </div>
      </div>
    </div>
  );
}

export default SectionReorder;
