"use client";
// app/components/RegistrationForm.tsx
import React, { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import axios from 'axios';

// Validation schemas for each step
const stepOneSchema = yup.object().shape({
    firstName: yup.string().required('First name is required'),
    lastName: yup.string().required('Last name is required'),
});

const stepTwoSchema = yup.object().shape({
    email: yup.string().email('Invalid email').required('Email is required'),
    password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
});

// Define the data type
type FormData = {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    password: string;


};

const RegistrationForm = () => {
    const [step, setStep] = useState(1);

    const { register, handleSubmit, formState: { errors }, trigger } = useForm<FormData>({
        resolver: yupResolver(step === 1 ? stepOneSchema : stepTwoSchema),
    });

    const onSubmit: SubmitHandler<FormData> = async (data) => {
        if (step === 2) {
            try {
                const response = await axios.post('/api/userregister', data); // Changed API route
                alert('Registration successful!');
                console.log(response.data);
            } catch (error) {
                alert('Error occurred while registering!' + error);
            }
        } else {
            setStep(step + 1);
        }
    };

    const handleNextStep = async () => {
        const result = await trigger();
        if (result) setStep(step + 1);
    };

    return (
        <div className="form-container">
            <h1>Multi-Step Registration Form</h1>
            <form onSubmit={handleSubmit(onSubmit)}>
                {step === 1 && (
                    <div>
                        <div className="form-group">
                            <label>First Name</label>
                            <input type="text" {...register('firstName')} />
                            {errors.firstName && <p className="error-message">{errors.firstName.message}</p>}
                        </div>
                        <div className="form-group">
                            <label>Last Name</label>
                            <input type="text" {...register('lastName')} />
                            {errors.lastName && <p className="error-message">{errors.lastName.message}</p>}
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div>
                        <div className="form-group">
                            <label>Email</label>
                            <input type="email" {...register('email')} />
                            {errors.email && <p className="error-message">{errors.email.message}</p>}
                        </div>
                        <div className="form-group">
                            <label>Password</label>
                            <input type="password" {...register('password')} />
                            {errors.password && <p className="error-message">{errors.password.message}</p>}
                        </div>
                    </div>
                )}

                {step < 2 && <button type="button" onClick={handleNextStep} className="btn">Next</button>}
                {step === 2 && <button type="submit" className="btn">Submit</button>}
            </form>
        </div>
    );
};

export default RegistrationForm;
