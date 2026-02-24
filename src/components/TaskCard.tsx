"use client";

import React, { useState } from "react";
import { Task } from "@/types";
import { Card, CardContent, Typography, Stack, Button } from "@mui/material";
import { useTaskMutations } from "@/hooks/useTaskMutations";

export const TaskCard: React.FC<{ task: Task; onEdit?: (task: Task) => void }> = ({
  task,
  onEdit,
}) => {
  //  React Query mutation for deleting a task
  const { deleteTaskMutation } = useTaskMutations();

  //  Local UI state for disabling button while deleting
  const [isDeleting, setIsDeleting] = useState(false);

  //  Delete handler with confirmation
  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;

    try {
      setIsDeleting(true);
      //  Trigger delete mutation (API + cache invalidation)
      await deleteTaskMutation.mutateAsync(task.id);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Card
      variant="outlined"
      sx={{
        borderLeftWidth: 4,
        borderLeftStyle: "solid",
        borderLeftColor: "primary.main",
        boxShadow: 2,
        transition: "box-shadow 150ms ease",
        "&:hover": { boxShadow: 4 },
      }}
    >
      <CardContent sx={{ pb: "16px !important" }}>
        {/* Task title */}
        <Typography variant="subtitle2" fontWeight={600} gutterBottom noWrap>
          {task.title}
        </Typography>

        {/*  Task description */}
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
          {task.description}
        </Typography>

        {/*  Action buttons */}
        <Stack direction="row" spacing={1}>
          <Button fullWidth variant="contained" onClick={() => onEdit?.(task)} size="small">
            Edit
          </Button>

          <Button
            fullWidth
            variant="contained"
            color="error"
            onClick={handleDelete}
            disabled={isDeleting}
            size="small"
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
};