import { signin, signup, getMe as fetchMe } from "./api.js";

export const authorize = (email, password) => signin(email, password);
export const register = (name, email, password) => signup(name, email, password);
export const getMe = (jwt) => fetchMe(jwt);
