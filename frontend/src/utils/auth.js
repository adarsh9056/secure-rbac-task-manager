export const isTokenExpired = (token) => {
  if (!token) return true;
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    if (!payload.exp) return true;
    return payload.exp * 1000 <= Date.now();
  } catch (error) {
    return true;
  }
};

export const clearSession = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};
