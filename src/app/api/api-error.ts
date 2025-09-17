import { NextResponse } from "next/server";

export class ApiError {
  private static sendresponse(
    status: number,
    msg: string,
    details?: Record<string, any>
  ) {
    return NextResponse.json(
      { error: msg, details: details },
      { status: status }
    );
  }

  public static internalServer(err: Error, context?: string) {
    console.error(`error: ${context || ""} - ${err}`);
    return this.sendresponse(
      500,
      "the server encountered a problem and could not process your request"
    );
  }

  public static unauthorized(msg: string) {
    return this.sendresponse(401, msg);
  }

  public static unprocessableEntity(
    msg: string,
    details?: Record<string, any>
  ) {
    return this.sendresponse(422, msg, details);
  }

  public static badRequest(msg: string) {
    return this.sendresponse(400, msg);
  }
}
