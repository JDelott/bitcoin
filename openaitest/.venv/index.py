import openai
from dotenv import load_dotenv
import os

load_dotenv()

openai.api_key = os.getenv("OPENAI_API_KEY")


def get_chat_completion(prompt, model="gpt-3.5-turbo"):
    # Creating a message as required by the API
    messages = [{"role": "user", "content": prompt}]

    # Calling the ChatCompletion API
    response = openai.ChatCompletion.create(
        model=model,
        messages=messages,
        temperature=0.7,
    )

    # Returning the extracted response
    generated_content = response.choices[0].message["content"]

    return {
        "prompt": prompt,
        "generated_content": generated_content,
    }


# Take user input for the subject
subject = input("Enter the subject for flashcards: ")

num_flashcards = int(input("Enter number of flashcards to generate:"))

# Example prompt with user-provided subject
prompt = f"Generate a flashcard for {subject}"

# Call the function to get chat completion
flashcards = []
for _ in range(num_flashcards):
    response = get_chat_completion(prompt)
    flashcards.append(response)

# Print the response
# print("Generated Flashcards")
# for idx, card in enumerate(flashcards, start=1):
#     print(f"{idx}.{card}")

import json

json_body = json.dumps(flashcards, indent=2)

second_flashcard_generated_content = flashcards[1]["generated_content"]

print("\nGenerated Content of the Second Flashcard:")
print(second_flashcard_generated_content)

# Print the JSON-encoded string
print("\nJSON Body:")
print(json_body)
