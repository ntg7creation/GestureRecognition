import queue
import time

task_queue = queue.Queue()
feedback_queue = queue.Queue()

def send_task_to_frontend(rotation_vector, label):
    task_queue.put((rotation_vector, label))

def get_task_for_frontend():
    if task_queue.empty():
        return None
    return task_queue.get()

def add_detected_gesture(gesture):
    feedback_queue.put(gesture)

def get_latest_feedback(timeout=10):
    start_time = time.time()
    while time.time() - start_time < timeout:
        try:
            return feedback_queue.get(timeout=0.1)
        except queue.Empty:
            continue
    return None
