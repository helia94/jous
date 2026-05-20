import signal
import subprocess
import sys
import time


def start_process(name, args):
    print(f"[runner] starting {name}: {' '.join(args)}", flush=True)
    return subprocess.Popen(args)


def terminate_process(process, name):
    if process.poll() is None:
        print(f"[runner] terminating {name}", flush=True)
        process.terminate()


def kill_process(process, name):
    if process.poll() is None:
        print(f"[runner] killing {name}", flush=True)
        process.kill()


def main():
    telegram_process = start_process("telegram_bot", [sys.executable, "telegram/bot.py"])
    slack_process = start_process("slack_bot", [sys.executable, "slack/bot.py"])
    shutdown_requested = False
    shutdown_started_at = None

    def handle_signal(signum, _frame):
        nonlocal shutdown_requested, shutdown_started_at
        shutdown_requested = True
        shutdown_started_at = time.monotonic()
        print(f"[runner] received signal {signum}, shutting down", flush=True)
        terminate_process(telegram_process, "telegram_bot")
        terminate_process(slack_process, "slack_bot")

    signal.signal(signal.SIGTERM, handle_signal)
    signal.signal(signal.SIGINT, handle_signal)

    processes = {
        "telegram_bot": telegram_process,
        "slack_bot": slack_process,
    }

    while True:
        for name, process in list(processes.items()):
            exit_code = process.poll()
            if exit_code is not None:
                print(f"[runner] {name} exited with code {exit_code}", flush=True)
                del processes[name]

        if not processes:
            return 0 if shutdown_requested else 1

        if shutdown_requested and shutdown_started_at is not None:
            if time.monotonic() - shutdown_started_at >= 5:
                for name, process in processes.items():
                    kill_process(process, name)

        time.sleep(1)


if __name__ == "__main__":
    sys.exit(main())
