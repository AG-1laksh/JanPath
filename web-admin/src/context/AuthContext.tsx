"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import type { User } from "firebase/auth";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

type UserProfile = {
  uid: string;
  name?: string;
  email?: string;
  role?: "ADMIN" | "WORKER" | "USER" | "WORKER_PENDING" | string;
  department?: string | null;
};

type AuthContextValue = {
  user: User | null;
  profile: UserProfile | null;
  role: UserProfile["role"] | null;
  loading: boolean;
  signOutUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth || !db) {
      setLoading(false);
      return;
    }

    const firestore = db;

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (!currentUser) {
        setProfile(null);
        setLoading(false);
        return;
      }

      try {
        const userRef = doc(firestore, "users", currentUser.uid);
        const userSnap = await getDoc(userRef);
        if (!userSnap.exists()) {
          const displayName = currentUser.displayName || currentUser.email?.split("@")[0] || "User";
          const email = currentUser.email || "";
          await setDoc(userRef, {
            name: displayName,
            email,
            role: "USER",
            department: null,
            createdAt: serverTimestamp(),
          });
          setProfile({ uid: currentUser.uid, name: displayName, email, role: "USER" });
        } else {
          const data = userSnap.data() as Omit<UserProfile, "uid">;
          setProfile({ uid: currentUser.uid, ...data });
        }
      } catch {
        setProfile({ uid: currentUser.uid, name: currentUser.displayName || "User", email: currentUser.email || "" });
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      profile,
      role: profile?.role ?? null,
      loading,
      signOutUser: async () => {
        if (auth) {
          await signOut(auth);
        }
      },
    }),
    [user, profile, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}
