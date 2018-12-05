import { Selector, t } from 'testcafe';

export class GitHubAuthPage {
    constructor() {
        this.header = Selector('h2'),
        this.form = {
            authorizeButton: Selector('#js-oauth-authorize-btn'),
        };
    }

    async authorize () {
        await t.click(this.form.authorizeButton);
    }
}
