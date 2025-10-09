import React from 'react';

const styles = (props) => ({
    root: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        height: '700px',
        widht: '100%',
        justifyContent: 'center',
        
    }
})


const NoMatchContainer = () => {
    return (
        <>
            <div className={styles.root}>
                <div> PAGE NOT FOUND</div>
                <div> 404 </div>
            </div>
            
        </>
    );
};

export default NoMatchContainer;