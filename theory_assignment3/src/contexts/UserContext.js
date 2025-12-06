import React, { createContext, useState, useContext } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState({
    name: 'Alex Johnson',
    email: 'alex.johnson@example.com',
    phone: '+1 234 567 8900',
    birthday: '1995-03-15',
    bio: 'Love celebrating birthdays! 🎉',
    image: 'https://randomuser.me/api/portraits/men/32.jpg',
  });

  const updateUser = (updatedUser) => {
    setUser(prevUser => ({ ...prevUser, ...updatedUser }));
  };

  return (
    <UserContext.Provider value={{ user, updateUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within UserProvider');
  }
  return context;
};