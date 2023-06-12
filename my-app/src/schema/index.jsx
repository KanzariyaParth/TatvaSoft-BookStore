import * as Yup from "yup";

export const signUpSchema = Yup.object().shape(
  {
    firstName: Yup.string()
      .min(2)
      .max(25)
      .required("This is a required field"),

    lastName: Yup.string()
      .min(2)
      .max(25)
      .required("This is a required field"),

    email: Yup.string()
      .email()
      .required("This is a required field"),
    
    password: Yup.string()
      .min(5)
      .max(15)
      .required("Password is a required field"),
    
    confirm_password: Yup.string()
      .required('Confirm Password is a required field')
      .oneOf([Yup.ref('password'), null], "Password must match"),

    roleId: Yup.string().required("Role is required"),
  }
);

//     "firstName": "testiinggg",
//     "lastName": "test",
//     "email": "testingguser@gmail.com",
//     "roleId": 2,
//     "password": "tests"


export const loginSchema = Yup.object().shape(
  {
    email: Yup.string()
    .email()
    .required("This is a required field"),

    password: Yup.string()
      .min(5)
      .max(15)
      .required("Password is a required field"),
  }
)

// "email": "bruce@wayne.com",
// "password":"12345asdasdasd"


export const editCategoryValidation = Yup.object().shape(
  {
    name: Yup.string().required("Category Name is required"),
  }
)

// "name": "horrer"


export const editUserSchema = Yup.object().shape(
    {
        email: Yup.string()
            .email("Invalid email address format")
            .required("Email is required"),
        firstName: Yup.string()
            .required("First Name is required"),
        lastName: Yup.string()
            .required("Last Name is required"),
        roleId: Yup.number()
            .required("Role is required"),
    }
)

//     "firstName": "testiinggg",
//     "lastName": "test",
//     "email": "testingguser@gmail.com",
//     "roleId": 2


export const editBookSchema = Yup.object().shape(
    {
        name: Yup.string()
            .required("Book Name is required"),
        description: Yup.string()
            .required("Description is required"),
        categoryId: Yup.number()
            .min(1, "Category is required")
            .required("Category is required"),
        price: Yup.number()
            .required("Price is required"),
        base64image: Yup.string()
            .required("Image is required"),
    }
)

// "name": "",
// "price": "",
// "categoryId": 0,
// "description": "",
// "base64image": "",



//--------------------------------------------------------st in th UpdateProfile.jsx

// export const updateProfileSchema = Yup.object().shape(
//   {
//     email: Yup.string()
//       .email("Invalid email address format")
//       .required("Email is required"),
//     firstName: Yup.string()
//       .required("First Name is required"),
//     lastName: Yup.string()
//       .required("Last Name is required"),
//     newPassword: Yup.string()
//       .min(5, "Minimum 5 charactor is required"),
//     confirmPassword: 
//     updatePassword ? Yup.string()
//           .required("Must required")
//           .oneOf([Yup.ref("newPassword")], "Passwords is not match")
//       : Yup.string().oneOf([Yup.ref("newPassword")], "Passwords is not match"),
//   }
// )

//--------------------------------------------------------nd in th UpdateProfile.jsx