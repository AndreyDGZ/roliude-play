# ADR-007 Media Storage And Streaming

Status: Accepted

Context

The product includes trailers and may include full video playback.

Decision

The MVP may store media URLs, but large media upload, authorization and streaming require a later dedicated storage decision before implementation.

Alternatives considered

Serving large files directly from Express.

Consequences

Do not implement large file streaming through the Node process without a new ADR.

Date

2026-09-21
