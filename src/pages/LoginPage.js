import React, {Component} from 'react';
import Grid from "@material-ui/core/Grid";
import logo from "../images/logo_b.png";
import LoginComponent from "../components/LoginComponent/LoginComponent";
import {withRouter} from "react-router-dom";
import {post} from "../model/httpRequests";
import {api, login, url, user} from "../model/constants";
import Cookies from "js-cookie";
import CustomizedSnackbar from "../components/CustomizedSnackbar/CustomizedSnackbar";

class LoginPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: "",
            password: "",
            open: false,
            errorReason: ""
        };
    }

    handleChange = (event) => {
        this.setState({
            [event.target.id]: event.target.value
        })
    };

    handleErrors = (res) => {
        if (!res.ok) {
            throw new Error("Błędne dane logowania");
        }
        return res
    };

    handleSubmit = (event) => {
        event.preventDefault();
        post(url + api + user + login, this.state)
            .then(this.handleErrors)
            .then(response => response.text())
            .then(res => {
                Cookies.set('username', this.state.username);
                Cookies.set('token', res);
                this.props.history.push('/leagues');
            })
            .catch(err => this.showErrorSnackbar(err))
    };

    handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        this.setState({open: false});
    };

    showErrorSnackbar = (reason) => {
        this.setState({errorReason: reason.message, open: true})
    };

    render() {
        return (
            <Grid
                container
                spacing={0}
                direction="column"
                alignItems="center"
                style={{minHeight: '100vh'}}>
                <Grid item xs={12}>
                    <img src={logo} alt="Logo" style={{maxHeight: '10em', marginTop: "2em"}}/>
                    <LoginComponent onTextChange={this.handleChange} onLogin={this.handleSubmit}/>
                </Grid>
                <CustomizedSnackbar variant="error" text={this.state.errorReason} open={this.state.open}
                                    handler={this.handleClose}/>
            </Grid>
        )
    }
}

export default withRouter(LoginPage)
