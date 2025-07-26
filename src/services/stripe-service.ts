import Stripe from "stripe";
import { env } from "../env.ts";
import type { ProductType } from "../schemas/product-schema.ts";

const stripe = new Stripe(env.STRIPE_SECRET_KEY || "", { typescript: true });

export class StripeService {
	private mapStripeToProductSchema(
		stripeProduct: Stripe.Product,
	): ProductType | null {
		if (
			!stripeProduct.default_price ||
			typeof stripeProduct.default_price === "string"
		) {
			console.error(
				`Produto ${stripeProduct} não possui default_price expandido.`,
			);
			return null;
		}

		const price = stripeProduct.default_price as Stripe.Price;

		return {
			id: stripeProduct.id,
			name: stripeProduct.name,
			description: stripeProduct.description,
			images: stripeProduct.images,
			price: price.unit_amount || 0,
			currency: price.currency,
		};
	}

	async getProductList(limit?: number): Promise<ProductType[]> {
		try {
			const params: Stripe.ProductListParams = {
				expand: ["data.default_price"],
			};

			if (limit !== undefined && limit > 0) {
				params.limit = limit;
			}

			const products = await stripe.products.list(params);
			const mappedProducts = products.data
				.map((product) => this.mapStripeToProductSchema(product))
				.filter((product): product is ProductType => product !== null);

			return mappedProducts;
		} catch (err) {
			console.error(
				err,
				"Erro ao buscar produtos no StripeService. Por favor, tente novamente mais tarde.",
			);
			throw err;
		}
	}
}
