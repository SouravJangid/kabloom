import * as yup from 'yup';
import { setIn } from 'final-form';

var schema = yup.object().shape({
	
    retailer: yup.string().required('Retailer is required.'),
    diningTime: yup.string().required('Dining date and time is required'),
       
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