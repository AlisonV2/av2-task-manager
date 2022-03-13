import { UnauthorizedError } from '../helpers/ErrorGenerator';

export default class TokenValidator {
  static isUserAuthenticated(user) {
    if (!user) {
      throw new UnauthorizedError('Not authenticated');
    }
  }
}
