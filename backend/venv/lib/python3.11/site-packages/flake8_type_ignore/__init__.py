"""flake8-type-ignore disallows `type: ignore` comments.

A plugin to disallow `type: ignore` comments in typed Python code.
Supports disallowing per error code. Disallows all ignores by default.
"""

from __future__ import annotations

import ast
import importlib.metadata
import re
from typing import Any, Generator, Iterable, Tuple, Type

INVALID_TYPE_IGNORE_COMMENT_ERROR = "TI001 Invalid type: ignore comment: {comment}"
INVALID_CODE_ERROR = "TI002 Invalid type: ignore error code: {code}"

BARE_IGNORE_ERROR = "TI100 Bare type: ignore comments disallowed"
DISALLOWED_CODE_ERROR = "{flake8_code} type: ignore[{code}] comments disallowed"

# Modified from
# https://github.com/python/mypy/blob/e46aa6df6126cf47bea97bf9f94d7cba093d0103/mypy/fastparse.py#L132
TYPE_IGNORE_PATTERN = re.compile(r"(#\s*type:\s*ignore\s*(.*))")
# Built from
# https://github.com/python/mypy/blob/990b6a6f03ad82c10cb8edbe70508b943336f7f3/mypy/errorcodes.py
mypy_error_codes = [
    "attr-defined",
    "name-defined",
    "call-arg",
    "arg-type",
    "call-overload",
    "valid-type",
    "var-annotated",
    "override",
    "return",
    "return-value",
    "assignment",
    "type-arg",
    "type-var",
    "union-attr",
    "index",
    "operator",
    "list-item",
    "dict-item",
    "typeddict-item",
    "has-type",
    "import",
    "no-redef",
    "func-returns-value",
    "abstract",
    "valid-newtype",
    "str-format",
    "str-bytes-safe",
    "exit-return",
    "no-untyped-def",
    "no-untyped-call",
    "redundant-cast",
    "comparison-overlap",
    "no-any-unimported",
    "no-any-return",
    "unreachable",
    "redundant-expr",
    "name-match",
    "syntax",
    "misc",
]

flake8_error_codes = {
    code: f"TI1{str(i).zfill(2)}" for i, code in enumerate(mypy_error_codes, start=1)
}
TAG_PATTERN = re.compile(r"\[([a-z-]+)(,\s*[a-z-]+)*\]")


class TypeIgnoreChecker:
    """Flake8 checker to yield errors on `type: ignore` comments."""

    name = __name__
    version = importlib.metadata.version(__name__)

    def __init__(self, tree: ast.AST, lines: Iterable[str]) -> None:
        """Initialize the object.

        Args:
            tree: Not directly used. This argument ensures that flake8
                will always invoke the plugin.
            lines: Source code to check.
        """
        self._lines = list(lines)
        self._tree = ast.parse("".join(self._lines), type_comments=True)

    def run(self) -> Generator[Tuple[int, int, str, Type[Any]], None, None]:
        """Check the provided source for `type: ignore` comments.

        Yields:
            Tuples containing (line number, column number, an
            ignore-specific error message, and the class type).
        """
        for ignore in self._tree.type_ignores:
            # We don't have access to the column number from the AST
            # here, so find it by searching the relevant line for the
            # type comment.
            line = self._lines[ignore.lineno - 1]
            match = TYPE_IGNORE_PATTERN.search(line)
            # We can safely assert this match, because we're pulling the
            # type ignore from the AST, so we know it already exists.
            assert match
            colno, _ = match.span(1)
            # Only capture type: ignore comments, not additional
            # comments that follow them on the same line.
            tag = ignore.tag.split("#", 1)[0].strip()
            # The tag is the specific code included in a type: ignore
            # comment such as [misc] or [arg-type, attr-defined].
            if tag:
                matched_error_codes = TAG_PATTERN.search(tag)
                # This section raises specific errors for each ignore
                # code specified, or a generic invalid code error if the
                # one listed is not a valid error code supported by
                # mypy.
                if matched_error_codes:
                    error_codes = [
                        code.strip()
                        for code in matched_error_codes.group(0)
                        .lstrip("[")
                        .rstrip("]")
                        .split(",")
                    ]
                    for code in error_codes:
                        if code in mypy_error_codes:
                            message = DISALLOWED_CODE_ERROR.format(
                                flake8_code=flake8_error_codes[code],
                                code=code,
                            )
                        else:
                            message = INVALID_CODE_ERROR.format(code=code)
                        yield ignore.lineno, colno, message, type(self)
                # If an ignore tag is found, but no error codes match,
                # the type comment is invalid.
                else:
                    yield (
                        ignore.lineno,
                        colno,
                        INVALID_TYPE_IGNORE_COMMENT_ERROR.format(
                            comment=match.group(1)
                        ),
                        type(self),
                    )
            # If we don't have a tag at all, it's a type: ignore comment
            # without any additional specificity.
            else:
                yield ignore.lineno, colno, BARE_IGNORE_ERROR, type(self)
