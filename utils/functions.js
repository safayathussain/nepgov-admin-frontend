import { store } from "@/redux/store";
import { FetchApi } from "./FetchApi";
import { setAuth } from "@/redux/slices/AuthSlice";
import { useSelector } from "react-redux";

export const useAuth = () => {
  const auth = useSelector((state) => state.auth?.user);
  return {
    auth: auth,
  };
};
export const logout = async () => {
  await FetchApi({ url: "/auth/logout", method: "post" });
  store.dispatch(setAuth({}));
  window.location.href = "/"
};
export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
};


export const isLive = (dateString) => {
  const currentDate = new Date();
  const givenDate = new Date(dateString);
  return givenDate > currentDate;
};
export const formatDateTimeLocal = (date) => {
  if (!date) return ""; // Handle null/undefined values
  const parsedDate = new Date(date);
  if (isNaN(parsedDate.getTime())) return ""; // Handle invalid dates
  return parsedDate.toISOString().slice(0, 16); // Format for input[type="datetime-local"]
};


