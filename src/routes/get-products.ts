import type { FastifyPluginCallback } from "fastify";
import z from "zod";
import {
	type GetProductsList,
	ProductSchema,
	type ProductType,
} from "../schemas/product-schema.ts";
import { StripeService } from "../services/stripe-service.ts";

export const getProductsList: FastifyPluginCallback = (app) => {
	const stripeService = new StripeService();

	app.get<{ Querystring: GetProductsList; Reply: ProductType[] }>(
		"/api/products",
		async (request, reply) => {
			try {
				const { limit } = request.query;

				app.log.info(`Requisição para /api/products com limit: ${limit}`);
				const products = await stripeService.getProductList(limit);
				z.array(ProductSchema).parse(products);
				reply.status(200).send(products);
			} catch (err) {
				app.log.error(
					(err as Error).message ||
						"Erro interno do servidor. getProductsList.",
				);
				reply.status(500);
			}
		},
	);
};
