import React, { useEffect, useState } from "react";
import { collection, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "../../backend/firebase";
import { FiTrash } from "react-icons/fi";
import { Button, message } from "antd";
import { Switch } from "@mui/material";
import axios from "axios";

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersCollection = collection(db, "users");
        const userSnapshot = await getDocs(usersCollection);
        const userList = userSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setUsers(userList);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  const handleDeleteUser = async (id: string) => {
    try {
      // Call the backend API to delete the user
      await axios.delete(`http://localhost:5000/api/auth/users/${id}`);
  
      // Remove the deleted user from state
      setUsers(users.filter((user) => user.id !== id));
  
      message.success("User deleted successfully");
    } catch (error) {
      console.error("Error deleting user:", error);
      message.error("Failed to delete user");
    }
  };
  
  // const handleRoleToggle = async (id: string, isAdmin: boolean) => {
  //   try {
  //     const userDoc = doc(db, "users", id);
  //     const newRole = isAdmin ? "admin" : "user";

  //     await updateDoc(userDoc, { role: newRole });

  //     setUsers(users.map((user) =>
  //       user.id === id ? { ...user, role: newRole } : user
  //     ));

  //     message.success(`User role updated to ${newRole}`);
  //   } catch (error) {
  //     console.error("Error updating user role:", error);
  //     message.error("Failed to update user role");
  //   }
  // };
  const handleRoleToggle = async (id: string, email: string, isAdmin: boolean) => {
    const newRole = isAdmin ? "admin" : "user";
    const prevUsers = [...users]; // Store previous state in case of rollback

    try {
      // Optimistically update UI
      setUsers(users.map(user => (user.id === id ? { ...user, role: newRole } : user)));

      const endpoint = isAdmin
        ? "http://localhost:5000/api/auth/make-admin"
        : "http://localhost:5000/api/auth/remove-admin"; // New API for demotion

      const response = await fetch(endpoint, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) throw new Error("Failed to update user role");

      const data = await response.json();

      const userDoc = doc(db, "users", id);
      // const newRole = isAdmin ? "admin" : "user";

      await updateDoc(userDoc, { role: newRole });

      setUsers(users.map((user) =>
        user.id === id ? { ...user, role: newRole } : user
      ));

      message.success(`User role updated to ${data.user.role}`);

    } catch (error) {
      console.error("Error updating user role:", error);
      message.error("Failed to update user role");

      // Rollback UI if API call fails
      setUsers(prevUsers);
    }
  };


  return (
    <div>
      <h2 className="text-2xl font-bold text-blue-400 mb-6">User Details</h2>
      {users.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <table className="user-table w-full">
          <thead className="bg-blue-900/10">
            <tr>
              <th className="px-4 py-3 text-left">Full Name</th>
              <th className="px-4 py-3 text-left">Email Address</th>
              <th className="px-4 py-3 text-left">Role</th>
              <th className="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-blue-900/5 transition-colors">
                <td className="px-4 py-3">{user.fullName}</td>
                <td className="px-4 py-3">{user.email}</td>
                <td className="px-4 py-3">{user.role || "user"}</td>
                <td className="px-4 py-3 flex gap-2">
                  <Switch
                    checked={user.role === "admin"}
                    onChange={(e) => handleRoleToggle(user.id, user.email, e.target.checked)}
                    color="primary"
                  />
                  <Button danger icon={<FiTrash />} onClick={() => handleDeleteUser(user.id)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default UserManagement;
