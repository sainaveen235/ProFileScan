export class AppError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public isOperational: boolean = true
  ) {
    super(message);
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export function handleError(error: unknown) {
  console.error("Error:", error);

  if (error instanceof AppError) {
    return {
      error: error.message,
      statusCode: error.statusCode,
      isOperational: error.isOperational,
    };
  }

  if (error instanceof Error) {
    return {
      error: process.env.NODE_ENV === "development" ? error.message : "An unexpected error occurred",
      statusCode: 500,
      isOperational: false,
    };
  }

  return {
    error: "An unexpected error occurred",
    statusCode: 500,
    isOperational: false,
  };
}

export function createErrorResponse(error: unknown) {
  const errorData = handleError(error);
  return {
    success: false,
    error: errorData.error,
    statusCode: errorData.statusCode,
  };
} 