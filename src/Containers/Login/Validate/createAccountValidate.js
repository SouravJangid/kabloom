import * as yup from 'yup';
import { setIn } from 'final-form';
import moment from "moment";

var schema = yup.object().shape({
    first_name: yup.string().required('First Name is required.'),
    last_name: yup.string().required('Last Name is required.'),
    // dob: yup.date().typeError('should be a valid date.').test(
    //     "dob",
    //     "age must be over 21",
    //     value => {
    //         return moment().diff(moment(value), 'years') >= 21;
    //     }
    // )
    //     .typeError('should be a valid date.'),
    email: yup.string().required('Email is required.')
        .email('must be in email format'),
    password: yup.string().required('Password is required.')
        .min(8, 'Password is too short - should be 8 chars minimum.'),
    // .matches(/[a-zA-Z]/, 'Password can only contain alphabetic characters.'),
    confirm_password: yup.string().required('Password is required.')
        .oneOf([yup.ref('password'), null], 'Passwords must match'),
    // overAge: yup.bool().required('Please confirm your age.')
    //     .oneOf([true], "Please confirm your age.")
});



// To be passed to React Final Form
const validate = async (values) => {
    try {
        await schema.validate(values, { abortEarly: false });
    } catch (err) {
        const errors = err.inner.reduce((formError, innerError) => {
            return setIn(formError, innerError.path, innerError.message);
        }, {});

        return errors;
    }
};

export default validate;