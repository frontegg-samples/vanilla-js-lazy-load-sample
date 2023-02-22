/**
 * The base URL for the Frontegg application.
 */
const FRONTEGG_BASE_URL = 'your-frontegg-domain';

/**
 * The client ID for the Frontegg application.
 */
const FRONTEGG_CLIENT_ID = 'your-client-id';

/**
 * Loads the Frontegg JavaScript SDK and initializes the Frontegg application with the given options.
 *
 * @param {Object} options - The options to use when initializing the Frontegg application.
 *
 * @returns {Promise<FronteggApp>} A promise that resolves with the Frontegg application object after the Frontegg JavaScript SDK is loaded and initialized.
 * @throws {Error} An error is thrown if the Frontegg JavaScript SDK fails to load.
 */
function loadFronteggJs(options) {
  return new Promise((resolve, reject) => {
    const fronteggVersion = '6.74.0' // you can set 6.74 for latest patch version

    const script = document.createElement('script');
    script.src = `https://unpkg.com/@frontegg/js@${fronteggVersion}/umd/frontegg.production.min.js`;
    script.onload = () => {
      const fronteggApp = Frontegg.initialize({
        hostedLoginBox: true,
        ...options,
        authOptions: {
          keepSessionAlive: true,
          ...options.authOptions
        },
        contextOptions: {
          baseUrl: FRONTEGG_BASE_URL,
          clientId: FRONTEGG_CLIENT_ID,
        }
      })

      resolve(fronteggApp);
    };
    script.onerror = (e) => {
      // eslint-disable-next-line no-console
      console.log('Failed to load frontegg', e);
      reject(e);
    };
    document.body.append(script);
  })
}


/**

 Retrieves an access token.
 @async
 @function
 @returns {Promise<string>} A promise that resolves with the access token as a string.
 */
async function getAccessToken() {
  throw Error('Not implemented, should return the access token')
}

/**
 * Retrieves the authenticated user data using the provided access token,
 * Extract expires from the access token JWT payload.
 *
 * @param {string} accessToken - The access token for the authenticated user.
 * @returns {Promise<Object>} A promise that resolves with the authenticated user data as an object,
 *                            including the user's access token, the user's JWT payload, the expiration
 *                            timestamp of the access token, and the remaining time until the access
 *                            token expires in milliseconds.
 * @throws {Error} An error is thrown if there is an issue with the network request.
 */
async function getAuthenticatedUser(accessToken) {
  const response = await fetch(`https://${FRONTEGG_BASE_URL}/frontegg/identity/resources/users/v2/me`, {
    "method": "GET",
    "credentials": "include",
    "headers": {
      "accept": "application/json",
      "authorization": `Bearer ${accessToken}`,
      "content-type": "application/json",
    },
  });

  const userData = await response.json();

  // extract the JWT payload to calculate the expireIn
  const jwtPayload = JSON.parse(atob(accessToken.split('.')[1]));
  const expires = jwtPayload.exp * 1000
  const expiresIn = expires - Date.now();
  return {
    ...userData,
    expires,
    expiresIn,
    accessToken
  }
}


async function showAdminPortal() {
  /**
   * Load and initialize the frontegg application as hosted login mode
   */
  const fronteggApp = await loadFronteggJs({});

  const accessToken = await getAccessToken()
  const user = await getAuthenticatedUser(accessToken)

  /**
   * Sets the authentication state of the application.
   * Should be called every time token refreshed / expired / logout
   * @static
   * @param {boolean} isAuthenticated - The authentication status of the user.
   * @param {string} [accessToken] - The access token for the authenticated user.
   * @param {User} [user] - The user object representing the authenticated user.
   */
  Frontegg.HostedLogin.setAuthentication(true, accessToken, user, fronteggApp.name)

  /**
   * Show admin portal of the initialized application
   */
  fronteggApp.showAdminPortal();
}
