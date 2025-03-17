import { initializeApp } from "firebase/app";
import { getAuth, sendPasswordResetEmail, User } from "firebase/auth";
import { getFirestore, doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCj9TNB7CCNyH8Z1yPhkjGHHGsApdTY2ik",
  authDomain: "login-auth-c28f7.firebaseapp.com",
  projectId: "login-auth-c28f7",
  storageBucket: "login-auth-c28f7.appspot.com",
  messagingSenderId: "127221860361",
  appId: "1:127221860361:web:860dd040677f472afc90d8",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };

export const resetPassword = async (email: string): Promise<void> => {
  try {
    await sendPasswordResetEmail(auth, email);
    console.log(" Password reset email sent successfully!");
    alert("Password reset email sent. Check your inbox.");
  } catch (error: any) {
    console.error(" Error sending password reset email:", error.message);
    alert("Failed to send password reset email. Please try again.");
  }
};

interface AdditionalUserData {
  fullName: string;
  email: string;
}

export const createUserDocument = async (
  user: User | null,
  additionalData: AdditionalUserData
): Promise<void> => {
  if (!user) return;

  try {
    const userRef = doc(db, "users", user.uid);
    const snapshot = await getDoc(userRef);

    console.log("Checking Firestore for user:", user.uid);

    if (!snapshot.exists()) {
      const { email, uid } = user;
      const { fullName } = additionalData;

      await setDoc(userRef, {
        uid,
        fullName,
        email,
        createdAt: serverTimestamp(),
        lastActive: serverTimestamp(),
        online: true,
      });

      console.log(" User document created:", { uid, fullName, email });
    } else {
      console.log(" User already exists in Firestore.");
    }
  } catch (error) {
    console.error(" Error creating user document:", error);
  }
};