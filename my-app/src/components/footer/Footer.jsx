import React from "react";
import './Footer.css';
import { addIcon } from "../../assets";

function Footer() {
    return(
        <>
            <div className="f-container">
                <div className="f-wrapper">

                <img 
                    src={addIcon} 
                    className="f-tt-logo" 
                    alt="TatvaSoft logo" 
                />
                

                <p className="txt-92 ff-r f-copy-rights"> © 2015 Tatvasoft.com. All rights reserved. </p>

                </div>
            </div>
        </>
    );
}

export default Footer;