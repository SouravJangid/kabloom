import React from 'react';
import '../assets/stylesheets/header.css';
import shopDemoImage from '../assets/images/shopdemo.png';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';

const styles = (props) => ({
    root: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        height: '700px',
        widht: '100%',
        justifyContent: 'center',
        
    }
});








const HeaderContainer = () => {
    const [tabValue, setTabValue] = React.useState(0);
    const [menuOpen, setMenuOpen] = React.useState(false);
    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };
    const handleLogoClick = () => {
        console.log('logo clicked');
    };
    const tabItems = [
        {  label: "Test 1", value: 0 },
        {  label: "Test 2", value: 1 },
        {  label: "Test 3", value: 2 }
    ];

    const handleMenuOpen = (newValue, event ) => {
        const { currentTarget } = event;
        setTabValue(newValue);
        setMenuOpen(true);
        setAnchorEl(currentTarget);
        console.log(tabValue, menuOpen, anchorEl);
        // const { currentTarget } = event;
        // this.setState({
        //   open: true,
        //   anchorEl: currentTarget,
        //   value: index
        // });
      };
    const handleMenuClose = () => {
        setMenuOpen(false);
    }
    const handleMenuRemainOpen = () => {

    }
    return (
        <>
            <React.Fragment>
                <div style={{ height: 100, backgroundColor: 'white', display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                    
                        <img src={shopDemoImage} alt="logo" style={{ height: 80, paddingLeft: '2%', cursor: 'pointer'}} onClick={handleLogoClick}/>
                        <div style={{ display: 'flex', flexDirection: 'column', width: '100%', paddingLeft: '1%', paddingRight: '2%'}}>
                            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                                <div style={{ color: 'black'}}> deliver</div>
                                <div className='spacer'/>
                                <button className="dropbtn">Account <i className="fa fa-caret-down"></i></button>
                                <div style={{ color: 'black', paddingLeft: 10}}>cart icon</div>
                            </div>
                            <hr style={{ backgroundColor: 'grey', width: '100%'}}></hr>
                            <div>
                                <div onMouseLeave={handleMenuClose}>
                                    <Tabs
                                        value={tabValue}
                                        indicatorColor="primary"
                                        textColor="primary"
                                        // onChange={handleTabChange}
                                        // aria-label="disabled tabs example"
                                    >
                                        {/* <Tab label="Active" />
                                        <Tab label="Disabled" />
                                        <Tab label="Active" /> */}
                                        {tabItems.map((item, index) => (
                                            <Tab
                                            key={index}
                                            onMouseEnter={handleMenuOpen.bind(this, item.value)}
                                            
                                            data-key={index}
                                            label={item.label}
                                            value={item.value}
                                            aria-owns={menuOpen ? "menu-list-grow" : undefined}
                                            aria-haspopup={"true"}
                                            />
                                        ))}
                                    </Tabs>
                                    <Popper open={menuOpen} anchorEl={anchorEl} id="menu-list-grow" style={{ width: '95%'}}>
                                        
                                            <Paper style={{ width: "95%" }}>
                                                {/* <MenuList>
                                                {subItems.map((item, index) => (
                                                    <MenuItem key={index} onClick={this.handleMenuClose}>
                                                    {item}
                                                    </MenuItem>
                                                ))}
                                                </MenuList> */}
                                                <div> check1</div>
                                                <div> check1</div>
                                                <div> check1</div>

                                            </Paper>
                                        
                                        
                                    </Popper>
                                </div>
                                
                            </div>
                            
                        </div>
                    
                    
                </div>
            </React.Fragment>
            
            
        </>
    );
};

export default HeaderContainer;