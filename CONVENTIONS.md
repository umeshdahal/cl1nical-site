# Project Conventions

## Language & Runtime
- Python 3.13
- Windows environment

## Code Style
- Clean and minimal — no unnecessary comments or boilerplate
- Short, focused functions that do one thing
- Descriptive variable names over comments
- No dead code, no commented-out blocks

## Structure
- Keep scripts self-contained where possible
- Config/constants at the top of the file in ALL_CAPS
- Load secrets from environment variables, never hardcode them
- Use `if __name__ == "__main__":` entry point always

## Dependencies
- Prefer stdlib over third-party where reasonable
- Use `requests` for HTTP, `yfinance` for stocks, `pygame` for graphics
- Keep requirements minimal

## Error Handling
- Always wrap external calls (APIs, file IO) in try/except
- Print clear error messages with timestamp
- Fail gracefully, never silently

## Output
- Use f-strings for all string formatting
- Timestamps in format: `%H:%M:%S` for logs, `%Y-%m-%d %H:%M:%S` for full
- Discord webhooks for notifications

## Git
- Small focused commits
- Clear commit messages describing what changed and why