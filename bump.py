#!/usr/bin/env python3
import subprocess
import datetime
import json
import sys
import os


MARKDOWN_TEMPLATE = """
## {{version}} – {{date}}

### Added

- [Short description of a new feature]

### Changed

- [Short description of a change to existing functionality]

### Fixed

- [Short description of a bug fix]
"""


def e_print(*args, **kwargs) -> None:
    print(*args, **kwargs, file=sys.stderr)


def read_version() -> str:
    with open("VERSION.txt", "r", encoding="utf-8") as file:
        return file.read().strip()


def write_version(version: str) -> None:
    with open("VERSION.txt", "w", encoding="utf-8") as file:
        file.write(version)


def bump(current: str, part: str) -> str:
    major, minor, patch = map(int, current.split("."))
    if part == "major":
        major += 1
        minor = 0
        patch = 0
    elif part == "minor":
        minor += 1
        patch = 0
    elif part == "patch":
        patch += 1
    else:
        raise ValueError("use: major / minor /patch")
    return f"{major}.{minor}.{patch}"


def create_changelog(version: str) -> None:
    editor = os.environ.get("EDITOR", "nano")
    today = datetime.date.today()
    formatted = today.strftime("%d-%m-%Y")

    # read current changelog
    with open("CHANGELOG.md", "r", encoding="utf-8") as current_read:
        current_contents = current_read.read()

    # store the current into changelogs/
    with open(f"changelogs/{version}.md", "w", encoding="utf-8") as store_current:
        store_current.write(current_contents)

    # create new changelog
    next_contents = MARKDOWN_TEMPLATE.replace("{{version}}", version).replace(
        "{{date}}", formatted
    )
    with open("CHANGELOG.md", "w", encoding="utf-8") as write_current:
        write_current.write(next_contents)

    # user manually update changelog
    exit_code = subprocess.Popen([editor, "CHANGELOG.md"]).wait()
    if exit_code > 0:
        e_print("🚫 failed to update changelog")


def release_tag(version) -> None:
    subprocess.run(["git", "add", "."])
    subprocess.run(["git", "commit", "-m", f"Release v{version}"])
    subprocess.run(["git", "tag", "-a", f"v{version}", "-m", f"Release v{version}"])
    subprocess.run(["git", "push", "--follow-tags"])


def main() -> None:
    if len(sys.argv) != 2:
        e_print("🚫 usage: python bump.py [major|minor|patch]")
        sys.exit(1)

    part = sys.argv[1]
    current_version = read_version()
    next_version = bump(current_version, part)

    print(f"bumping from {current_version} to {next_version}")
    confirm = input("are you sure? [y/N]")
    if confirm.lower() != "y":
        print("🚫 aborting")
        sys.exit(1)

    write_version(next_version)
    create_changelog(next_version)
    release_tag(next_version)
    print(f"✅ successfully bumped to {next_version}")
    sys.exit(0)


if __name__ == "__main__":
    main()
