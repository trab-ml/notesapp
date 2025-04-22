import React from "react";
import { ISubmitButton } from "../../../types/ISubmitButton";
import { IName, IOnChange } from "../../../types/Form";

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
                required
            />
            <label
                htmlFor={nameInfos.nameType}
                className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm"
            >
                {nameInfos.labelValue}
            </label>
        </div>
    );
};

const EmailField: React.FC<IOnChange> = ({state, setState}) => {
    return (
        <div className="relative">
            <input
                autoComplete="on"
                id="email"
                name="email"
                type="text"
                className="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:borer-rose-600"
                placeholder="Email address"
                value={state}
                onChange={(e) => setState(e.target.value)}
                required
            />
            <label
                htmlFor="email"
                className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm"
            >
                Addresse email
            </label>
        </div>
    );
};

const PasswordField: React.FC<IOnChange> = ({state, setState}) => {
    return (
        <div className="relative">
            <input
                autoComplete="off"
                id="password"
                name="password"
                type="password"
                className="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:borer-rose-600"
                placeholder="Password"
                value={state}
                onChange={(e) => setState(e.target.value)}
                required
            />
            <label
                htmlFor="password"
                className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm"
            >
                Mot de passe
            </label>
        </div>
    );
};

const SubmitButton: React.FC<ISubmitButton> = ({ buttonText }) => {
    return (
        <div className="mt-4 relative flex justify-center">
            <button className="bg-cyan-500 text-white rounded-md px-2 py-1 cursor-pointer">
                {buttonText}
            </button>
        </div>
    );
};

export { NameField, EmailField, PasswordField, SubmitButton };
