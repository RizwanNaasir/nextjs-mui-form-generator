import {Typography} from "@mui/material";
import React from "react";

export const NotFound = ({message = "No forms found"}) => {
    return (
        <>
            <img
                src="/static/images/placeholders/illustrations/empty.png"
                alt="No Results"
                style={{
                    maxHeight: 200,
                    display: 'block',
                    marginLeft: 'auto',
                    marginRight: 'auto',
                    marginTop: 50,
                    marginBottom: 50,
                }}
            />
            <Typography variant="h3" align="center" paragraph>
                {message}
            </Typography>
        </>
    );
};
