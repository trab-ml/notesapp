interface ILogin {
    isLogin: boolean
}

interface IName {
    nameType: string;
    labelValue: string;
    state: string;
    setState: (val: string) => void;
}

interface IOnChange {
    state: string; 
    setState: (val: string) => void;
    isFieldValid: boolean;
    setIsFieldValid: (val: boolean) => void;
}

interface ISubmitButton {
    buttonText: string;
    canSubmit: boolean;
    // onClick: (e: React.FormEvent) => void
}

export {
    ILogin,
    IName,
    IOnChange,
    ISubmitButton
}
