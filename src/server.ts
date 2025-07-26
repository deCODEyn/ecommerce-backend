import fastifyCors from "@fastify/cors";
import fastify from "fastify";
import {
	serializerCompiler,
	validatorCompiler,
	type ZodTypeProvider,
} from "fastify-type-provider-zod";
import { env } from "./env.ts";
import { getProductsList } from "./routes/get-products.ts";
import { registerErrorHandler } from "./utils/error-handler.ts";

const app = fastify({
	logger: {
		level: "info",
	},
	disableRequestLogging: true,
}).withTypeProvider<ZodTypeProvider>();

app.register(fastifyCors, {
	origin: [],
});

app.setSerializerCompiler(serializerCompiler);
app.setValidatorCompiler(validatorCompiler);

registerErrorHandler(app);

//Plugins

//Routs
app.get("/api/health", () => {
	return "Health check API: response OK";
});
//GET
app.register(getProductsList);

//Start Server
async function start() {
	try {
		await app.listen({ port: env.PORT });
		console.log(`Servidor rodando na porta ${env.PORT}`);
	} catch (err) {
		app.log.error(err);
		process.exit(1);
	}
}

start();
