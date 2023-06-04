import React, { useEffect, useState } from 'react';
import './Editbook.css';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, FormControl, Input, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import { useFormik } from 'formik';
import categoryService from '../../../service/catagory.service';
import bookService from '../../../service/book.service';
import { toast } from 'react-toastify';
import { messages } from '../../../utils/shared';
import { editBookSchema } from '../../../schema';


const Editbook = () => {

//---------------------------------------------------------------------------------------

    const navigate = useNavigate();
    //-------------------------------------------------------------st onSubmit

    const onSubmit = (values) => {
        console.log(values) // to check the response on onSubmit
        bookService
            .save(values)
            .then((res) => {
                toast.success(
                    values.id ? messages.UPDATED_SUCCESS 
                    : "Record Created Succesfully"
                    , { theme: 'colored' }
                );
                navigate('/book')
            })
            .catch((e) => 
                toast.error(messages.UPDATED_FAIL , { theme: 'colored' })
            )
    }
    

    //-------------------------------------------------------------nd onSubmit


    //-------------------------------------------------------------st Validation

    const initialValues = {
        name: "",
        price: "",
        categoryId: 0,
        description: "",
        base64image: "",
    }

    const [initialValueState, setInitialValueState] = useState(initialValues);

    const { values, errors, touched, handleChange, handleBlur, handleSubmit, setFieldValue, setFieldError } = useFormik({
        initialValues: initialValueState,
        enableReinitialize: true,
        validationSchema: editBookSchema,
        onSubmit: onSubmit
    })

    //-------------------------------------------------------------nd Validation


    //-------------------------------------------------------st get book info 

    const { id } = useParams();  
    const [categories, setCategories] = useState();

    useEffect(() => {
        if (id) {   getBookById();  }
        categoryService.getAll().then((res) => {
            setCategories(res);
        });
    }, [id]);

    const getBookById = () => {
        bookService.getById(Number(id)).then((res) => {
            setInitialValueState({
                id: res.id,
                name: res.name,
                price: res.price,
                categoryId: res.categoryId,
                description: res.description,
                base64image: res.base64image,
            });
        })
    }

    //--------------------------------------------------------nd get book info


    //--------------------------------------------------------------st selected img
    
    const onSelectFile = (e, selectFieldValue, setFieldError) => {
        const files = e.target.files;
        if (files?.length) {
            const fileSelected = e.target.files[0];
            const fileNameArray = fileSelected.name.split(".");
            const extension = fileNameArray.pop();
            if(['png','jpg','jpeg'].includes(extension?.toLowerCase())) {
                if (fileSelected.size > 50000) {
                    toast.error('File size must be less then 50KB' , { theme: 'colored' });
                    return;
                }
                const reader = new FileReader();
                reader.readAsDataURL(fileSelected);
                reader.onload = function () {
                    selectFieldValue("base64image", reader.result);
                };
                reader.onerror = function (error) {
                    throw error;
            };
        } else {
            setFieldValue("base64image", "")
        }
    }
    }

    //--------------------------------------------------------------nd selected img

//---------------------------------------------------------------------------------------

  return (
    <>
      <div className="edit-container-center">
        <h1 
          className="ff-r txt-41"
        > 
          {id ? 'Edit' : 'Add'} Book Page 
        </h1>
              
        <hr />
      </div>

      <div className="edit-main-container">
        <div className="edit-frm-container">
            <form onSubmit={handleSubmit}>
              <div className="edit-frm-2in1">
                <div className="edit-err-container">
                  <TextField 
                    id="standard-basic"  
                    label="Book Name*" 
                    variant="standard"

                    name="name" 
                    value={ values.name }
                    onChange={ handleChange }
                    onBlur={ handleBlur }
                />
                {<p className="edit-err-msg"> {touched.name && errors.name} </p>}
                </div>

                <div className="edit-err-container">
                  <TextField 
                    type='number'
                    id="standard-basic" 
                    label="Book Price*" 
                    variant="standard"

                    name="price" 
                    value={ values.price }
                    onChange={ handleChange }
                    onBlur={ handleBlur }
                  />
                  {<p className="edit-err-msg"> {touched.price && errors.price} </p>}
                </div>
              </div>

              <div className="edit-frm-2in1">
                <div className="edit-err-container">
                   <FormControl 
                        variant="standard"  
                    >
                        <InputLabel htmlFor="select"> 
                            Category *
                        </InputLabel>

                        <Select
                            name="categoryId"
                            id="category"

                            onChange={handleChange}
                            value={values.categoryId}
                        >
                            {categories?.map((rl) => (
                                <MenuItem 
                                    value={rl.id} 
                                    key={"category" + rl.id}
                                >
                                    {rl.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    {<p className="edit-err-msg"> {touched.categoryId && errors.categoryId} </p>}
                </div>

                <div className="edit-err-container">
                  {!values.base64image && (
                    <div className='edit-image-btn'>
                      <label
                        htmlFor="contained-button-file"
                        className="edit-file-upload-btn"
                      >
                        <Input
                          id="contained-button-file"
                          type="file"
                          onBlur={handleBlur}
                          onChange={(e) => {
                            onSelectFile(e, setFieldValue, setFieldError);
                          }}
                        />
                        {/* Button was here  */}
                      </label>
                      {<p className="edit-err-msg"> {touched.base64image && errors.base64image} </p>} 
                    </div>
                  )} 
                  {values.base64image && (
                    <div className="edit-imge-uploaded">
                        <div className="edit-img-container">
                            <em>
                                <img 
                                    src= {values.base64image} 
                                    alt= {values.name} 
                                />
                            </em>
                        </div>
                        <div className="edit-txt-btn">
                            <span
                                onClick={() => {    setFieldValue("base64image", "" );   }}
                                style={{    paddingLeft: '10px'}}
                            >
                                image <b style={{ cursor: 'pointer' }}> x </b>
                            </span>
                    </div>
                    </div>
                  )}
                  {<p className="edit-err-msg"> {touched.base64image && errors.base64image} </p>}
                </div>
              </div>

              <div className="edit-description-wrapper">
                <TextField
                    type='textarea'
                    id="description"
                    name="description"
                    label="Description *"
                    variant="standard"
                    value={values.description}
                    multiline
                    onBlur={handleBlur}
                    onChange={handleChange}
                />
                {<p className="edit-err-msg-des"> {touched.description && errors.description} </p>}
              </div>
                <Button 
                    type='submit'
                    variant='contained'
                    style={{ marginLeft: '20px', marginTop: '50px', width: '9%' }}
                    className='uni-save-btn'
                >
                    Save
                </Button>
              
                <Button 
                    variant='contained'
                    style={{ marginLeft: '20px', marginTop: '50px', width: '9%' }}
                    className='uni-delete-btn'
                    onClick={() => {
                        navigate('/book');
                    }}
                >
                  cancel
                </Button>
            </form>
          </div>
        </div>
    </>
  )
}

export default Editbook;
