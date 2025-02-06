import {useState, useContext, createContext} from 'react'
const AuthContext = createContext();

export const AuthContextProvider = ({children}) => {
    const [user, setUser] = useState(null);

    const login = (userData) => {
        setUser(userData);
    }

    const logout = () => {
        setUser(null);
    }
    return(
        <AuthContext.Provider value={{user, setUser}}>
            {children}
        </AuthContext.Provider>
    );
    
    
}

export const useAuth = () => {
    return useContext(AuthContext);
  };

export default AuthContextProvider;