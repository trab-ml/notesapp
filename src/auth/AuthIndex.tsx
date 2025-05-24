import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import {
    NameField,
    EmailField,
    PasswordField,
    SubmitButton,
} from "../components/atoms/Field";
import { ILogin, IName } from "../types/Form";
import { auth } from "../firebase/firebase";
import {
    createUserWithEmailAndPassword,
    sendEmailVerification,
    signInWithEmailAndPassword,
    updateProfile,
} from "firebase/auth";
import { saveUserProfile } from "../services/NoteService";

/**
 * Reusable component for authentification
 * @param isLogin determine the type of the component (login or registering)
 * @returns
 */
const AuthIndex: React.FC<ILogin> = ({ isLogin }) => {
    const [email, setEmail] = useState("");
    const [isEmailValid, setIsEmailValid] = useState(true);
    const [password, setPassword] = useState("");
    const [isPasswordValid, setIsPasswordValid] = useState(true);
    const [firstnameValue, setFirstnameValue] = useState("");
    const [lastnameValue, setLastnameValue] = useState("");
    const [isFormValid, setIsFormValid] = useState(
        isEmailValid && isPasswordValid
    );

    const firstname: IName = {
        nameType: "firstname",
        labelValue: "Votre prénom (exemple: John)",
        state: firstnameValue,
        setState: setFirstnameValue,
    };

    const lastname: IName = {
        nameType: "lastname",
        labelValue: "Votre nom (exemple: Doe)",
        state: lastnameValue,
        setState: setLastnameValue,
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsFormValid(false);

        try {
            const credential = await signInWithEmailAndPassword(
                auth,
                email,
                password
            );
            const user = credential.user;

            if (user) {
                if (user.emailVerified) {
                    window.location.pathname = "/home";
                } else {
                    alert("Pour vous connecter, veuillez dabord valider votre email!");
                    setIsFormValid(true);
                }
            }
        } catch (error) {
            const errorCode = error.code;
            let errorMessage;

            if (errorCode == "auth/invalid-credential") {
                errorMessage = "Email ou Mot de passe incorrect";
            } else {
                errorMessage = "Service momentanément indisponible.";
            }

            alert(errorMessage);
            setIsFormValid(true);
        }
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const userCredential = await createUserWithEmailAndPassword(
                auth,
                email,
                password
            );
            await updateProfile(userCredential.user, {
                displayName: firstnameValue + " " + lastnameValue,
            });
            await saveUserProfile({uid: userCredential.user.uid, email: userCredential.user.email || ""});

            auth.onAuthStateChanged(function (user) {
                if (user) {
                    sendEmailVerification(user).then(() => {
                        alert("Email de vérification envoyé!");
                        window.location.pathname = "/";
                    });
                }
            });
        } catch (error) {
            const errorCode = error.code;
            let errorMessage;

            if (errorCode == "auth/weak-password") {
                errorMessage = "Mot de passe trop faible.";
            } else if (errorCode == "auth/email-already-in-use") {
                errorMessage = "Adresse email déjà utilisée.";
            } else {
                errorMessage = "Service momentanément indisponible.";
            }

            alert(errorMessage);
        }
    };

    const title = isLogin ? "Se Connecter" : "S'inscrire";

    return (
        <div className="relative py-1 sm:max-w-xl sm:mx-auto">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-sky-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>

            <div className="relative px-2 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
                <div className="max-w-md mx-auto">
                    <div>
                        <h2 className="text-2xl font-semibold text-center">
                            {title}
                        </h2>

                        {isLogin ? (
                            <p className="mt-2 text-center text-sm text-gray-600 max-w md:text-lg">
                                Où{" "}
                                <NavLink
                                    to="/register"
                                    className="font-medium text-blue-600 hover:text-blue-500"
                                >
                                    Créer un compte
                                </NavLink>
                            </p>
                        ) : (
                            ""
                        )}
                    </div>

                    <div className="divide-y divide-gray-200">
                        <div className="py-4 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                            <form
                                onSubmit={
                                    isLogin ? handleLogin : handleRegister
                                }
                            >
                                {!isLogin ? (
                                    <>
                                        <NameField {...firstname} />

                                        {/* space */}
                                        <span className="flex w-full mt-4"></span>

                                        <NameField {...lastname} />

                                        {/* space */}
                                        <span className="flex w-full mt-4"></span>
                                    </>
                                ) : (
                                    ""
                                )}
                                <EmailField
                                    state={email}
                                    setState={setEmail}
                                    isFieldValid={isEmailValid}
                                    setIsFieldValid={setIsEmailValid}
                                />

                                {/* space */}
                                <span className="flex w-full mt-4"></span>

                                <PasswordField
                                    state={password}
                                    setState={setPassword}
                                    isFieldValid={isPasswordValid}
                                    setIsFieldValid={setIsPasswordValid}
                                />
                                <SubmitButton
                                    buttonText={title}
                                    canSubmit={isFormValid}
                                />
                            </form>

                            <div className="flex items-center justify-between gap-1">
                                {/* todo: Pop up pour les mots de passe oubliés! */}
                                {isLogin ? (
                                    <NavLink
                                        to="/forgot-password"
                                        className="md:text-xs font-medium text-blue-600 hover:text-blue-500"
                                    >
                                        Mot de passe oublié?
                                    </NavLink>
                                ) : (
                                    ""
                                )}

                                <NavLink
                                    to="/home"
                                    className="md:text-xs font-medium text-blue-600 hover:text-blue-500"
                                >
                                    Accéder sans compte
                                </NavLink>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthIndex;
