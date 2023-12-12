import {Link} from "react-router-dom";
import {useRef, useState} from "react";
import axiosClient from "../axios-client.js";
import {useStateContext} from "../contexts/Provider.jsx";

export default function Login ()
{

    const emailRef = useRef()
    const passwordRef = useRef()
    const {setUser, setToken} = useStateContext()
    const [errors, setErrors] = useState(null);
    const onSubmit = (ev) => {
        ev.preventDefault()

        const ourValues = {
            email: emailRef.current.value.trim(),
            password: passwordRef.current.value.trim(),
        }
        setErrors(null)
        axiosClient.post('/login', ourValues)
            .then(({data}) => {
                setUser(data.user)
                setToken(data.token)
            })
            .catch(err => {
                const response = err.response;
                if (response && response.status === 422) {
                    if (response.data.errors)
                    {
                        console.log('Validation errors:', response.data.errors);
                        setErrors(response.data.errors);
                    }else {
                       setErrors({
                           email: [response.data.message],
                       })
                    }

                }

            })
    }

    return (
        <div className="login-signup-form animated fadeInDown">
            <div className="form">
                <form action="" onSubmit={onSubmit}>
                    <h1 className="title">Login now !</h1>
                    { errors && <div className="alert">
                        {Object.keys(errors).map(key => (
                            <p key={key}>{errors[key][0]}</p>
                        ))}
                    </div>

                    }
                    <input ref={emailRef} type="email" placeholder="Email Address" autoComplete="email"/>
                    <input ref={passwordRef} type="password" placeholder="Password" autoComplete="current-password"/>
                    <button className="btn btn-block">Login</button>
                    <p className="message">Not registered? <Link to="/register">Create an account</Link></p>
                </form>
            </div>
        </div>
    )
}
