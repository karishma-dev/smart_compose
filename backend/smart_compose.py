from fastapi import APIRouter
from pydantic import BaseModel
from transformers import AutoTokenizer, AutoModelForCausalLM
import re

router = APIRouter()

# Loading tokenizer and model
tokenizer = AutoTokenizer.from_pretrained("gpt2", use_fast=True)
model = AutoModelForCausalLM.from_pretrained("gpt2")
# Setting the model to evaulation mode, as we're not training it
model.eval()

class SmartComposeRequest(BaseModel):
	text: str
	max_new_tokens: int = 12
	do_sample: bool = False # greedy by default
	temperature: float = 1.0
	top_k: int = 50
	top_p: float = 0.95

@router.post("/complete")
def complete(req: SmartComposeRequest):
	inputs = tokenizer(req.text, return_tensors="pt", add_special_tokens=False)
	out = model.generate(
		**inputs,
		max_new_tokens=req.max_new_tokens,
		do_sample=req.do_sample,
		temperature=req.temperature,
		top_k=req.top_k,
		top_p=req.top_p,
		pad_token_id=tokenizer.eos_token_id
	)
	input_ids = inputs["input_ids"][0]
	if out is None or out.size(1) <= input_ids.size(0):
		return {"completion": ""}

	generated_ids = out[0][input_ids.size(0):]
	suffix = tokenizer.decode(generated_ids, skip_special_tokens=True, clean_up_tokenization_spaces=False)

	suffix = re.sub(r"\s+", " ", suffix)
	suffix = re.sub(r"\s+[A-Za-z]\s*$", "", suffix)

	return {"completion": suffix}
