import ollama

result=ollama.embeddings(model='nomic-embed-text', prompt='The sky is blue because of rayleigh scattering')

print(result)