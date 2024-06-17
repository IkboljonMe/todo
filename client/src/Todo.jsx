import React, { useState } from "react";

export default function Todo(props) {
  const { todo, setTodos } = props;
  const [confirmDelete, setConfirmDelete] = useState(false);

  const updateTodo = async (todoId, todoStatus) => {
    const res = await fetch(`/api/todos/${todoId}`, {
      method: "PUT",
      body: JSON.stringify({ status: todoStatus }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const json = await res.json();
    if (json.acknowledged) {
      setTodos((currentTodos) => {
        return currentTodos.map((currentTodo) => {
          if (currentTodo._id === todoId) {
            return { ...currentTodo, status: !currentTodo.status };
          }
          return currentTodo;
        });
      });
    }
  };

  const deleteTodo = async (todoId) => {
    // Display confirmation dialog
    setConfirmDelete(true);
  };

  const handleDeleteConfirm = async (todoId) => {
    const res = await fetch(`/api/todos/${todoId}`, {
      method: "DELETE",
    });
    const json = await res.json();
    if (json.acknowledged) {
      setTodos((currentTodos) => {
        return currentTodos.filter((currentTodo) => currentTodo._id !== todoId);
      });
    }
    // Close confirmation dialog
    setConfirmDelete(false);
  };

  const handleDeleteCancel = () => {
    // Close confirmation dialog
    setConfirmDelete(false);
  };

  return (
    <div className="todo">
      <p>{todo.todo}</p>
      <div className="mutations">
        <button
          className="todo__status"
          onClick={() => updateTodo(todo._id, todo.status)}
        >
          {todo.status ? "☑" : "☐"}
        </button>
        <button className="todo__delete" onClick={() => deleteTodo(todo._id)}>
          🗑️
        </button>
      </div>
      {confirmDelete && (
        <div className="confirmation">
          <p>Are you sure you want to delete this todo?</p>
          <div className="confirmation__buttons">
            <button onClick={() => handleDeleteConfirm(todo._id)}>Yes</button>
            <button onClick={handleDeleteCancel}>No</button>
          </div>
        </div>
      )}
    </div>
  );
}
