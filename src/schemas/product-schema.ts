import z from "zod";

export const CreateProductSchema = z.object({
	name: z.string().min(1, "Nome do produto é obrigatório."),
	description: z.string().nullable().optional(),
	price: z.number().int().nonnegative("O preço não pode ser negativo."),
});

export const GetProductsQuerySchema = z.object({
	limit: z.preprocess(
		(item) => parseInt(z.string().parse(item)),
		z.number().int().positive("Limite deve ser positivo.").optional(),
	),
});

export const ProductSchema = z.object({
	id: z.string(),
	name: z.string().min(1, "O nome do produto é obrigatório."),
	description: z.string().nullable(),
	images: z.array(z.string().url("URL de imagem inválida.")),
	price: z.number().int().nonnegative("O preço não pode ser negativo."),
	currency: z.string().length(3, "A moeda precisa ter 3 caracteres (ex: BRL)."),
});

export type CreateProduct = z.infer<typeof CreateProductSchema>;
export type GetProductsList = z.infer<typeof GetProductsQuerySchema>;
export type ProductType = z.infer<typeof ProductSchema>;
