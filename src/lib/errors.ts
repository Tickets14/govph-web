export type ErrorCode =
  | "NOT_FOUND"
  | "ALREADY_EXISTS"
  | "VALIDATION_ERROR"
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "INTERNAL_ERROR";

export class AppError extends Error {
  public readonly code: ErrorCode;
  public readonly statusCode: number;
  public readonly context?: Record<string, unknown>;

  constructor(
    message: string,
    code: ErrorCode,
    statusCode = 400,
    context?: Record<string, unknown>
  ) {
    super(message);
    this.name = "AppError";
    this.code = code;
    this.statusCode = statusCode;
    this.context = context;
    // Restore prototype chain (required when extending Error in TS)
    Object.setPrototypeOf(this, new.target.prototype);
  }

  // ── Factory helpers ──────────────────────────────────────────────────────

  static notFound(resource: string, id?: string): AppError {
    const msg = id
      ? `${resource} with id "${id}" not found`
      : `${resource} not found`;
    return new AppError(msg, "NOT_FOUND", 404, { resource, id });
  }

  static notFoundBySlug(resource: string, slug: string): AppError {
    return new AppError(
      `${resource} with slug "${slug}" not found`,
      "NOT_FOUND",
      404,
      { resource, slug }
    );
  }

  static alreadyExists(resource: string, field: string, value: string): AppError {
    return new AppError(
      `${resource} with ${field} "${value}" already exists`,
      "ALREADY_EXISTS",
      409,
      { resource, field, value }
    );
  }

  static validation(message: string, context?: Record<string, unknown>): AppError {
    return new AppError(message, "VALIDATION_ERROR", 422, context);
  }

  static unauthorized(message = "Unauthorized"): AppError {
    return new AppError(message, "UNAUTHORIZED", 401);
  }

  static forbidden(message = "Forbidden"): AppError {
    return new AppError(message, "FORBIDDEN", 403);
  }

  static internal(message = "An unexpected error occurred"): AppError {
    return new AppError(message, "INTERNAL_ERROR", 500);
  }

  isAppError(): this is AppError {
    return true;
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      statusCode: this.statusCode,
      context: this.context,
    };
  }
}

/** Narrows an unknown throw to AppError or re-throws as a wrapped AppError. */
export function toAppError(err: unknown): AppError {
  if (err instanceof AppError) return err;
  if (err instanceof Error)
    return new AppError(err.message, "INTERNAL_ERROR", 500);
  return AppError.internal(String(err));
}
