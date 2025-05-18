import torch
from torch import nn
from transformers import BertModel, BertTokenizer

class BERTToRotation(nn.Module):
    def __init__(self, output_dim=21):
        super().__init__()
        self.linear = nn.Sequential(
            nn.Linear(768, 256),
            nn.ReLU(),
            nn.Linear(256, output_dim)
        )

    def forward(self, x):
        return self.linear(x)

# Load everything at module level
tokenizer = BertTokenizer.from_pretrained("bert-base-uncased")
bert = BertModel.from_pretrained("bert-base-uncased")
bert.eval()

regressor = BERTToRotation()
regressor.eval()

def get_rotations(text):
    inputs = tokenizer(text, return_tensors="pt")
    with torch.no_grad():
        bert_output = bert(**inputs).pooler_output
        prediction = regressor(bert_output).squeeze().tolist()
    return prediction
