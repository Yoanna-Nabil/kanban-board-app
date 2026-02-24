"use client";

import React, { useState, useMemo } from "react";
import { Task, ColumnType } from "@/types";
import { useDroppable } from "@dnd-kit/core";
import { DraggableTaskCard } from "./DraggableTaskCard";

import {
  Paper,
  Box,
  Stack,
  Typography,
  Badge,
  IconButton,
  Divider,
  Button,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

//  Props passed from the board to a single column
interface ColumnProps {
  title: string;                // Column title (TO DO / IN PROGRESS / ...)
  columnType: ColumnType;       // Column ID used in backend + DnD
  tasks: Task[];                // Tasks already filtered for this column
  onAddTask?: () => void;       // Open modal to create task in this column
  onEditTask?: (task: Task) => void; // Open modal to edit selected task
  searchQuery?: string;         // Current search text (filters tasks)
}

//  How many tasks shown per page inside a column
const ITEMS_PER_PAGE = 5;

export const Column: React.FC<ColumnProps> = ({
  title,
  columnType,
  tasks,
  onAddTask,
  onEditTask,
  searchQuery = "",
}) => {
  //  Local pagination state for this column only
  const [currentPage, setCurrentPage] = useState(1);

  //  Make this column droppable so tasks can be dropped into it
  const { setNodeRef, isOver } = useDroppable({
    id: `column:${columnType}`, // IMPORTANT: used in drag end logic to detect target column
  });

  //  Filter tasks based on search query (title/description)
  const filteredTasks = useMemo(() => {
    if (!searchQuery.trim()) return tasks;

    const searchLower = searchQuery.toLowerCase();
    return tasks.filter(
      (task) =>
        task.title.toLowerCase().includes(searchLower) ||
        task.description.toLowerCase().includes(searchLower)
    );
  }, [tasks, searchQuery]);

  //  Compute total pages for pagination
  const totalPages = Math.ceil(filteredTasks.length / ITEMS_PER_PAGE);

  //  Slice the current page tasks only
  const paginatedTasks = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredTasks.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredTasks, currentPage]);

  //  Reset pagination when search changes (so user starts from page 1)
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  //  Badge color per column
  const badgeColorMap: Record<
    ColumnType,
    "primary" | "warning" | "secondary" | "success"
  > = {
    backlog: "primary",
    in_progress: "warning",
    review: "secondary",
    done: "success",
  };

  return (
    <Paper
      elevation={0}
      sx={{
        width: "100%",
        minWidth: 0,
        bgcolor: "#f3f4f6",
        borderRadius: 2,
        p: 2,
        display: "flex",
        flexDirection: "column",
        //  Visual feedback when a dragged item is over this column
        border: isOver ? "2px solid" : "2px solid transparent",
        borderColor: isOver ? "primary.main" : "transparent",
        transition: "all 200ms ease",
      }}
    >
      {/*  Column Header */}
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={1.5}>
        <Stack direction="row" alignItems="center" spacing={2}>
          <Typography variant="h6" fontWeight={700} sx={{ fontSize: 18 }}>
            {title}
          </Typography>

          {/*  Badge shows number of tasks (after filtering) */}
          <Badge badgeContent={filteredTasks.length} color={badgeColorMap[columnType]} />
        </Stack>

        {/*  Add task button */}
        <IconButton onClick={onAddTask} aria-label="add task" size="small">
          <AddIcon />
        </IconButton>
      </Stack>

      <Divider sx={{ mb: 1.5 }} />

      {/*  Droppable Tasks Container */}
      <Box
        ref={setNodeRef} // IMPORTANT: makes this area the drop target
        sx={{
          flex: 1,
          overflowY: "auto",
          minHeight: 0,
          borderRadius: 1,
          transition: "all 200ms ease",
          backgroundColor: isOver ? "rgba(59, 130, 246, 0.05)" : "transparent",
          p: isOver ? 1 : 0,
        }}
      >
        {paginatedTasks.length > 0 ? (
          <Stack spacing={1.25}>
            {/* Render draggable task cards */}
            {paginatedTasks.map((task) => (
              <DraggableTaskCard key={task.id} task={task} onEdit={onEditTask} />
            ))}
          </Stack>
        ) : (
          //  Empty state (no tasks OR no matching tasks)
          <Box
            sx={{
              height: 128,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "text.secondary",
              textAlign: "center",
              px: 2,
            }}
          >
            <Typography variant="body2">
              {filteredTasks.length === 0 && searchQuery ? "No matching tasks" : "No tasks yet"}
            </Typography>
          </Box>
        )}
      </Box>

      {/*  Pagination Controls (shown only if more than one page) */}
      {totalPages > 1 && (
        <Stack direction="row" alignItems="center" justifyContent="space-between" mt={2}>
          <Button
            size="small"
            variant="outlined"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            ← Prev
          </Button>

          <Typography variant="caption" color="text.secondary">
            Page {currentPage} of {totalPages}
          </Typography>

          <Button
            size="small"
            variant="outlined"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            Next →
          </Button>
        </Stack>
      )}
    </Paper>
  );
};