import * as yup from 'yup';
import { setIn } from 'final-form';

var schema = yup.object().shape({
	// name: yup.string().required('Name is required.'),
	firstname: yup.string().required('First name is required.'),
	lastname:yup.string().required('Last name is required.'),
	// email: yup.string().required('E-mail is required.')
    //     .email('Email must be in e-mail format.'),
    address: yup.string().required('Address is required.'),
    city: yup.string().required('City is required.'),
	// zip: yup.string().required('Zip code is required.'),
	zip: yup.string('Must be a number.')
        .test('len', 'Must be exactly 5 digit', val => val ? val.toString().length === 5 : false)
        .typeError('Zipcode must be a number.')
        .required('Zipcode is required.'),
    state: yup.string().required('State is required.'),
    // addressNickname: yup.string().required('Address nickname is required.'),
	// phone: yup.string().required('Phone is required.') 
	phone: yup.string('Must be a number.')
        .test('len', 'Must be exactly 10 digit', val => val ? val.toString().length === 10 : false)
        .typeError('Phone  must be a number.')
        .required('Phone is required.'),   
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