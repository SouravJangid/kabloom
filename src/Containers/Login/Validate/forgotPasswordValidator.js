import * as yup from 'yup';
import { setIn } from 'final-form';

var schema = yup.object().shape({
	// name: yup.string().required('Name is required.'),
	// email: yup.string().required('Email is required.'),
	email: yup.string().required('Email is required.')
        .email('must be in email format')
    
    
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