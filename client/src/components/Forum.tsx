// import { useState, useEffect } from "react";
// import axios from "axios";
// import { getAuth, onAuthStateChanged } from "firebase/auth";
import UsersPage from "./ViewUsers";

const MainForum = () => {
  return (
    <div style={{ display: "flex", justifyContent: "center" ,alignItems:"center"}}>
      <UsersPage />
    </div>
  );
};

export default MainForum;
