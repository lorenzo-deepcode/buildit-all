import { Selector, t } from 'testcafe';

export class DropboxSignInPage {
    constructor() {
        this.form = {
            header: Selector('.login-header'),
            emailInput: Selector('input').withAttribute('name', 'login_email'),
            passwordInput: Selector('input').withAttribute('name', 'login_password'),
            signInButton: Selector('button').withAttribute('type', 'submit'),
        };
    }

    async login (email, password) {
        await t
            .typeText(this.form.emailInput, email)
            .typeText(this.form.passwordInput, password)
            .click(this.form.signInButton);
    }
}
