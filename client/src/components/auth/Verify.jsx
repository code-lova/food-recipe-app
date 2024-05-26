import React, {useState} from "react";
import { Link, useNavigate } from "react-router-dom";
import loginImg from "../../assets/images/photo-1556909114-89e7f2bcbf97e3a5.jpg";
import HomeLogo from "../../layouts/frontend/Home/HomeLogo";
import {toast} from "react-toastify";
import axios from "axios";
import { BASEURL } from "../../utils";

const Verify = () => {

    const navigate = useNavigate();
    const [btnLoading, setBtnLoading] = useState(false);

    const [otpInput, setOtpInput] = useState({
        otp: '',
    });

    const handleInput = (e) => {
        e.persist();
        setOtpInput({...otpInput, [e.target.name]: e.target.value});
    }

    const submitOTP = async(e) => {
        e.preventDefault();
        setBtnLoading(true)
        try{
        
            const data = {
                otp: otpInput.otp
            }

            const response = await axios.post(`${BASEURL}/auth/verify-email`, data);
            if(response.data.status === 200){
                toast.success(response.data.message, {
                    theme: 'colored',
                });
                navigate('/login');

            }else if(response.data.status === 404){
                toast.warning(response.data.message, {
                    theme: 'colored',
                });
            }
            else if(response.data.status === 400){
                toast.error(response.data.message, {
                    theme: 'colored',
                });
            }
        }catch(error){
            console.error("Problem Verifying Code:", error);
            toast.error("Internal Server Error", {
                theme: 'colored',
            });
        }finally{
            setBtnLoading(false);
        }

    }


    return(
        <div>
            <div className="login-wrapper">
                
                <div className="card-parent">

                    <div className="login-card">
                        <HomeLogo />
                        <h3>Enter The OTP verificaton Code</h3>
                        <form onSubmit={submitOTP} className="login-form">

                            <div className="uk-form-group">
                                <label htmlFor="email">OTP Code</label>
                                <input type="text" name="otp" onChange={handleInput} value={otpInput.name} placeholder="Enter otp" className="form-control" />
                            </div>

                            <div className="forgot-password">
                                <p>By signing up you agree to our <Link to="#" className="terms">terms</Link> of services</p>
                            </div>
                            <button type="submit" disabled={btnLoading}>{btnLoading ? 'Verifying please wait...': 'Verify Account'}</button>
                        </form>
                        
                    </div>

                    <div className="login-img">
                        <div className="image-overlay"></div>
                        <img src={loginImg} alt="login-image" loading="lazy" />

                        <div className="overlay-text">
                            <h2 className="spacing-small">Almost There</h2>
                            <p>Just one more step remaining..</p>
                            {/* <Link to="/login" className="login-button-primary">Login</Link> */}
                        </div>
                        
                      
                    </div>

                </div>
            </div>

        </div>


    );

}

export default Verify;
