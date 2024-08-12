export class ConstRegex {
    public static readonly EMAIL_REGEX: string = "EMAIL_REGEX";
    public static readonly DESCRIPTION_REGEX: string = "DESCRIPTION_REGEX";
    public static readonly PASSWORD_REQUIRED_REGEX: string = "PASSWORD_REQUIRED_REGEX";
    public static readonly LANGUAGE_MAX_LENGHT_REGEX: string = "LANGUAGE_MAX_LENGHT_REGEX";
}


export class ConstUrls{
    public static readonly ACTIVE_USER: string = "active_user/";
    public static readonly CONFIRMATION_REGISTER: string = "confirmation_register/";
    public static readonly FORGOT_PASSWORD_VERIFICATION: string = "verify_forgot_password/";
}

export class ConstTemplate{
    public static readonly REGISTER_EMAIL: string = "registerEmail";
    public static readonly RECOVER_USER_EMAIL: string = "recoverUserByEmail";
    public static readonly FORGOT_PASSWORD_EMAIL: string = "forgotPasswordEmail";
    public static readonly GENERIC_TEMPLATE_EMAIL: string = "genericTemplateEmail";
    public static readonly ACTIVE_ACCOUNT_PAGE: string = "activeAccountPage";
}