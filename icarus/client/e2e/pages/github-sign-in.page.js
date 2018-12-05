import { Selector, t } from 'testcafe';

export class GitHubSignInPage {
    constructor() {
        this.form = {
            header: Selector('form p'),
            loginInput: Selector('#login_field'),
            passwordInput: Selector('#password'),
            signInButton: Selector('input').withAttribute('type', 'submit'),
        };
    }

    async login (login, password) {
        await t
            .typeText(this.form.loginInput, login)
            .typeText(this.form.passwordInput, password)
            .click(this.form.signInButton);
    }
}
