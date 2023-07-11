import React from "react";
import Avatar from '@mui/material/Avatar'


const NavigationBar = ({username, profilePic}) => {

    return (
        <div className="navigation-bar">
            <Avatar src={profilePic}/>
        </div>
    )
}


export default NavigationBar;