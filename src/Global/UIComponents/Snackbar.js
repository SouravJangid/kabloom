import React, { useState, useEffect } from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import showMessage from '../../Redux/Actions/toastAction';

// const CommonSnackbarComponent = (props) => {
//     const [open, setOpen] = useState(false);
//     const handleClose = () => {
//         setOpen(false);
//     }
//     console.log('functional component called', open);
//     useEffect( () => {
//         console.log('called did mount', props.message);
//         setOpen(true);
//     }, []);
//     return (
//         <div>
//             <Snackbar
//                 anchorOrigin={{
//                     vertical: 'bottom',
//                     horizontal: 'right',
//                 }}
//                 open={open}
//                 autoHideDuration={6000}
//                 onClose={handleClose}
//                 ContentProps={{
//                     'aria-describedby': 'message-id',
//                     classes: {
//                     root: props.message.isSuccess ? props.classes.success : props.classes.failure
//                     }
//                 }}
//                 message={<span id="message-id">{props.message.text}</span>}
//             />
//         </div>
//     )
// };

class CommonSnackbarComponent extends React.Component {
    constructor(props) {
        super(props);
        // this.state = {
        //     open: false
        // }
    }

    // componentDidMount(){
    //     console.log('component did mount called');
    //     this.setState({ open: true});
    // };
    // componentDidUpdate(prevProps, prevState) {
    //     if ( this.state.open !== this.props)
    // }

    handleClose = (message) => {
        // this.setState({open: false});
        this.props.dispatch(showMessage({ text: this.props.message.text, isSuccess: this.props.message.isSuccess, isRemove: true }));
    };

    

    render() {
        const { classes } = this.props;
        
        return (
            <div>
                <Snackbar
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'right',
                    }}
                    open={this.props.message.isOpen}
                    autoHideDuration={4000}
                    onClose={() => this.handleClose(this.props.message)}
                    ContentProps={{
                        'aria-describedby': 'message-id',
                        classes: {
                        root: this.props.message.isSuccess ? classes.success : classes.failure
                        }
                    }}
                    message={<span id="message-id">{this.props.message.text}</span>}
                />
            </div>
        )
    }

}

export default CommonSnackbarComponent;