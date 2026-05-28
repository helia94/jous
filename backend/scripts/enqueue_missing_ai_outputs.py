from backend.outbound.queue.tasks.translation_task import retry_missing_question_ai_outputs


if __name__ == "__main__":
    result = retry_missing_question_ai_outputs.delay()
    print(f"Queued retry_missing_question_ai_outputs task: {result.id}")
