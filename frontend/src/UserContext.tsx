// This file is used for storing user context (username, email, individual rankings) that can be accessed from anywhere in the project
import React, { createContext, useState, useContext, ReactNode } from 'react';

interface Score {
    id: number;
    score: number;
}

interface User {
    id: string;
    username: string;
    email: string;
    gameScores: Score[];
    movieScores: Score[];
    songScores: Score[];
}

interface UserContextType {
    user: User | null;
    setUser: (user: User | null) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({children} : {children: ReactNode}) {
    const [user, setUser] = useState<User | null>(null);

    return (
        // makes all props here available to all children (pretty cool)
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
}

export function useUser() {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error('useUser must be used within UserProvider'); // required to access global state
    }
    return context;
}


