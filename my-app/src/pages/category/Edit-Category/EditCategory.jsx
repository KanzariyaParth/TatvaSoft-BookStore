import React, { useEffect, useState } from 'react';
import './EditCategory.css';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, TextField } from '@mui/material';
import { useFormik } from 'formik';
import categoryService from '../../../service/catagory.service';
import { toast } from 'react-toastify';
import { messages } from '../../../utils/shared';
import { editCategoryValidation } from '../../../schema';

const EditCategory = () => {

    const navigate = useNavigate();

    //-------------------------------------------------------------st getCategoryById

    const { id } = useParams();

    useEffect(() => {
        if (id) getCategoryById();
    }, [id])

    const getCategoryById = () => {
        categoryService
            .getById(Number(id))
            .then((res) => {
                setInitialValueState({
                    id: res.id,
                    name: res.name,
                })
            })
    }

    //-------------------------------------------------------------nd getCategoryById


    //-------------------------------------------------------------st onSubmit

    const onSubmit = (values) => {
        categoryService
            .save(values)
            .then((res) => {
                toast.success(messages.UPDATED_SUCCESS, { theme: 'colored' });
                navigate('/category');
            }) .catch((e) => {
                toast.error(messages.UPDATED_FAIL, { theme: 'colored' });
            })
    };

    //-------------------------------------------------------------nd onSubmit


    //-------------------------------------------------------------st Validation

    const initialValue = {  name: "" }
    const [initialValueState, setInitialValueState] = useState(initialValue);

    const { values, touched, errors, handleBlur, handleChange, handleSubmit} = useFormik({
        initialValues: initialValueState,
        enableReinitialize: true,
        validationSchema: editCategoryValidation,
        onSubmit: onSubmit
    });

    //-------------------------------------------------------------nd Validation

    return (
        <>

        <div className="edit-category-container-center">
            <h1 
            className="ff-r txt-41"
            > 
            {id ? 'Edit' : 'Add'} Category 
            </h1>
                
            <hr />
        </div>

        <div className="edit-category-container-main">
            <div className="edit-category-frm-container">
                <form onSubmit={ handleSubmit }>
                    <div className="edit-category-txt-field-1">
                        <TextField
                        id="standard-basic"  
                        label="Category *" 
                        variant="standard"

                        name="name" 
                        value={ values.name }
                        onChange={ handleChange }
                        onBlur={ handleBlur }
                        />
                        {<p className="edit-category-err-msg"> {touched.name && errors.name} </p>}
                    </div>
                    <div className="edit-category-save-cancel-btn">
                        <Button
                            type='submit'
                            variant='contained'
                            style={{ marginLeft: '20px', marginTop: '20px', width: '9%' }}
                            className='uni-save-btn edit-category-custom-save'
                        >
                            Save
                        </Button>
                    
                        <Button 
                            variant='contained'
                            style={{ marginLeft: '20px', marginTop: '20px', width: '9%' }}
                            className='uni-delete-btn edit-category-custom-delete'
                            onClick={() => {
                                navigate('/category');
                            }}
                        >
                        cancel
                        </Button>
                    </div>
                </form>
            </div>
        </div>
        
        </>
    )
}

export default EditCategory
