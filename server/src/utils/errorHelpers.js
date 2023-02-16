exports.getErrorMessage = (error) => {
    let errorMessage = error.message;
    
    if (error.errors) {
        errorMessage = Object.values(error.errors)[0].message;
    }
    return errorMessage;
}
