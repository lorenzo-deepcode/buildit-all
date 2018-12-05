# Dropbox integration

App integration is used for retrieving user's Dropbox ID and link it with
the Icarus identity and Dropbox access token to receive Dropbox events.

A webhook is used to notify changes in user's Dropbox space.

## App setup

App credentials:
* App key: the `DROPBOX_CLIENT_ID` in your environment
* App secret: the `DROPBOX_CLIENT_SECRET` in your environment

OAuth2:

* Redirect URIs: `<frontend-url>/dropbox-post-login`
* Allow implicit grant: Disallow
* Enable Additional Users

Webhooks:

* Webhook URI: `<service-endpoint>/dropbox-webhook`


## Important limitation

A Dropbox App may have only one OAuth redirect URL.
This force having a separate App per application stage (environment).
