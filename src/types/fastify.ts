import type { FastifySchemaValidationError } from "fastify/types/schema.js";

export interface FastifyValidationIssue extends FastifySchemaValidationError {
	keyword: string;
	dataPath?: string;
	message?: string;
}
