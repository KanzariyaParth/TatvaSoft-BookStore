export const StatusCode = {
    Success: 200,
    BadRequest: 400,
    Unauthorized: 401,
    Forbidden: 403,
    Conflict: 409,
    InternalServer: 500,
};

export const defaultFilter = {
    pageIndex: 1,
    pageSize: 10,
    keyword: "",
};

export const RecordsPerPage = [5, 10, 20, 50, 100]