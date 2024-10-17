import React, { createContext, useContext, useState } from "react";

// Create the context
const RequestContext = createContext();

// Create a provider component
export const RequestProvider = ({ children }) => {
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState([]);
  const [imageUrl, setImageUrl] = useState(null);
  const [categories, setCategories] = useState([
    "Category 1",
    "Category 2",
    "Category 3",
  ]); // Example categories
  const [severity, setSeverity] = useState("Low"); // Default severity
  const [urgency, setUrgency] = useState("Low"); // Default urgency

  return (
    <RequestContext.Provider
      value={{
        description,
        setDescription,
        location,
        setLocation,
        categories,
        severity,
        setSeverity,
        urgency,
        setUrgency,
        setCategories,
        imageUrl,
        setImageUrl
      }}
    >
      {children}
    </RequestContext.Provider>
  );
};

// Create a custom hook to use the context
export const useRequest = () => {
  return useContext(RequestContext);
};
