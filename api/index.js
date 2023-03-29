import { Configuration, OpenAIApi } from "openai";
import dotenv from 'dotenv'
import path from 'path';
import readlineSync from "readline-sync";

dotenv.config({ path: path.resolve(process.cwd(), "./.env") })
  
const runCompletion = async () => {

    try {
        const history = []; 
        while (true) {
            
            const input = readlineSync.question("Your input: ");
            
            const messages = [];
            for (const [input_text, completion_text] of history) {
                messages.push({ role: "user", content: input_text });
                messages.push({ role: "assistant", content: completion_text });
            }

                messages.push({ role: "user", content: input });

                const configuration = new Configuration({
                    apiKey: process.env.OPENAI_API_KEY,
                });
                const openai = new OpenAIApi(configuration);
                
                const completion = await openai.createChatCompletion({
                    model: "gpt-3.5-turbo",
                    messages: messages,
                });

                const completion_text = completion.data.choices[0].message.content;
                console.log(completion_text);

                history.push([input, completion_text]);

                const user_input_again = readlineSync.question("\n Want to continue conversation? (Y/N)");
                if (user_input_again.toUpperCase() === "N") {
                    return;
                } else if (user_input_again.toUpperCase() !== "Y") {
                    console.log("Invalid input. Please enter 'Y' or 'N'.");
                    return;
                }
            }

        } catch (error) {
            if (error.response) {
            console.log(error.response);
            } else {
            console.log(error.message);
            }
        }
    }

runCompletion()