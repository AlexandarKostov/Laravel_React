import {Link} from "react-router-dom";
import {useRef, useState} from "react";
import axiosClient from "../axios-client.js";
import {useStateContext} from "../contexts/Provider.jsx";

export default function Register ()
{

    const nameRef = useRef()
    const emailRef = useRef()
    const passwordRef = useRef()
    const passwordConfirmationRef = useRef()
    const {setUser, setToken} = useStateContext()
    const [errors, setErrors] = useState(null);
    const onSubmit = (ev) =>{
        ev.preventDefault();

        const ourValues = {
            name: nameRef.current.value.trim(),
            email: emailRef.current.value.trim(),
            password: passwordRef.current.value.trim(),
            password_confirmation: passwordConfirmationRef.current.value.trim(),
        }


        console.log(ourValues)
        axiosClient.post('/register', ourValues)
            .then(({data}) => {
                setUser(data.user)
                setToken(data.token)
            })
            .catch(err => {
                const response = err.response;
                if (response && response.status === 422) {
                    console.log('Validation errors:', response.data.errors);
                    setErrors(response.data.errors);
                }

            })
    }


    return (
        <div className="login-signup-form animated fadeInDown">
            <div className="form">
                <form onSubmit={onSubmit}>
                    <h1 className="title">Register your account</h1>
                    { errors && <div className="alert">
                        {Object.keys(errors).map(key => (
                            <p key={key}>{errors[key][0]}</p>
                        ))}
                    </div>

                    }
                    <input ref={nameRef} type="text" placeholder="Full Name" autoComplete="name"/>
                    <input ref={emailRef} type="email" placeholder="Email Address" autoComplete="email"/>
                    <input ref={passwordRef} type="password" placeholder="Password" autoComplete="current-password"/>
                    <input ref={passwordConfirmationRef} type="password" placeholder="Repeat Password" autoComplete="current-password"/>
                    <button className="btn btn-block">Register</button>
                    <p className="message">Already registered ? <Link to="/login">Login</Link></p>
                </form>
            </div>
        </div>
    )
}
