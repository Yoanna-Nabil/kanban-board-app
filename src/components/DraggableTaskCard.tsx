"use client";

import React from "react";
import { useDraggable } from "@dnd-kit/core";
import { Task } from "@/types";
import { TaskCard } from "./TaskCard";
import { CSS } from "@dnd-kit/utilities";

export function DraggableTaskCard({
  task,
  onEdit,
}: {
  task: Task;
  onEdit?: (t: Task) => void;
}) {
  //  Makes this card draggable in DnD Kit
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      //  Unique draggable id used by DnD system
      id: `task:${task.id}`,

      //  Custom data attached to drag event (useful for debugging/logic)
      data: { taskId: task.id, fromColumn: task.column },
    });

  //  Apply translation transform during drag movement
  const style: React.CSSProperties = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.3 : 1,               //  Visual feedback while dragging
    cursor: isDragging ? "grabbing" : "grab",    //  Change cursor style on drag
    width: "100%",
    touchAction: "none",                          //  Prevent mobile scroll conflicts during drag
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {/*  Render the actual task UI */}
      <TaskCard task={task} onEdit={onEdit} />
    </div>
  );
}