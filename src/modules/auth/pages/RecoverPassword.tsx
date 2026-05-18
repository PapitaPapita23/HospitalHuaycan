/// <reference types="vite/client" />
import RecoverPasswordForm from "../components/RecoverPasswordForm"
import bgImage from "../assets/Login.png";
import type React from "react";

const RecoverPassword: React.FC = () => {
    return (
        <div
            className="flex items-center min-h-screen bg-cover bg-center"
            style={{ backgroundImage: `url(${bgImage})` }}
        >
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-center sm:justify-center md:justify-center lg:justify-start h-full">
                    <div className="w-auto">
                        <RecoverPasswordForm />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default RecoverPassword;