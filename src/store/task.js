import { createSlice } from "@reduxjs/toolkit";
import todosService from "../services/todos.service";
import { setError } from "./errors";
const initialState = { entities: [], isLoading: true };

const taskSlice = createSlice({
  name: "task",
  initialState,
  reducers: {
    recived(state, action) {
      state.entities = action.payload;
      state.isLoading = false;
    },
    update(state, action) {
      const elementIndex = state.entities.findIndex(
        (el) => el.id === action.payload.id
      );
      state.entities[elementIndex] = {
        ...state.entities[elementIndex],
        ...action.payload,
      };
    },
    remove(state, action) {
      state.entities = state.entities.filter(
        (el) => el.id !== action.payload.id
      );
    },
    taskRequested(state) {
      state.isLoading = true;
    },
    taskRequestFailed(state, action) {
      state.isLoading = false;
    },
    taskCreated(state, action) {
      console.log(action);
      state.entities.push(action.payload);
    },
  },
});
const { actions, reducer: taskReducer } = taskSlice;
const {
  update,
  remove,
  recived,
  taskRequested,
  taskRequestFailed,
  taskCreated,
} = actions;

export const loadTasks = () => async (dispatch) => {
  dispatch(taskRequested());
  try {
    const data = await todosService.fetch();
    dispatch(recived(data));
  } catch (error) {
    dispatch(taskRequestFailed(error.message));
    dispatch(setError(error.message));
  }
};

export const completeTask = (id) => (dispatch, getState) => {
  dispatch(update({ id, completed: true }));
};
export function titleChanged(id) {
  return update({ id, title: `New title for ${id}` });
}
export function taskDeleted(id) {
  return remove({ id });
}
export const newTaskCreated = () => async (dispatch, getState) => {
  const task = {
    title: Math.round(Math.random() * 100).toString() + " task",
    completed: false,
  };
  try {
    const content = await todosService.post(task);
    dispatch(taskCreated(content));
  } catch (error) {
    console.log(error.message);
  }
};

export const getTasks = (s) => {
  return function (state) {
    return state.tasks.entities;
  };
};

export const getTasksLoadingStatus = () => (state) => state.tasks.isLoading;

export default taskReducer;
