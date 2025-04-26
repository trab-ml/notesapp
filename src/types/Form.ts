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

export {
    ILogin,
    IName,
    IOnChange
}
