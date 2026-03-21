# ---- Config ----
SHELL := /bin/bash
.ONESHELL:
.DEFAULT_GOAL := help

# Can be overridden in CI: make test PYTHON=3.12
PYTHON ?= python3
CODE ?= .
TEST_DIR ?= tests            # If tests are under app/test, use TEST_DIR=app/test
MYPY_TARGET ?= $(CODE)/app
PYTEST_OPTS ?= -q --maxfail=1 --disable-warnings
COV ?= 1                    # Set to 0 to disable coverage
COV_OPTS := $(if $(filter $(COV),1),--cov=$(CODE) --cov-report=xml,)

# ---- Phonies ----
.PHONY: help sync lint lint-fix format test typecheck check-all

help:
	@echo "make sync        Install/sync dependencies (uv sync)"
	@echo "make lint        Ruff lint checks"
	@echo "make lint-fix    Ruff auto-fix"
	@echo "make format      Ruff formatting"
	@echo "make typecheck   MyPy type checking"
	@echo "make test        Pytest (with coverage, enabled by default in CI)"
	@echo "make check-all   lint + typecheck + test"

sync:
	uv sync --frozen || uv sync   # Use strict lock when uv.lock exists; create one otherwise

lint:
	uv run ruff check $(CODE)

lint-fix:
	uv run ruff check --fix $(CODE)

format:
	uv run ruff format $(CODE)

typecheck:
	uv run mypy $(MYPY_TARGET)

test:
	uv run pytest $(TEST_DIR) $(PYTEST_OPTS) $(COV_OPTS)

check-all: lint typecheck test
	@echo "✅ All checks passed!"
