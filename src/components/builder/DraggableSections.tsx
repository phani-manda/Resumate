'use client'

import { useState } from 'react'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { restrictToVerticalAxis, restrictToParentElement } from '@dnd-kit/modifiers'

interface SortableSection {
  id: string
  label: string
  icon: React.ComponentType<{ className?: string }>
}

interface DraggableSectionsProps {
  sections: SortableSection[]
  onReorder: (sections: SortableSection[]) => void
  renderSection: (section: SortableSection, isDragging: boolean) => React.ReactNode
}

export function DraggableSections({
  sections,
  onReorder,
  renderSection,
}: DraggableSectionsProps) {
  const [activeId, setActiveId] = useState<string | null>(null)
  const activeSection = activeId ? sections.find(s => s.id === activeId) : null

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    setActiveId(null)

    if (over && active.id !== over.id) {
      const oldIndex = sections.findIndex(s => s.id === active.id)
      const newIndex = sections.findIndex(s => s.id === over.id)
      onReorder(arrayMove(sections, oldIndex, newIndex))
    }
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      modifiers={[restrictToVerticalAxis, restrictToParentElement]}
    >
      <SortableContext items={sections} strategy={verticalListSortingStrategy}>
        <div className="space-y-2">
          {sections.map(section => renderSection(section, section.id === activeId))}
        </div>
      </SortableContext>

      <DragOverlay>
        {activeSection ? (
          <div className="opacity-80 shadow-2xl">
            {renderSection(activeSection, true)}
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}
