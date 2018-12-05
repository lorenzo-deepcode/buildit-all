import { testEnvironmentUrl } from '../config/config';
import {
    IntegrationsPage,
    SlackAuthPage,
    SlackSignInPage,
} from '../pages';

const integrationsPage = new IntegrationsPage();
const slackAuthPage = new SlackAuthPage();
const slackSignInPage = new SlackSignInPage();

fixture `Logout`
    .page(testEnvironmentUrl);

test
    .before(async (t) => {
        integrationsPage.login();
        
        await t.expect(slackSignInPage.domain.innerText).eql('icarus-ai');

        slackSignInPage.login(process.env.SLACK_TEST_USER_ID, process.env.SLACK_TEST_USER_PASSWORD);

        await t.expect(slackAuthPage.form.authorizeButton.exists).ok();
        
        slackAuthPage.authorize();

        await t.expect(integrationsPage.logoutButton.exists).ok();
    })
    ('Logging out', async (t) => {
        integrationsPage.logout();

        await t
            .expect(integrationsPage.logoutButton.exists).notOk()
            .expect(integrationsPage.loginButton.exists).ok();
    });
