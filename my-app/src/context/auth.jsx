import React, { 
        createContext, 
        useContext, 
        useState, 
        useEffect 
    } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { RoutePaths } from "../utils/enum";
import { hasAccess, LocalStorageKeys } from "../utils/shared";
import { toast } from "react-toastify";




const initialUserValues = {
    email: "",
    firstName: "",
    id: 0,
    lastName: "",
    password: "",
    role: "",
    roleId: 0,
};

const initialState = {
    setUser: () => { },
    user: initialUserValues,
    signOut: () => { },
    // appInitialize: false,
};

export const AuthContext = createContext(initialState);

export const AuthWrapper = ({ children }) => {
    
    const [user,_setUser] = useState(initialUserValues);
    const navigate = useNavigate();
    const { pathname } = useLocation(); 

    const setUser = (user) => {
        // console.log("bruce@wayne2.com", user);
        localStorage.setItem(LocalStorageKeys.USER, JSON.stringify(user));
        _setUser(user);
    }

    const signOut = () => {
        localStorage.removeItem(LocalStorageKeys.USER, JSON.stringify(user));
        _setUser(initialUserValues);
        navigate(`${RoutePaths.Login}`);
    };

    useEffect(() => {
        const str = 
            JSON.parse(localStorage.getItem(LocalStorageKeys.USER))  ||  initialUserValues;
        if (str.id) {
            _setUser(str);
        }
    }, [])

    useEffect(() => {
        if (pathname === RoutePaths.Login && user.id) {
          navigate(RoutePaths.BookListing);
        }
    
        if (!user.id) {
          return;
        }
        
        const access = hasAccess(pathname, user);
        if (!access) {
          toast.warning("Sorry, you are not authorized to access this page" , { theme: 'colored' });
          navigate(RoutePaths.BookListing);
          return;
        }
        // setAppInitialize(true);
      }, [pathname, user]);


    let value = {
        user,
        setUser,
        signOut,
    }

    return <AuthContext.Provider value = {value}> {children} </AuthContext.Provider>
}

export const useAuthContext = () => {
    return useContext(AuthContext)
}