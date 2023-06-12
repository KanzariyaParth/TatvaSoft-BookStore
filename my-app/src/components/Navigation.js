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
import { useSelector } from 'react-redux';


function Navigation (){
    const redirect = <Navigate to={RoutePaths.Login}/>
    const user = useSelector((state) => state.auth.user)
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
                    user.id ? <BookList /> : redirect
                } 
            />

            <Route 
                exact
                path={RoutePaths.Book}  
                element={
                    user.id  ? <Book /> : redirect
                }
            />

            <Route 
                exact
                path={RoutePaths.EditBook}  
                element={
                    user.id ? <Editbook /> : redirect
                }
            />

            <Route 
                exact
                path={RoutePaths.AddBook}  
                element={
                    user.id ? <Editbook /> : redirect
                }
            />

            <Route 
                exact
                path={RoutePaths.User}  
                element={
                    user.id ? <User /> : redirect
                }
            />

            <Route 
                exact
                path={RoutePaths.EditUser}  
                element={
                    user.id ? <EditUser /> : redirect
                }
            />

            <Route 
                exact
                path={RoutePaths.Category}  
                element={
                    user.id ? <Category /> : redirect
                }
            />

            <Route 
                exact
                path={RoutePaths.EditCategory}  
                element={
                    user.id ? <EditCategory /> : redirect
                }
            />

            <Route 
                exact
                path={RoutePaths.AddCategory}  
                element={
                    user.id ? <EditCategory /> : redirect
                }
            />

            <Route 
                exact
                path={RoutePaths.UpdateProfile}  
                element={
                    user.id ? <UpdateProfile /> : redirect
                }
            />

            <Route 
                exact
                path={RoutePaths.Cart} 
                element={
                    user.id ? <Cart /> : redirect
                }
            />
        </Routes>
    </>
    )
}

export default Navigation;