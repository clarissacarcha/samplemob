// //@ts-nocheck
// import {onError} from 'apollo-link-error';
// import {fromPromise} from 'apollo-link';

// const getNewToken = async () => {
//   // API call to refresh token
// };

// const errorLink = onError(({graphQLErrors, networkError, operation, forward}) => {
//   if (graphQLErrors) {
//     for (let err of graphQLErrors) {
//       switch (err.extensions.code) {
//         case 'UNAUTHENTICATED':
//           // error code is set to UNAUTHENTICATED
//           // when AuthenticationError thrown in resolver

//           return fromPromise(
//             getNewToken()
//               .then(({accessToken, refreshToken}) => {
//                 // Store the new tokens for your auth link
//                 return accessToken;
//               })
//               .catch((error) => {
//                 // Handle token refresh errors e.g clear stored tokens, redirect to login, ...
//                 return;
//               }),
//           )
//             .filter((value) => Boolean(value))
//             .flatMap(() => {
//               // retry the request, returning the new observable
//               return forward(operation);
//             });
//       }
//     }
//   }
//   if (networkError) {
//     console.log(`[Network error]: ${networkError}`);
//     // if you would also like to retry automatically on
//     // network errors, we recommend that you use
//     // apollo-link-retry
//   }
// });
