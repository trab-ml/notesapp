import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import {
    NameField,
    EmailField,
    PasswordField,
    SubmitButton,
} from "../components/ui/form/Field";
import { ILogin, IName } from "../types/Form";
import { auth } from "../firebase/firebase";
import {
    createUserWithEmailAndPassword,
    sendEmailVerification,
    signInWithEmailAndPassword,
    updateProfile,
} from "firebase/auth";
import { useAuth } from "../hooks/useAuth";

// : React.FC<(val: boolean) => void>
const toggleAuthSubmitButton = (val) => {
    // document.getElementById("authSubmitButton").disabled = true;
    const targetButton = document.getElementById("authSubmitButton");

    if (targetButton) {
        targetButton.setAttribute("disabled", val.toString());
        targetButton.style.opacity = val == false ? "1" : "0.5";
    }
};

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
    const { user, loading } = useAuth();

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

    useEffect(() => {
        console.log("First load");
        toggleAuthSubmitButton(false);
    }, []);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        toggleAuthSubmitButton(true); // désactiver pendant quelques s // réactiver après (tps de vérifier validation de l'email)!

        try {
            await signInWithEmailAndPassword(auth, email, password);

            // auth.onAuthStateChanged(function (user) {
            //     if (user) {
            //         // User have an account!
            //         console.log("email verified?:" + user.emailVerified);

            //         if (user.emailVerified) {
            //             sendEmailVerification(user).then(() => {
            //                 alert(
            //                     "To login to your account, first verify your email!"
            //                 );
            //             });
            //         }
            //     } else {
            //         // User is signed out.
            //         console.log("No user signed in!");
            //     }
            // });
            // or

            if (user) {
                console.log("User have an account");

                if (!user.emailVerified) {
                    sendEmailVerification(user).then(() => {
                        alert(
                            "To login to your account, first verify your email!"
                        );
                    });
                } else {
                    window.location.pathname = "/home";
                }
            }

            // console.log("User logged in successfully");
        } catch (error) {
            const errorCode = error.code;
            let errorMessage;

            if (errorCode == "auth/invalid-credential") {
                errorMessage = "Email ou Mot de passe incorrect";
            } else {
                errorMessage = error.message;
            }

            alert(errorMessage);

            console.error("Error logging in:", error);

            // toggleAuthSubmitButton(false);
            window.location.pathname = "/";
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

            auth.onAuthStateChanged(function (user) {
                if (user) {
                    // User is signed in.
                    const displayName = user.displayName;
                    const email = user.email;
                    const emailVerified = user.emailVerified;
                    const photoURL = user.photoURL;
                    const isAnonymous = user.isAnonymous;
                    const uid = user.uid;
                    const providerData = user.providerData;

                    console.log(
                        displayName +
                            " " +
                            email +
                            " " +
                            emailVerified +
                            " " +
                            photoURL +
                            " " +
                            isAnonymous +
                            " " +
                            uid +
                            " " +
                            providerData
                    );

                    sendEmailVerification(user).then(() => {
                        alert("Email verification sent!");
                        window.location.pathname = "/";
                    });
                } else {
                    // User is signed out.
                    console.log("No user signed in!");
                }
            });

            // console.log("User registered successfully");
        } catch (error) {
            const errorCode = error.code;
            let errorMessage;

            if (errorCode == "auth/weak-password") {
                errorMessage = "The password is too weak.";
            } else if (errorCode == "auth/email-already-in-use") {
                errorMessage = "This email is already used.";
            } else {
                // errorMessage = "Service momentanément indisponible.";
                errorMessage = error.message;
            }

            alert(errorMessage);

            console.error("Error registering user:", error);
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
                                    canSubmit={isEmailValid && isPasswordValid}
                                    // onClick={isLogin ? handleLogin : handleRegister}
                                />
                            </form>

                            <div className="flex items-center justify-between gap-1">
                                {/* Pop up pour les mots de passe oubliés! */}
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
