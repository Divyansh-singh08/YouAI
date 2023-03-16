//all setup and logic are written here for openAI

import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import { Configuration, OpenAIApi } from "openai";

dotenv.config();
console.log(process.env.OPENAI_API_KEY);
const configuration = new Configuration({
	apiKey: process.env.OPENAI_API_KEY,
});

//instance of openAI
const openai = new OpenAIApi(configuration);

const app = express();

// we need to create the couple of middlewares
app.use(cors());
//this is going to allow us to pass json from fronted to the backend
app.use(express.json());

//need to create dummy root route
//get route received data from the fronted
app.get("/", async (req, res) => {
	res.status(200).send({ message: "Hello form youAI" });
});

//this will help use to allow use body
app.post("/", async (req, res) => {
	console.log("req.body", req.body);
	try {
		const prompt = req.body.prompt;
		
		console.log("prompt", prompt);
		const response = await openai.createCompletion({
			model: "text-davinci-003",
			prompt: `${prompt}`,
			//'"""\nUtil exposes the following:\nutil.openai() -> authenticates & returns the openai module, which has the following functions:\nopenai.Completion.create(\n    prompt="<my prompt>", # The prompt to start completing from\n    max_tokens=123, # The max number of tokens to generate\n    temperature=1.0 # A measure of randomness\n    echo=True, # Whether to return the prompt in addition to the generated completion\n)\n"""\nimport util\n"""\nCreate an OpenAI completion starting from the prompt "Once upon an AI", no more than 5 tokens. Does not include the prompt.\n"""\n',
			temperature: 0,
			max_tokens: 3000,
			top_p: 1,
			frequency_penalty: 0.5,
			presence_penalty: 0,
		});
		// console.log("response is only ", response);
		const responseData = response.data.choices[0].text;
		// console.log("resposeData is here ", responseData);
		res.status(200).send({ bot: responseData });
	} catch (error) {
		// console.log(error);
		res.status(500).send({ error });
	}
});

//new need to take care that our server must take care to listen
app.listen(5000, () =>
	console.log("server is running on port http://localhost:5000")
);
