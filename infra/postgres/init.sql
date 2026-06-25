-- StreetEats Live — base DB init
-- Enables PostGIS for geospatial "vendors near me" queries.
CREATE EXTENSION IF NOT EXISTS postgis;
-- pgvector for "similar vendors" / taste embeddings (Phase 3).
-- CREATE EXTENSION IF NOT EXISTS vector;

-- Schemas are created per-service during Phase 1.
