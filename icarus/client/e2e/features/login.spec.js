import { testEnvironmentUrl } from '../config/config';
import {
    IntegrationsPage,
    SlackAuthPage,
    SlackSignInPage,
} from '../pages';
import {
    getBaseUrl,
    getQueryString,
} from '../utils/helpers';

const integrationsPage = new IntegrationsPage();
const slackAuthPage = new SlackAuthPage();
const slackSignInPage = new SlackSignInPage();

fixture `Login`
    .page(testEnvironmentUrl);

test('Login should navigate to the Slack Sign In page if the given user is not logged into Slack', async (t) => {
    integrationsPage.login();

    await t.expect(slackSignInPage.domain.innerText).eql('icarus-ai');

    const baseUrl = await getBaseUrl();
    const redir = await getQueryString('redir');
    const redirectUri = await getQueryString('redirect_uri', decodeURIComponent(redir));
        
    await t
        .expect(baseUrl).eql('https://icarus-ai.slack.com/')
        .expect(decodeURIComponent(redirectUri)).eql(`${testEnvironmentUrl}/post-login`);
});

test
    .before(async (t) => {
        integrationsPage.login();
        
        await t.expect(slackSignInPage.domain.innerText).eql('icarus-ai');

        slackSignInPage.login(process.env.SLACK_TEST_USER_ID, process.env.SLACK_TEST_USER_PASSWORD);

        await t.expect(slackAuthPage.form.cancelButton.exists).ok();
        
        slackAuthPage.cancel();

        await t
            .navigateTo(testEnvironmentUrl)
            .expect(integrationsPage.loginButton.exists).ok();
    })
    ('Login should work via authorization through Slack if the given user is logged into Slack', async (t) => {
        integrationsPage.login();

        await t.expect(slackAuthPage.form.authorizeButton.exists).ok();

        slackAuthPage.authorize();

        await t.expect(integrationsPage.logoutButton.exists).ok();
    });
