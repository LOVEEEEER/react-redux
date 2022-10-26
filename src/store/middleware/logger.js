export function logger(state) {
  return function wrapDispatch(next) {
    return function handleAction(action) {
      // if (action.type === "task/update") {
      //   dispatch({
      //     type: "task/remove",
      //     payload: { ...action.payload },
      //   });
      //   return;
      // }

      return next(action);
    };
  };
}
