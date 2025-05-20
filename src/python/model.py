import torch
from torch import nn
from transformers import BertModel, BertTokenizer
print("[Model] model.py loaded")

class BERTToRotation(nn.Module):
    def __init__(self, output_dim=15):
        super().__init__()
        self.linear = nn.Sequential(
            nn.Linear(768, 256),
            nn.ReLU(),
            nn.Linear(256, output_dim)
        )

    def forward(self, x):
        return self.linear(x)

# Load model & tokenizer
tokenizer = BertTokenizer.from_pretrained("bert-base-uncased")
bert = BertModel.from_pretrained("bert-base-uncased")
bert.eval()

regressor = BERTToRotation(output_dim=15)
import os

# Find the path relative to this file
base_dir = os.path.dirname(__file__)
model_path = os.path.join(base_dir, "bert_to_rotation.pth")

try:
    regressor.load_state_dict(torch.load(model_path))
    print("[Model] Trained weights loaded.")
except Exception as e:
    print("[Model] Failed to load weights:", e)

regressor.eval()

def get_rotations(text):
    inputs = tokenizer(text, return_tensors="pt")
    with torch.no_grad():
        pooled = bert(**inputs).pooler_output
        return regressor(pooled).squeeze().tolist()
