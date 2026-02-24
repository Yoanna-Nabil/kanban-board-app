"use client";

import React, { useState } from "react";
import { Task, ColumnType } from "@/types";
import { useTaskStore } from "@/store/taskStore";
import { Column, TaskModal, SearchBar } from "@/components";
import { useTasks } from "@/hooks/useTasks";
import { useTaskMutations } from "@/hooks/useTaskMutations";

import {
  DndContext,
  DragEndEvent,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from "@dnd-kit/core";

import { Container, Typography, Box, Grid, Alert, Stack, Divider } from "@mui/material";
import { TaskCard } from "@/components";

export const KanbanBoard: React.FC = () => {
  //  Modal open/close state
  const [isModalOpen, setIsModalOpen] = useState(false);

  //  Task currently being edited (undefined means "create new task")
  const [selectedTask, setSelectedTask] = useState<Task | undefined>();

  //  Column used for creating a new task (default backlog)
  const [selectedColumn, setSelectedColumn] = useState<ColumnType>("backlog");

  //  Task shown inside DragOverlay while dragging
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  //  UI-only store for search query (Zustand)
  const { searchQuery, setSearchQuery } = useTaskStore();

  //  React Query hook: fetch + cache tasks
  const { data: tasks = [], isLoading: loading, error } = useTasks();

  //  React Query mutations for CRUD and move
  const { addTaskMutation, editTaskMutation, moveTaskMutation } = useTaskMutations();

  //  Column configuration (order + labels)
  const columns: Array<{ id: ColumnType; title: string }> = [
    { id: "backlog", title: "TO DO" },
    { id: "in_progress", title: "IN PROGRESS" },
    { id: "review", title: "IN REVIEW" },
    { id: "done", title: "DONE" },
  ];

  //  Returns tasks that belong to a specific column
  const getTasksByColumn = (column: ColumnType) =>
    tasks.filter((t) => t.column === column);

  //  Open modal to create a task in a specific column
  const handleAddTask = (column: ColumnType) => {
    setSelectedTask(undefined);
    setSelectedColumn(column);
    setIsModalOpen(true);
  };

  //  Open modal to edit an existing task
  const handleEditTask = (task: Task) => {
    setSelectedTask(task);
    setSelectedColumn(task.column);
    setIsModalOpen(true);
  };

  //  Save handler used by TaskModal (create vs edit)
  const handleSaveTask = async (title: string, description: string, column: ColumnType) => {
    if (selectedTask) {
      //  Update existing task
      await editTaskMutation.mutateAsync({
        id: selectedTask.id,
        payload: { title, description },
      });
    } else {
      //  Create new task
      await addTaskMutation.mutateAsync({ title, description, column });
    }
  };

  //  Configure pointer sensor to start dragging after small movement
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  //  When drag starts, find the dragged task and show it in DragOverlay
  const handleDragStart = (event: DragStartEvent) => {
    const id = String(event.active.id);
    if (!id.startsWith("task:")) return;

    const taskId = id.replace("task:", "");
    const task = tasks.find((t) => t.id === taskId);
    if (task) setActiveTask(task);
  };

  //  When drag ends, detect the target column and call move mutation
  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    //  Always clear overlay after drop
    setActiveTask(null);

    //  If dropped outside any droppable area, do nothing
    if (!over) return;

    const activeId = String(active.id);
    if (!activeId.startsWith("task:")) return;

    const taskId = activeId.replace("task:", "");

    const overId = String(over.id);
    let toColumn: ColumnType | null = null;

    //  Dropped directly on a column container
    if (overId.startsWith("column:")) {
      toColumn = overId.replace("column:", "") as ColumnType;
    }
    //  Dropped on top of another task (so we infer the column from that task)
    else if (overId.startsWith("task:")) {
      const overTaskId = overId.replace("task:", "");
      const overTask = tasks.find((t) => t.id === overTaskId);
      if (overTask) toColumn = overTask.column;
    }

    //  If we still couldn't determine a target column, stop
    if (!toColumn) return;

    const task = tasks.find((t) => t.id === taskId);

    //  Do nothing if task not found or column is the same
    if (!task || task.column === toColumn) return;

    //  Persist the move (API + refetch cache)
    await moveTaskMutation.mutateAsync({ id: taskId, column: toColumn });
  };

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <Box sx={{ minHeight: "100vh", bgcolor: "#e5e7eb", py: 4, px: 2, overflowX: "hidden" }}>
        <Container maxWidth={false} disableGutters>
          <Box sx={{ px: 2 }}>
            {/*  Header area: title + total tasks + search */}
            <Stack spacing={2} mb={3.5}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 2,
                  flexWrap: { xs: "wrap", sm: "nowrap" },
                }}
              >
                <Box>
                  <Typography variant="h4" fontWeight={800} sx={{ mb: 0.25 }}>
                    KANBAN BOARD
                  </Typography>

                  {/*  Dynamic total tasks count */}
                  <Typography color="text.secondary" variant="body2">
                    {loading
                      ? "Loading tasks..."
                      : `${tasks.length} task${tasks.length !== 1 ? "s" : ""}`}
                  </Typography>
                </Box>

                {/*  Search input on the right */}
                <Box sx={{ width: { xs: "100%", sm: 360 }, flexShrink: 0 }}>
                  <SearchBar onSearch={setSearchQuery} />
                </Box>
              </Box>

              {/*  Error / Loading messages */}
              {error && <Alert severity="error">{String(error)}</Alert>}
              {loading && <Alert severity="info">Loading tasks...</Alert>}
            </Stack>

            {/*  Divider between header and board */}
            <Divider sx={{ mb: 3, borderColor: "#d1d5db", opacity: 1 }} />

            {/*  Columns grid */}
            <Grid container spacing={2}>
              {columns.map((c) => (
                <Grid key={c.id} size={{ xs: 12, md: 6, lg: 3 }} sx={{ display: "flex" }}>
                  <Column
                    title={c.title}
                    columnType={c.id}
                    tasks={getTasksByColumn(c.id)}
                    searchQuery={searchQuery}
                    onAddTask={() => handleAddTask(c.id)}
                    onEditTask={handleEditTask}
                  />
                </Grid>
              ))}
            </Grid>
          </Box>

          {/*  Modal for create/edit */}
          <TaskModal
            isOpen={isModalOpen}
            task={selectedTask}
            column={selectedColumn}
            onClose={() => {
              setIsModalOpen(false);
              setSelectedTask(undefined);
            }}
            onSave={handleSaveTask}
          />
        </Container>
      </Box>

      {/*  DragOverlay shows the dragged task following the pointer */}
      <DragOverlay dropAnimation={null}>
        {activeTask ? (
          <Box sx={{ width: 360, pointerEvents: "none" }}>
            <TaskCard task={activeTask} />
          </Box>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};