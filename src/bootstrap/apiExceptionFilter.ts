import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { CoreError } from '@zalib/core/errors';
import { FastifyReply } from 'fastify';

function sendReplyError(reply: FastifyReply, error: CoreError): void {
  reply.status(error.statusCode).send({ error, success: false });
}

class HttpError extends CoreError {
  public readonly statusCode: number;

  constructor(error: HttpException) {
    super(error.message, error.getResponse());

    this.statusCode = error.getStatus();
  }
}

@Catch()
export class ApiExceptionFilter implements ExceptionFilter {
  public catch(exception: unknown, host: ArgumentsHost): void {
    const reply = host.switchToHttp().getResponse<FastifyReply>();

    if (exception instanceof CoreError) {
      return sendReplyError(reply, exception);
    }

    if (exception instanceof HttpException) {
      return sendReplyError(reply, new HttpError(exception));
    }

    const error =
      exception instanceof Error
        ? new CoreError(exception.message)
        : new CoreError(String(exception));

    return sendReplyError(reply, error);
  }
}
