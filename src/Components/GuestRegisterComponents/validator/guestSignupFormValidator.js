import * as yup from 'yup';
import { setIn } from 'final-form';
import moment from 'moment';

var schema = yup.object().shape({
    firstName: yup.string().required('First Name is required.'),
    lastName: yup.string().required('Last Name is required.'),
    email: yup.string().required('Email is required.')
        .email('must be in email format'),
    password: yup.string().required('Password is required.') 
        .min(8, 'Password is too short - should be 8 chars minimum.'),
        // .matches(/[a-zA-Z]/, 'Password can only contain alphabetic characters.'),
    confirmPassword: yup.string().required('Password is required.')
        .oneOf([yup.ref('password'), null], 'Passwords must match'),
    // dob: yup.date().required('Date of birth is required.')
    // .typeError('should be a valid date.'),
    // gender: yup.string().required('Gender is required.'),
    // country: yup.string().required('Country is required.'),
    // dob: yup.date().typeError('should be a valid date.').test(
    //     "dob",
    //     "age must be over 21",
    //     value => {
    //       return moment().diff(moment(value),'years') >= 21;
    //     }
    //   )
    
});



// To be passed to React Final Form
const validate = async ( values ) => {
	try {
		await schema.validate( values, { abortEarly: false } );
	} catch ( err ) {
		const errors = err.inner.reduce( ( formError, innerError ) => {
			return setIn( formError, innerError.path, innerError.message );
		}, {} );

		return errors;
	}
};

export default validate;