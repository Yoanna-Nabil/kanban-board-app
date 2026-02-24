"use client";

import React, { useState, useEffect } from "react";
import { Task, ColumnType } from "@/types";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Stack,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

//  Props used to control modal behavior (open, close, save, edit/create)
interface TaskModalProps {
  isOpen: boolean;                       //  Controls Dialog visibility
  task?: Task;                           //  If present => editing mode
  column?: ColumnType;                   //  Default column for creation
  onClose: () => void;                   //  Close handler
  onSave: (title: string, description: string, column: ColumnType) => Promise<void>; //  Save handler
}

export const TaskModal: React.FC<TaskModalProps> = ({
  isOpen,
  task,
  column = "backlog",
  onClose,
  onSave,
}) => {
  //  Controlled form states
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedColumn, setSelectedColumn] = useState<ColumnType>(column);

  //  UI states for async saving + validation errors
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  //  Populate form when editing OR reset when creating
  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description);
      setSelectedColumn(task.column);
    } else {
      setTitle("");
      setDescription("");
      setSelectedColumn(column);
    }
    setError("");
  }, [task, column, isOpen]);

  //  Form submit handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    //  Basic validation
    if (!title.trim()) return setError("Task title is required");
    if (!description.trim()) return setError("Task description is required");

    try {
      setIsSaving(true);
      // Call parent save handler (create/edit)
      await onSave(title, description, selectedColumn);
      // Close modal if successful
      onClose();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to save task";
      setError(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  //  Prevent rendering if not open
  if (!isOpen) return null;

  const isEditing = !!task;

  return (
    <Dialog open={isOpen} onClose={onClose} fullWidth maxWidth="sm">
      {/*  Header */}
      <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        {isEditing ? "Edit Task" : "Create New Task"}

        {/*  Close button */}
        <IconButton onClick={onClose} sx={{ marginLeft: "auto" }} aria-label="close">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      {/*  Form body */}
      <form onSubmit={handleSubmit}>
        <DialogContent dividers>
          <Stack spacing={2}>
            {/*  Title input */}
            <TextField
              label="Task Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter task title"
              fullWidth
            />

            {/*  Description input */}
            <TextField
              label="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter task description"
              fullWidth
              multiline
              minRows={4}
            />

            {/*  Column selector */}
            <FormControl fullWidth>
              <InputLabel id="column-label">Column</InputLabel>
              <Select
                labelId="column-label"
                label="Column"
                value={selectedColumn}
                onChange={(e) => setSelectedColumn(e.target.value as ColumnType)}
              >
                <MenuItem value="backlog">Backlog</MenuItem>
                <MenuItem value="in_progress">In Progress</MenuItem>
                <MenuItem value="review">Review</MenuItem>
                <MenuItem value="done">Done</MenuItem>
              </Select>
            </FormControl>

            {/*  Error message */}
            {error && <Alert severity="error">{error}</Alert>}
          </Stack>
        </DialogContent>

        {/*  Footer actions */}
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={onClose} variant="outlined" disabled={isSaving}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" disabled={isSaving}>
            {isSaving ? "Saving..." : "Save"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};