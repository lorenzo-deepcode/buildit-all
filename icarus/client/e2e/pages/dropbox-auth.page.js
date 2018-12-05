import { Selector, t } from 'testcafe';

export class DropboxAuthPage {
    constructor() {
        this.appName = Selector('#auth-text .app-name'),
        this.form = {
            authorizeButton: Selector('button').withText('Allow'),
            cancelButton: Selector('button').withText('Cancel'),
        };
    }

    async authorize () {
        await t.click(this.form.authorizeButton);
    }
}
