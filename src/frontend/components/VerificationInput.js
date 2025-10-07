// src/frontend/components/VerificationInput.js
import React, { useState, useRef } from 'react';
import '../styles/VerificationInput.css'; // New CSS file for this component

const VerificationInput = ({ onComplete }) => {
    const [otp, setOtp] = useState(new Array(6).fill(""));
    const inputsRef = useRef([]);

    const handleChange = (element, index) => {
        if (isNaN(element.value)) return false; // Only allow numbers

        const newOtp = [...otp];
        newOtp[index] = element.value;
        setOtp(newOtp);
        
        // Join the array and pass it to the parent
        onComplete(newOtp.join(""));

        // Focus next input
        if (element.nextSibling) {
            element.nextSibling.focus();
        }
    };

    const handleKeyDown = (e, index) => {
        // Handle backspace
        if (e.key === "Backspace" && !otp[index] && e.target.previousSibling) {
            e.target.previousSibling.focus();
        }
    };

    const handlePaste = (e) => {
        const value = e.clipboardData.getData("text");
        if (isNaN(value) || value.length !== 6) {
            return;
        }
        const newOtp = value.split("");
        setOtp(newOtp);
        onComplete(newOtp.join(""));
        inputsRef.current[5].focus(); // Focus the last input
    };

    return (
        <div className="otp-input-container" onPaste={handlePaste}>
            {otp.map((data, index) => {
                return (
                    <input
                        className="otp-input"
                        type="text"
                        name="otp"
                        maxLength="1"
                        key={index}
                        value={data}
                        onChange={e => handleChange(e.target, index)}
                        onKeyDown={e => handleKeyDown(e, index)}
                        onFocus={e => e.target.select()}
                        ref={el => (inputsRef.current[index] = el)}
                    />
                );
            })}
        </div>
    );
};

export default VerificationInput;