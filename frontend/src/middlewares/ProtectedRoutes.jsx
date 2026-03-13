import React from "react";

function ProtectedRoutes({ children }) {


  const accessToken = localStorage
  return <>{children}</>;
}

export default ProtectedRoutes;
