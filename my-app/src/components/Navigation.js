import { Routes, Route, Navigate} from 'react-router-dom';
import { RoutePaths } from '../utils/enum';

import Register from '../pages/Register/Register';
import Login from '../pages/Login/Login';
import BookList from '../pages/BookList/BookList';
import Book from '../pages/Book/Book';
import Editbook from '../pages/Book/editbook-folder/Editbook';
import User from '../pages/User/User';
import EditUser from '../pages/User/editUser/editUser';
import Category from '../pages/category/Category';
import EditCategory from '../pages/category/Edit-Category/EditCategory';
import UpdateProfile from '../pages/update-profile/UpdateProfile';

    import Cart from '../pages/Cart/Cart';

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuthContext } from '../context/auth';


function Navigation (){
    const authContext = useAuthContext();
    const redirect = <Navigate to={RoutePaths.Login}/>
    return (
    <>
            <ToastContainer />
            <Routes>

                <Route exact path={RoutePaths.Login} element={<Login />}/>

                <Route 
                    exact
                    path={RoutePaths.Register} 
                    element={<Register />} 
                />

                <Route 
                    exact
                    path={RoutePaths.BookListing} 
                    element={ 
                        authContext.user.id ? <BookList /> : redirect
                    } 
                />

                <Route 
                    exact
                    path={RoutePaths.Book}  
                    element={
                        authContext.user.id ? <Book /> : redirect
                    }
                />

                <Route 
                    exact
                    path={RoutePaths.EditBook}  
                    element={
                        authContext.user.id ? <Editbook /> : redirect
                    }
                />

                <Route 
                    exact
                    path={RoutePaths.AddBook}  
                    element={
                        authContext.user.id ? <Editbook /> : redirect
                    }
                />

                <Route 
                    exact
                    path={RoutePaths.User}  
                    element={
                        authContext.user.id ? <User /> : redirect
                    }
                />

                <Route 
                    exact
                    path={RoutePaths.EditUser}  
                    element={
                        authContext.user.id ? <EditUser /> : redirect
                    }
                />

                <Route 
                    exact
                    path={RoutePaths.Category}  
                    element={
                        authContext.user.id ? <Category /> : redirect
                    }
                />

                <Route 
                    exact
                    path={RoutePaths.EditCategory}  
                    element={
                        authContext.user.id ? <EditCategory /> : redirect
                    }
                />

                <Route 
                    exact
                    path={RoutePaths.AddCategory}  
                    element={
                        authContext.user.id ? <EditCategory /> : redirect
                    }
                />

                <Route 
                    exact
                    path={RoutePaths.UpdateProfile}  
                    element={
                        authContext.user.id ? <UpdateProfile /> : redirect
                    }
                />

                <Route 
                    exact
                    path={RoutePaths.Cart} 
                    element={
                        // authContext.user.id ? 
                        <Cart /> 
                        // : redirect
                    }
                />
            </Routes>

    </>
    )
}

export default Navigation;