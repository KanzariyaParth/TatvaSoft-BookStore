import React, { useEffect, useState } from "react";
import './Register.css'
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';


/* st for mui compoent select */
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
/* nd for mui compoent select */


/* st api */
// import axios from "axios"; to test api call with use Effect
import userService from "../../service/user.service";
import authService from "../../service/auth.service";
/* api nd */


/* st validation */
import { useFormik } from "formik";
import { signUpSchema } from "../../schema";
/* nd validation */


/* st toast, navigate */
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
/* nd toast, navigate */


/* st breadcrump */
import { Typography, Breadcrumbs } from "@mui/material";
import { Link } from "react-router-dom";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
/* nd breadcrump */


/* st Register Component */
function Register()
{

    const breadcrumbs = [
        <Link underline="hover" to={'/'} key="1" color="inherit" href="/">
          Home
        </Link>,
    
        <Typography key="2" color={{ color: "#f14d54" }}>
          Create an Account
        </Typography>,
    
      ];

    const navigate = useNavigate();

    /* st */

    const initialValues = {
        firstName: '',
        lastName: '',
        email: '',
        roleId: '',
        password: '',
        confirm_password: '',
    }

    const onSubmit = (data) => {
        delete data.confirm_password;
        alert(JSON.stringify(data))
        authService
            .create(data)
            .then((res) => {
                navigate('/login');
                toast.success("Succesfully Registered...", { theme: 'colored'});
            })
            .catch((err) => {
                console.log(err)
            });
    };

    const { values, errors, touched, handleBlur, handleChange, handleSubmit } = useFormik({
        initialValues: initialValues,
        validationSchema: signUpSchema,
        onSubmit: onSubmit,
    });
    
    // console.log( errors )    // but gis will

    /* nd */

    /* api st */

    const[roleList, setRoleList] = useState([]);

    const getRoles = () => {
        userService.getAllRoles().then((res) => {
            setRoleList(res);
        });
    };

    useEffect(() =>{
        getRoles();
    }, [])

    // useEffect(() => { // for testing api
        // toast.success("Success");
    //     axios.get('https://jsonplaceholder.typicodee.com/posts').then((data)=> {
    //         console.log(data.data)
    //     }).catch((error) => {
    //         console.log(error)
    //     })
    // }, [])

   /* api nd */

    return(
        <>

            <div className="r-breadcrump-center">
                <Breadcrumbs 
                    separator={<NavigateNextIcon fontSize="small" />}
                    aria-label="breadcrumb"
                >
                    {breadcrumbs}
                </Breadcrumbs>
            </div>

            <div className="r-container-center">
                <h1 className="ff-r txt-41">Login or create an account </h1>
                <hr />
            </div>

            <div className="r-personal-reg-info">

                <h2 className="txt-41 ff-r">Personal Information </h2>
                <hr />

                <div className="r-frm-info">
                    <p className="txt-83 ff-r-l"> Please enter the following information to create your account </p>
                </div>

                <div className="r-frm-container">

                    <form onSubmit={ handleSubmit }>

                        <div className='r-2in1-0'>
                            <div className="r-2in1-x-err">
                                <div>
                                    <TextField 
                                        id="standard-basic" 
                                        className="r-1of2-0" 
                                        label="First name*" 
                                        variant="standard"

                                        name="firstName" 
                                        value={ values.firstName }
                                        onChange={ handleChange }
                                        onBlur={ handleBlur }
                                    />
                                </div>
                                <div>
                                    {<p className="r-err-msg"> {/*errors.firstName &&*/ touched.firstName && errors.firstName} </p>}
                                </div>
                            </div>

                            <div className="r-2in1-x-err">
                                <div>
                                    <TextField 
                                        id="standard-basic" 
                                        className='r-2of2-0' 
                                        label="Last name*" 
                                        variant="standard" 

                                        name='lastName'
                                        value={ values.lastName }
                                        onChange={ handleChange }
                                        onBlur={ handleBlur }
                                    /> 
                                </div>
                                <div>
                                    {<p className="r-err-msg"> {/*errors.lastName &&*/touched.lastName && errors.lastName} </p>}
                                </div>
                            </div>
                        </div>

                        <div className="r-2in1-1">
                            <div className="r-2in1-x-err">
                                <div>
                                    <TextField 
                                        id="standard-basic"  
                                        className="r-1of2-1"
                                        label="Email*"
                                        variant="standard"

                                        name="email" 
                                        value={ values.email }
                                        onChange={ handleChange }
                                        onBlur={ handleBlur }
                                    />
                                </div>
                                <div>
                                    {<p className="r-err-msg"> {errors.email} </p>}
                                </div>
                            </div>
                            <div className="r-2in1-x-err">
                                <div>
                                    <FormControl 
                                        variant="standard"  
                                        className="r-2of2-1" sx={{ m: 1, minWidth: 120 }}
                                    >
                                        <InputLabel htmlFor='roleId'> 
                                            Role*
                                        </InputLabel>

                                        <Select  /* st */
                                            name="roleId"
                                            id='roleId'
                                            // label={RoleId}
                                            onChange={ handleChange }
                                            onBlur={ handleBlur } 
                                            values={ values.roleId }
                                        >   
                                            {roleList.length > 0 && roleList.map((role) => (
                                                <MenuItem 
                                                    value={role.id} 
                                                    key = {"name" + role.id}
                                                >
                                                    {role.name}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </div>
                                <div>
                                    {<p className="r-err-msg"> {/*errors.roleId*/ touched.roleId && errors.roleId} </p>}
                                </div>
                            </div>
                        </div>

                        <h2 className="r-linfo txt-41 ff-r"> Login Information </h2>
                        <hr />
                        
                        <div className='r-2in1-2'>
                            <div className="r-2in1-x-err">
                                <div>
                                    <TextField 
                                        id="standard-basic" 
                                        className="r-1of2-2" 
                                        type='password' 
                                        label="Password*" 
                                        variant="standard" 

                                        name="password"
                                        value={ values.password }
                                        onChange={ handleChange }
                                        onBlur={ handleBlur }
                                    />
                                </div>
                                <div>
                                    {<p className="r-err-msg"> {/*errors.password*/ touched.password && errors.password} </p>}
                                </div>
                            </div>

                            <div className="r-2in1-x-err">
                                <div>
                                    <TextField 
                                        id="standard-basic" 
                                        className='r-2of2-2' 
                                        type='password' 
                                        label="Confirm Password*" 
                                        variant="standard" 

                                        name="confirm_password"
                                        values={ values.confirm_password } 
                                        onChange={ handleChange }
                                        onBlur={ handleBlur }
                                    /> 
                                </div>
                                <div>
                                    {<p className="r-err-msg"> {/*errors.confirm_password*/ touched.confirm_password && errors.confirm_password} </p>}
                                </div>
                            </div>
                        </div>
                        
                        <div className="r-submit-btn">
                            <Button 
                                variant="contained" 
                                type="submit"
                                className="bg-f14d54"
                            > 
                                Register 
                            </Button>
                        </div>

                    </form>

                </div>

            </div>

            {/* <Footer /> */}
        </>
    );
}

export default Register;