interface ILogin {
    isLogin: boolean
}

interface IName {
    nameType: string; // Prénom, Nom
    placeholder: string;
    labelHtmlFor: string;
    labelValue: string;
}

export {
    ILogin,
    IName
}
