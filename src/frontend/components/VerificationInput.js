// src/frontend/components/VerificationInput.js
import React, { useState, useRef } from 'react';
import '../styles/VerificationInput.css'; // New CSS file for this component

const VerificationInput = ({ onComplete }) => {
    const [otp, setOtp] = useState(new Array(6).fill(""));
    const inputsRef = useRef([]);

    const handleChange = (element, index) => {
        // The check can be more robust by checking the pattern
        if (!/^[0-9]*$/.test(element.value)) return false;

        const newOtp = [...otp];
        newOtp[index] = element.value;
        setOtp(newOtp);
        
        // Join the array and pass it to the parent
        onComplete(newOtp.join(""));

        // Focus next input
        if (element.value && element.nextSibling) {
            element.nextSibling.focus();
        }
    };

    const handleKeyDown = (e, index) => {
        // If the user hits backspace
        if (e.key === "Backspace") {
            // If the current input has a value, it will be cleared by the default browser action.
            // If the current input is already empty, then we move focus to the previous sibling.
            if (!otp[index] && e.target.previousSibling) {
                e.target.previousSibling.focus();
            }
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
                        // --- CHANGES FOR BETTER MOBILE UX ---
                        type="tel"          // Use "tel" to bring up a numeric-style keypad
                        inputMode="numeric"   // The most modern and direct way to request a numeric keypad
                        pattern="[0-9]*"    // Helps ensure only numbers are entered
                        // --- END OF CHANGES ---
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