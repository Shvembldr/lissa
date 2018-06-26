import { createError } from 'apollo-errors';

export const UnknownError = createError('UnknownError', {
  message: 'An unknown error has occurred.  Please try again later'
});

export const UserDoesNotExistError = createError('DoesNotExistError', {
  message: 'User does not exist'
});

export const WrongPasswordError = createError('WrongPasswordError', {
  message: 'Wrong password'
});

export const ForbiddenError = createError('ForbiddenError', {
  message: 'You must be an admin to do this'
});

export const AuthenticationRequiredError = createError(
  'AuthenticationRequiredError',
  {
    message: 'You must be logged in to do this'
  }
);

export const NoWorkerError = createError('NoWorkerError', {
  message: 'Wrong worker id'
});

export const ServerError = createError('ServerError', {
  message: 'Server error occurred while processing your request'
});
