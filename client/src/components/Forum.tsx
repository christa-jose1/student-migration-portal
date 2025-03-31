// import { useState, useEffect } from "react";
// import axios from "axios";
// import { getAuth, onAuthStateChanged } from "firebase/auth";

import Forum from "./AddPost";
import PrivateChat from "./LiveChat";
import UsersPage from "./ViewUsers";

const MainForum = () => {
  return (
    <div style={{ display: "flex", justifyContent: "space-between" }}>
      <UsersPage />
      <Forum />
    </div>
  );
};

export default MainForum;
