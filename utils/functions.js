import { store } from "@/redux/store";
import { FetchApi } from "./FetchApi";
import { setAuth } from "@/redux/slices/AuthSlice";
import { useSelector } from "react-redux";
import { jwtDecode } from "jwt-decode";

export const useAuth = () => {
  const auth = useSelector((state) => state.auth?.user);
  return {
    auth: auth,
  };
};
export const logout = async () => {
  await FetchApi({ url: "/auth/admin-logout", method: "post" });
  store.dispatch(setAuth({}));
  window.location.href = "/";
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

export const isLive = (start, end) => {
  const currentDate = new Date();
  const startDate = new Date(start);
  const endDate = new Date(end);

  return currentDate >= startDate && currentDate <= endDate;
};
export const getLiveStatus = (start, end) => {
  const currentDate = new Date();
  const startDate = new Date(start);
  const endDate = new Date(end);

  if (currentDate < startDate) {
    return {
      status: "scheduled",
      className: "text-warning",
      label: "Scheduled",
    };
  } else if (currentDate >= startDate && currentDate <= endDate) {
    return { status: "active", className: "text-secondary", label: "Live" };
  } else {
    return { status: "closed", className: "text-success", label: "Ended" };
  }
};

export const formatDateTimeLocal = (date) => {
  if (!date) return ""; // Handle null/undefined values
  const parsedDate = new Date(date);
  if (isNaN(parsedDate.getTime())) return ""; // Handle invalid dates
  return parsedDate.toISOString().slice(0, 16); // Format for input[type="datetime-local"]
};

export const isTokenExpired = (accessToken) => {
  if (!accessToken) return true;

  try {
    const decoded =  jwtDecode(accessToken);
    return !decoded.exp || decoded.exp * 1000 < Date.now();
  } catch (error) {
    return true; // If decoding fails, assume the token is invalid/expired
  }
};
