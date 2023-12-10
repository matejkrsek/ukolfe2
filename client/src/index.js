import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import ErrorPage from "./error-page";
import ShoppingLists from "./routes/ShoppingLists";
import DetailedList from "./bricks/DetailedList";

const router = createBrowserRouter([
  {
    element: <ShoppingLists />,
    errorElement: <ErrorPage />,
    path: "/",
    // children: [
    // ],
  },
  {
    element: <DetailedList />,
    errorElement: <ErrorPage />,
    path: "/:id",
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
