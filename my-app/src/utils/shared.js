import cartService from "../service/cart.service";
import { Role, RoutePaths } from "./enum";

export const addtoCart = async (book, id) => {
  return cartService
    .add({
      userId: id,
      bookId: book.id,
      quantity: 1,
    })
    .then((res) => {
      return { error: false, message: "Item added in cart" };
    })
    .catch((e) => {
      if (e.status === 500)
        return { error: true, message: "Item already in the cart" };
      else 
        return { error: true, message: "something went wrong" };
    });
};

export const messages = {
  USER_DELETE: "Are you sure you want to delete this user?",
  UPDATED_SUCCESS: "Record updated successfully",
  UPDATED_FAIL: "Record cannot be updated",
  DELETE_SUCCESS: "Record deleted successfully",
  DELETE_FAIL: "Record cannot be deleted",
  ORDER_SUCCESS: "Your order is successfully placed",
};

export const LocalStorageKeys = {
  USER: "user",
};

export const NavigationItems = [
  {
    name: "Users",
    route: RoutePaths.User,
    access: [Role.Admin ]
      // , Role.Seller], //-----> Temporary
  },
  {
    name: "Categories",
    route: RoutePaths.Category,
    access: [Role.Admin ]
      // , Role.Seller], //-----> Temp
  },
  {
    name: "Books",
    route: RoutePaths.Book,
    access: [Role.Admin, Role.Seller],
  },
  {
    name: "Update Profile",
    route: RoutePaths.UpdateProfile,
    access: [Role.Admin, Role.Buyer, Role.Seller],
  },
];

export const hasAccess = (pathname, user) => {
  const navItem = NavigationItems.find((navItem) =>
    pathname.includes(navItem.route)
  );
  if (navItem) {
    return (
      !navItem.access ||
      !!(navItem.access && navItem.access.includes(user.roleId))
    );
  }
  return true;
};

// eslint-disable-next-line import/no-anonymous-default-export

// const Shared = {
//     hasAccess,
//     LocalStorageKeys,
//     NavigationItems,
// };

// export default Shared;
// export default {
//   hasAccess,
// //   addToCart,
// //   messages,
//   LocalStorageKeys,
//   NavigationItems,
// };
