import React from "react";

function Alert(props) {
    return (
        <div class="ui negative message">
            <p>
                {props.message}
            </p>
        </div>
    );
}

export default Alert;
