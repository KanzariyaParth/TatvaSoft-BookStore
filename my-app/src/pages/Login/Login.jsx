import React, { useEffect } from "react";
import './Login.css';
import { Link, useLocation } from "react-router-dom";
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

/* st breadcrump */
import { Typography, Breadcrumbs } from "@mui/material";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
/* nd breadcrump */

/* st authentication */
import { useFormik } from "formik";
import { loginSchema } from "../../schema";
import { toast } from "react-toastify";
/* nd authentication */

/* st login api */
import authService from "../../service/auth.service";
/* nd login api */

/* st navigate & redux-toolkit */
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../../State/Slice/authSlice";
import { LocalStorageKeys, hasAccess } from "../../utils/shared";
import { RoutePaths } from "../../utils/enum";
/* st navigate & redux-toolkit */

function Login() {

    const navigate = useNavigate();

//================================================================================================================

    const user = useSelector((state) => state.auth.user)
    const dispatch = useDispatch();

    useEffect(() => {
        // const str = JSON.parse(localStorage.getItem(LocalStorageKeys.USER))  ||  initialUserValues;
        const str = JSON.parse(localStorage.getItem(LocalStorageKeys.USER)) || user
        if (str.id) {
            // _setUser(str);
            dispatch(setUser(str));
        }
    }, [])

    const { pathname } = useLocation();

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
    }, [pathname, user]);

//================================================================================================================

    const initialValues = {
        email: "",
        password: "",
    }

    const onSubmit = (data, resetForm) => {

        authService.login(data).then((res) => {
            
            delete res.__v;
            delete res._id;
            dispatch(setUser(res))
                navigate('/');
                toast.success("Successfully Login", { theme: "colored" });
        }).catch((err) => {
            resetForm();
            console.log('inavalid User name and password.')
        })
    }

    const { values, errors, touched, handleChange, handleBlur, handleSubmit, handleReset} = useFormik({
        initialValues: initialValues,
        validationSchema: loginSchema,
        onSubmit: (data) => {
            onSubmit(data, handleReset)
        },
    });
    
    const breadcrumbs = [
        <Link underline="hover" to={'/'} key="1" color="inherit" href="/">
          Home
        </Link>,
    
        <Typography key="2" color={{ color: "#f14d54" }}>
          Login
        </Typography>,
    ];

    return(
        <>

            <div className="l-breadcrump-center">
                <Breadcrumbs 
                    separator={<NavigateNextIcon fontSize="small" />}
                    aria-label="breadcrumb"
                >
                    {breadcrumbs}
                </Breadcrumbs>
            </div>
            
            <div className="l-container-center">
                <h1 className="ff-r txt-41">Login or create an account </h1>
                <hr />
            </div>

            <div className="l-frm-head">

                <div className="l-frm-head-1">

                    <div className="l-new-customer">
                        <h2 className="txt-41 ff-r"> New Customer </h2>
                        <hr />
                    </div>

                    <div className="l-new-info">
                        <p className="txt-83 ff-r-l"> Registration is free and easy. </p>
                    </div>

                    <div className="l-info-lst ff-r txt-21">
                        <ul>
                            <li> Faster checkout </li>
                            <li> Save multiple Shipping address </li>
                            <li> View and track orders and more </li>
                        </ul>
                    </div>

                    <div className="l-login-btn">
                        <Link to='/register'>    
                            <Button 
                                variant="contained" 
                                className="bg-f14d54"
                            > 
                                Create an account
                            </Button>
                        </Link>
                    </div>

                </div>


                <div className="l-frm-head-2">
                    <div className="l-reg-customer">
                        <h2 className="txt-41 ff-r"> Registered Customer </h2>
                        <hr />
                    </div>
                    <div className="l-reg-info">
                        <p className="txt-83 ff-r-l"> If you have an account with us, please log in </p>
                    </div>
                    <div className="l-frm-container">
                        <form onSubmit={ handleSubmit }>
                            <div className="l-err-container-1">
                                <TextField 
                                    id="standard-basic" 
                                    className="l-eml" 
                                    label="Email Address*" 
                                    variant="standard"

                                    name="email" 
                                    value={ values.email }
                                    onChange={ handleChange }
                                    onBlur={ handleBlur }
                                />
                                {<p className="l-err-msg"> {touched.email && errors.email} </p>}
                            </div>

                            <div className="l-err-container-2">
                                <TextField 
                                    id="standard-basic" 
                                    className="l-pwd" 
                                    type="password"
                                    label="Password*" 
                                    variant="standard"

                                    name="password" 
                                    value={ values.passward }
                                    onChange={ handleChange }
                                    onBlur={ handleBlur }
                                />
                                {<p className="l-err-msg"> {touched.password && errors.password} </p>}
                            </div>
                            <div className="l-submit-btn">
                                <Button 
                                    variant="contained" 
                                    type="submit"
                                    className="bg-f14d54"
                                > 
                                    Login
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
    
       </>
    );
}

export default Login;