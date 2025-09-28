export const ErrorType = {
  AUTHENTICATION_ERROR: 'AUTHENTICATION_ERROR',
  AUTHORIZATION_ERROR: 'AUTHORIZATION_ERROR',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  NOT_FOUND_ERROR: 'NOT_FOUND_ERROR',
  SERVER_ERROR: 'SERVER_ERROR',
  NETWORK_ERROR: 'NETWORK_ERROR',
  UNKNOWN_ERROR: 'UNKNOWN_ERROR'
} as const;

export type ErrorType = typeof ErrorType[keyof typeof ErrorType];

export interface AppError {
  type: ErrorType;
  message: string;
  statusCode?: number;
  details?: any;
}

export class ErrorHandler {
  static handleError(error: any): AppError {
    console.error('Error caught:', error);

    if (error.message?.includes('fetch')) {
      return {
        type: ErrorType.NETWORK_ERROR,
        message: 'Network connection failed. Please check your internet connection.',
        statusCode: 0
      };
    }

    if (error.message?.includes('HTTP')) {
      const statusMatch = error.message.match(/HTTP (\d+)/);
      const statusCode = statusMatch ? parseInt(statusMatch[1]) : 500;
      
      switch (statusCode) {
        case 400:
          return {
            type: ErrorType.VALIDATION_ERROR,
            message: 'Invalid request. Please check your input.',
            statusCode: 400
          };
        case 401:
          return {
            type: ErrorType.AUTHENTICATION_ERROR,
            message: 'You are not authenticated. Please log in.',
            statusCode: 401
          };
        case 403:
          return {
            type: ErrorType.AUTHORIZATION_ERROR,
            message: 'You do not have permission to perform this action.',
            statusCode: 403
          };
        case 404:
          return {
            type: ErrorType.NOT_FOUND_ERROR,
            message: 'The requested resource was not found.',
            statusCode: 404
          };
        case 500:
          return {
            type: ErrorType.SERVER_ERROR,
            message: 'Internal server error. Please try again later.',
            statusCode: 500
          };
        default:
          return {
            type: ErrorType.UNKNOWN_ERROR,
            message: `Server returned error ${statusCode}`,
            statusCode
          };
      }
    }

    return {
      type: ErrorType.UNKNOWN_ERROR,
      message: error.message || 'An unexpected error occurred',
      details: error
    };
  }

  static getErrorMessage(error: AppError): string {
    return error.message;
  }

  static shouldRedirectToLogin(error: AppError): boolean {
    return error.type === ErrorType.AUTHENTICATION_ERROR;
  }

  static shouldShowErrorPage(error: AppError): boolean {
    return error.type === ErrorType.SERVER_ERROR;
  }
}