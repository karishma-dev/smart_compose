from transformers import AutoTokenizer

text = "I love programming in Python!"

tokenizer = AutoTokenizer.from_pretrained("gpt2", use_fast=True)

enc = tokenizer(
    text,
    return_offsets_mapping=True,
    add_special_tokens=False
)

input_ids = enc["input_ids"]
offsets = enc["offset_mapping"]
tokens = tokenizer.convert_ids_to_tokens(input_ids)

print("Original Text: ", repr(text))
print()
print(f"{'idx':>3} {'id':>6} {'token':>15} {'start':>6} {'end':>6}   substring")
print("-" * 60)
for i, (tid, tok, (s, e)) in enumerate(zip(input_ids, tokens, offsets)):
    snippet = text[s:e]
    print(f"{i:3} {tid:6} {tok:15} {s:6} {e:6}   {repr(snippet)}")

print()
print("Detokenized (reconstructed):", repr(tokenizer.decode(input_ids)))