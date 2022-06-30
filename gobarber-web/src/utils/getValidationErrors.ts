import { ValidationError } from "yup"

interface Errors{
    [key: string]: string
}

export default function getValidationErrors(err: ValidationError): Errors{
    const validationErrors: Errors = {}
    err.inner.forEach(error => {
        // @ts-ignore (ignore the "Type 'undefined' cannot be used as an index type in TS")
        validationErrors[error.path] = error.message;
    });

    return validationErrors; 
}



