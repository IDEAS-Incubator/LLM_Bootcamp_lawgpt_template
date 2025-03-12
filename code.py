import ollama

user_query = "hey"
system_prompt = """
You are chatbot
"""

response = ollama.chat(
    model='llama2', 
    messages=[
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": user_query}
    ]
)
response_json=response['message']['content']

print(response_json)
