import torch
import math
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
        return self.linear(x).view(-1, 5, 3)  # [batch_size, 5 fingers, 3 class logits]

# Load model & tokenizer
tokenizer = BertTokenizer.from_pretrained("bert-base-uncased")
bert = BertModel.from_pretrained("bert-base-uncased")
bert.eval()

regressor = BERTToRotation(output_dim=15)
import os

# Find the path relative to this file
base_dir = os.path.dirname(__file__)
model_path = os.path.join(base_dir, "bert_to_finger_curl.pth")

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
        # return regressor(pooled).squeeze().tolist()

        logits = regressor(pooled)  # shape [1, 5, 3]
        probs = torch.softmax(logits, dim=-1)
        class_indices = torch.argmax(probs, dim=-1).squeeze()  # [5]

        class_to_angle = [math.pi/2, math.pi/4, 0.0]  # Full, Half, No Curl
        per_finger_rotation = [class_to_angle[i] for i in class_indices.tolist()]  # [5]

        # Expand to 15 values (3 bones per finger)
        return [
            0.1, per_finger_rotation[4], per_finger_rotation[4],                        # Thumb (2 bones)
            per_finger_rotation[2], per_finger_rotation[2], per_finger_rotation[2],  # Index
            per_finger_rotation[3], per_finger_rotation[3], per_finger_rotation[3],  # Middle
            per_finger_rotation[1], per_finger_rotation[1], per_finger_rotation[1],  # Ring
            per_finger_rotation[0], per_finger_rotation[0], per_finger_rotation[0],  # Pinky
        ]

        # return [
        # 1.5, 1.5, 0.1,  # Thumb (2 bones)
        # 1.5, 1.5, 1.5,        # Index
        # 1.5, 1.5, 1.5,        # Middle
        # 0, 0, 0,        # Ring
        # 0, 0, 0,        # Pinky
        # ]