import { createMuiTheme } from '@material-ui/core/styles';

const theme = createMuiTheme({
   props: {
      // Name of the component
      MuiButtonBase: {
        // The properties to apply
        disableRipple: true // No more ripple, on the whole application!
      }
    },
    
   palette: {
      primary: {
         main: '#E5554F',
      },
      secondary: {
         main: '#009688',
      },
      default: {
         main: '#dc0909'
      },
      background: {
         default: "#fff"
      }
   },
   

  
   typography: {
      fontFamily: "\"Muli_Regular\", \"sans-serif\"",
      fontSize: "1.6rem",
      button: {
         fontSize: "1.6rem",
         textTransform: "capitalize",
         fontWeight: 500,
         fontFamily: "\"Muli_Regular\", \"sans-serif\"",
         color: "rgba(255, 255, 255, 1)"
      }
   },
});

export default theme;