const yup = require('yup');

function addArtistValidation(data) {
    const schema = yup.object().shape({
        name: yup.string().required(),
        country: yup.string().required(),
    });
    schema.validateSync(data);
}

function validate(validation) {
    return (req, res, next) => {
        try {
            validation(req.body);

            next();
        } catch (error) {
            next(new ValidationError(error));
        }
    };
}

class ValidationError extends Error {
    constructor(error) {
        super(error.message);

        this.name = 'ValidationError';
        this.status = 400;
        this.path = error.path;
    }

    toJson() {
        return {
            name: this.name,
            status: this.status,
            message: this.message,
            path: this.path,
        };
    }
}

module.exports = {
    validate,
    addArtistValidation,
};