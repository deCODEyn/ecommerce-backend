import z from "zod";

export const ErrorSchema = z.object({
	statusCode: z.number().int().positive().default(500),
	message: z.string(),
	code: z.string().optional(),
	errors: z
		.array(
			z.object({
				code: z.string(),
				message: z.string(),
				path: z.array(z.union([z.string(), z.number()])).optional(),
			}),
		)
		.optional(),
});

export type ErrorType = z.infer<typeof ErrorSchema>;
