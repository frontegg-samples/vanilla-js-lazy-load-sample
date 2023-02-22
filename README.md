# :book: Lazy Load Frontegg in VanillaJs Example

This example code demonstrates how to lazy load Frontegg Admin Portal after manual authenticated.

## :inbox_tray: Installation

1) Download and include the loadFronteggJs, getAccessToken, and getAuthenticatedUser, showAdminPortal functions in your
   code.

2) Set up the `FRONTEGG_BASE_URL` and `FRONTEGG_CLIENT_ID` constants to match your Frontegg configuration.

```js
const FRONTEGG_BASE_URL = 'your-frontegg-domain';
const FRONTEGG_CLIENT_ID = 'your-client-id';
```

3) Implement the getAccessToken function to retrieve the authenticated user's access token. For example:

```js
async function getAccessToken() {

  // retieve the authenticated user's access token (JWT)
  return accessToken;
}
```

## :computer: Usage

### showAdminPortal()

This function loads and initializes the Frontegg application using the loadFronteggJs function, retrieves an access token
and authenticated user data, sets the authentication state of the application using
Frontegg.HostedLogin.setAuthentication, and shows the Frontegg admin portal as a modal in the DOM. :tada:
