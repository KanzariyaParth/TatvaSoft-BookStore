import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from "@mui/material";
import React from "react";

const ConfirmDialog = (props) => {
    const { open, onClose, onConfirm, title, description } = props;
    return (
    <>
        <Dialog
            open={open}
            onClose={() => onClose()}
            className="CD-cancel-popup"
        >
            <DialogTitle >
                {title}
            </DialogTitle>

            <DialogContent>
                <DialogContentText>
                    {description}
                </DialogContentText>
            </DialogContent>

            <DialogActions>
                <Button
                    variant="contained"
                    onClick={() => onClose()}
                    className="uni-delete-btn"
                >
                    Cancel
                </Button>
                <Button
                    variant="contained"
                    onClick={() => onConfirm()}
                    className="uni-save-btn"
                >
                    Ok
                </Button>
            </DialogActions>
        </Dialog>
    </>
  );
};

export default ConfirmDialog;
