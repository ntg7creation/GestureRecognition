import torch
from torch import nn
from torch.utils.data import Dataset, DataLoader
from transformers import BertModel, BertTokenizer
import json
from model import BERTToRotation

class GestureDataset(Dataset):
    def __init__(self, path, tokenizer):
        with open(path, "r") as f:
            self.samples = json.load(f)
        self.tokenizer = tokenizer

    def __len__(self):
        return len(self.samples)

    def __getitem__(self, idx):
        gesture = self.samples[idx]["gesture"]
        target = torch.tensor(self.samples[idx]["rotation_vector"], dtype=torch.float32)
        tokens = self.tokenizer(
            gesture,
            return_tensors="pt",
            padding="max_length",
            truncation=True,
            max_length=10,
        )
        return {
            "input_ids": tokens["input_ids"].squeeze(0),
            "attention_mask": tokens["attention_mask"].squeeze(0),
            "target": target
        }

def train(model, bert, tokenizer, path="../../public/gesture_dataset_arr(15).json", epochs=30):
    dataset = GestureDataset(path, tokenizer)
    dataloader = DataLoader(dataset, batch_size=4, shuffle=True)
    optimizer = torch.optim.Adam(model.parameters(), lr=1e-4)
    loss_fn = nn.MSELoss()

    model.train()
    for epoch in range(epochs):
        total_loss = 0.0
        for batch in dataloader:
            with torch.no_grad():
                pooled = bert(
                    input_ids=batch["input_ids"],
                    attention_mask=batch["attention_mask"]
                ).pooler_output
            pred = model(pooled)
            loss = loss_fn(pred, batch["target"])

            optimizer.zero_grad()
            loss.backward()
            optimizer.step()

            total_loss += loss.item()

        print(f"Epoch {epoch + 1}: Loss = {total_loss / len(dataloader):.6f}")

    torch.save(model.state_dict(), "bert_to_rotation.pth")
    print("[Train] Model saved to bert_to_rotation.pth")

if __name__ == "__main__":
    tokenizer = BertTokenizer.from_pretrained("bert-base-uncased")
    bert = BertModel.from_pretrained("bert-base-uncased")
    bert.eval()

    model = BERTToRotation(output_dim=15)
    train(model, bert, tokenizer)
