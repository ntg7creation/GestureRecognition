import torch
from torch import nn
from python.feedback import send_task_to_frontend, get_latest_feedback


from transformers import BertModel, BertTokenizer
import requests
import time
import json
from python.model import BERTToRotation


closed = 1.57
# 🧠 Define mapping from gesture name to rotation vector (target)
gesture_to_vector_map = {
    "thumbs_up": [0.0, 0.0, 0.0, closed, closed, closed, closed, closed, closed, closed, closed, closed, closed, closed, closed],
    "victory": [closed, closed, closed, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, closed, closed, closed, closed, closed, closed],
    "fist": [closed]*15,  # Full curl on all joints
    "open_hand": [0.0]*15,
    # Add more if needed
}

def gesture_to_vector(name):
    return torch.tensor(gesture_to_vector_map.get(name, [0.0]*15), dtype=torch.float32)

def my_custom_loss(predicted_tensor, ground_truth_tensor):
    return torch.mean((predicted_tensor - ground_truth_tensor) ** 2)


# 📝 Load training samples (input text + expected gesture)
with open("training_pairs.json") as f:
    samples = json.load(f)  # [{"text": "two_finger", "label": "victory"}, ...]

def start_training():
    tokenizer = BertTokenizer.from_pretrained("bert-base-uncased")
    bert = BertModel.from_pretrained("bert-base-uncased")
    bert.eval()

    model = BERTToRotation(output_dim=15)
    optimizer = torch.optim.Adam(model.parameters(), lr=1e-4)
    loss_fn = nn.MSELoss()

    with open("training_pairs.json") as f:
        samples = json.load(f)

    model.train()
    for epoch in range(10):
        print(f"\n[Epoch {epoch + 1}]")
        total_loss = 0.0

        for i, sample in enumerate(samples):
            text = sample["text"]
            label = sample["label"]

            tokens = tokenizer(text, return_tensors="pt", truncation=True, padding="max_length", max_length=10)
            with torch.no_grad():
                pooled = bert(**tokens).pooler_output
            predicted_tensor = model(pooled).squeeze()  # <-- keep this as a tensor!


            # Send prediction and label to frontend
            rotation_vector = predicted_tensor.tolist()
            print(f"[Training] Task sent to frontend: {label}\n{json.dumps(rotation_vector, indent=3)}")
            send_task_to_frontend(rotation_vector, label)

            # Wait for rotation vector
            received_vector = get_latest_feedback()
            
            if received_vector is None:
                print(f"[Warning] No feedback for '{text}'")
                continue

            print(f"[Training] Received rotation from JS: {received_vector}")

            # true_vector = gesture_to_vector(label)  # this is your intended pose
            # actual_vector = torch.tensor(received_vector, dtype=torch.float32)
            # loss = loss_fn(actual_vector, true_vector)  # compare what JS returned to what we expected
            loss = my_custom_loss(predicted_tensor, gesture_to_vector(label))



            total_loss += loss.item()

            optimizer.zero_grad()
            loss.backward()
            optimizer.step()

            print(f"[Training] Label: {label}")
            print(f"[Training] Loss vs label vector: {loss.item():.4f}")        


        print(f"[Epoch {epoch + 1}] avg loss: {total_loss / len(samples):.6f}")

    torch.save(model.state_dict(), "bert_to_rotation_online.pth")
    print("✅ Model saved")
