export const initialState = () => {
  const savedState = localStorage.getItem("userState");
  return savedState
    ? JSON.parse(savedState)
    : { isAuthenticated: false };
};

export const reducer = (state, action) => {
  if (action.type === "USER") {
    return { isAuthenticated: action.payload };
  }
  return state;
};
