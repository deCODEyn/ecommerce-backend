/* biome-ignore-all lint/suspicious/noExplicitAny: For ZodError typing issue */
import type { FastifyError, FastifyInstance } from "fastify";
import { ZodError } from "zod";
import type { ErrorType } from "../schemas/error-schema.ts";
import type { FastifyValidationIssue } from "../types/fastify.ts";

export function registerErrorHandler(app: FastifyInstance): void {
	app.setErrorHandler((error, request, reply) => {
		request.log.error(`Erro na rota ${request.method} ${request.url}:`, error);

		if (error instanceof ZodError) {
			const zodError = error as ZodError;
			reply.status(400).send({
				statusCode: 400,
				message: `Erro de validação: ${(zodError as any).errors.map((e: any) => e.message).join("; ")}`,
				errors: (zodError as any).errors.map((issue: any) => ({
					code: issue.code,
					message: issue.message,
					path: issue.path && issue.path.length > 0 ? issue.path : undefined,
				})),
			} as ErrorType);
			return;
		}

		if ((error as FastifyError).validation) {
			const fastifyValidationError = error as FastifyError;

			reply.status(400).send({
				statusCode: 400,
				message: `Erro de validação da requisição: ${fastifyValidationError.message}`,
				errors: (fastifyValidationError.validation || []).map(
					(validationError) => {
						const issue = validationError as FastifyValidationIssue;
						return {
							code: issue.keyword || "VALIDATION_ERROR",
							message: issue.message || "Erro de validação desconhecido",
							path: issue.dataPath ? [issue.dataPath.substring(1)] : undefined,
						};
					},
				),
			} as ErrorType);
			return;
		}

		const statusCode = error.statusCode || 500;
		const errorMessage =
			(error as Error).message || "Ocorreu um erro inesperado no servidor.";

		reply.status(statusCode).send({
			statusCode: statusCode,
			message: errorMessage,
			code: error.code,
		} as ErrorType);
	});
}
