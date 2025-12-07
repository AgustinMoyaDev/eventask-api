import { Request, Response, NextFunction, RequestHandler } from 'express'

/**
 * Converts a pure domain method into an Express RequestHandler.
 *
 * - For payload: { ok, status, data }
 * - For void: 204 No Content
 * - For errors: pass the err to next()
 *
 * @template TReq Specific type of the request (default is Request).
 * @template TResBody Type of the response body (default is unknown).
 * @param handler Function that receives (req, res) and returns Promise<TResBody|void>.
 * @param statusCode HTTP code for responses with a body (default is 200).
 * @returns RequestHandler
 */
export function toHandler<TReq extends Request = Request, TResBody = unknown>(
  handler: (req: TReq, res: Response) => Promise<TResBody | void>,
  statusCode: number = 200
): RequestHandler {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // reinterpretamos `req` como TReq
      const result = await handler(req as TReq, res)

      // Si el controlador ya envió la respuesta. Ej: res.cookie() + res.json()
      if (res.headersSent) return

      if (result === undefined) {
        // Para métodos que no retornan payload
        res.sendStatus(204)
        return
      }
      // Payload estándar
      res.status(statusCode).json(result)
    } catch (err) {
      next(err)
    }
  }
}
