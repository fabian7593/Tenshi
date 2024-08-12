import ConfigManager  from "tenshi/config/ConfigManager";
const config = ConfigManager.getInstance().getConfig();


export function replaceCompanyInfoEmails(htmlTemplate: string): string{
    const htmlBody = htmlTemplate
    .replace(/\{\{ companyDomain \}\}/g, config.COMPANY.LANDING_PAGE)
    .replace(/\{\{ companyName \}\}/g, config.COMPANY.NAME)
    .replace(/\{\{ companyLogo \}\}/g, config.COMPANY.LOGO)
    .replace(/\{\{ mainColor \}\}/g,  config.COMPANY.MAIN_COLOR);

    return htmlBody;
}