import React from "react";
import { IName, IOnChange, ISubmitButton } from "../../../types/Form";

const validateField = (fieldRegex, value, setState, setValid) => {
    setState(value);

    if (!fieldRegex.test(value)) {
        setValid(false);
    } else {
        setValid(true);
    }
};

const NameField: React.FC<IName> = (nameInfos) => {
    return (
        <div className="relative">
            <input
                autoComplete="on"
                id={nameInfos.nameType}
                name={nameInfos.nameType}
                placeholder={nameInfos.labelValue}
                type="text"
                className="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:borer-rose-600"
                value={nameInfos.state}
                onChange={(e) => nameInfos.setState(e.target.value)}
                required
            />
            <label
                htmlFor={nameInfos.nameType}
                className="absolute left-0 -top-3.5 text-gray-900 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-900 peer-focus:text-sm"
            >
                {nameInfos.labelValue}
            </label>
        </div>
    );
};

const EmailField: React.FC<IOnChange> = ({
    state,
    setState,
    isFieldValid,
    setIsFieldValid,
}) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return (
        <div className="relative">
            <input
                autoComplete="on"
                id="email"
                name="email"
                type="text"
                className={`peer placeholder-transparent h-10 w-full border-b-2 focus:outline-none ${
                    isFieldValid
                        ? "border-gray-300"
                        : "border-red-600 text-red-600"
                }`}
                placeholder="Email address"
                value={state}
                onChange={(e) =>
                    validateField(
                        emailRegex,
                        e.target.value,
                        setState,
                        setIsFieldValid
                    )
                }
                required
            />
            <label
                htmlFor="email"
                className="absolute left-0 -top-3.5 text-gray-900 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-900 peer-focus:text-sm"
            >
                Addresse email
            </label>
        </div>
    );
};

const PasswordField: React.FC<IOnChange> = ({
    state,
    setState,
    isFieldValid,
    setIsFieldValid,
}) => {
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{8,}$/;

    return (
        <div className="relative">
            <input
                autoComplete="off"
                id="password"
                name="password"
                type="password"
                className={`peer placeholder-transparent h-10 w-full border-b-2 focus:outline-none ${
                    isFieldValid
                        ? "border-gray-300"
                        : "border-red-600 text-red-600"
                }`}
                placeholder="Password"
                value={state}
                onChange={(e) =>
                    validateField(
                        passwordRegex,
                        e.target.value,
                        setState,
                        setIsFieldValid
                    )
                }
                required
            />
            <label
                htmlFor="password"
                className="absolute left-0 -top-3.5 text-gray-900 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-900 peer-focus:text-sm"
            >
                Mot de passe
            </label>
            <div
                className={`text-xs text-red-700 ${
                    isFieldValid ? "hidden" : ""
                }`}
            >
                Mot de passe invalide: au moins 8 caractères, une majuscule, une
                minuscule, un chiffre et un caractère spécial (*,#,$...)
            </div>
        </div>
    );
};

const SubmitButton: React.FC<ISubmitButton> = ({ buttonText, canSubmit }) => {   
    return (
        <div className="mt-4 relative flex justify-center">
            <button
                id="authSubmitButton"
                className={`bg-cyan-500 text-white rounded-md px-2 py-1 cursor-pointer ${
                    canSubmit ? "" : "opacity-50"
                }`}
                disabled={!canSubmit}
            >
                {buttonText}
            </button>
        </div>
    );
};

export { NameField, EmailField, PasswordField, SubmitButton };
