

CREATE TABLE posts (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_user FOREIGN KEY(user_id) REFERENCES users(id)
);
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
ALTER TABLE sections ALTER COLUMN id SET DEFAULT gen_random_uuid();

CREATE INDEX idx_posts_user_id ON posts(user_id);

CREATE TABLE sections (
    id UUID PRIMARY KEY,
    post_id INTEGER NOT NULL,
    section_type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    position INT NOT NULL,
    CONSTRAINT fk_post FOREIGN KEY(post_id) REFERENCES posts(id)
);

CREATE INDEX idx_sections_post_id ON sections(post_id);

CREATE TABLE text_sections (
    id UUID PRIMARY KEY,
    section_id UUID NOT NULL,
    content TEXT NOT NULL,
    CONSTRAINT fk_section_text FOREIGN KEY(section_id) REFERENCES sections(id)
);

CREATE INDEX idx_text_sections_section_id ON text_sections(section_id);

CREATE TABLE media_sections (
    id UUID PRIMARY KEY,
    section_id UUID NOT NULL,
    media_url VARCHAR(255) NOT NULL,
    caption VARCHAR(255),
    media_type VARCHAR(50) NOT NULL,
    CONSTRAINT fk_section_media FOREIGN KEY(section_id) REFERENCES sections(id)
);

CREATE INDEX idx_media_sections_section_id ON media_sections(section_id);

CREATE TABLE table_sections (
    id UUID PRIMARY KEY,
    section_id UUID NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    CONSTRAINT fk_section_table FOREIGN KEY(section_id) REFERENCES sections(id)
);

CREATE INDEX idx_table_sections_section_id ON table_sections(section_id);

CREATE TABLE table_rows (
    id UUID PRIMARY KEY,
    table_section_id UUID NOT NULL,
    position INT NOT NULL,
    CONSTRAINT fk_table_rows FOREIGN KEY(table_section_id) REFERENCES table_sections(id)
);

CREATE INDEX idx_table_rows_section_id ON table_rows(table_section_id);

CREATE TABLE table_columns (
    id UUID PRIMARY KEY,
    table_section_id UUID NOT NULL,
    name VARCHAR(100) NOT NULL,
    position INT NOT NULL,
    CONSTRAINT fk_table_columns FOREIGN KEY(table_section_id) REFERENCES table_sections(id)
);

CREATE INDEX idx_table_columns_section_id ON table_columns(table_section_id);

CREATE TABLE table_cells (
    id UUID PRIMARY KEY,
    row_id UUID NOT NULL,
    column_id UUID NOT NULL,
    content TEXT,
    CONSTRAINT fk_table_cells_row FOREIGN KEY(row_id) REFERENCES table_rows(id),
    CONSTRAINT fk_table_cells_column FOREIGN KEY(column_id) REFERENCES table_columns(id)
);

CREATE INDEX idx_table_cells_row_id ON table_cells(row_id);
CREATE INDEX idx_table_cells_column_id ON table_cells(column_id);

CREATE TABLE categories (
    id UUID PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT
);

CREATE TABLE post_categories (
    post_id INTEGER NOT NULL,
    category_id UUID NOT NULL,
    PRIMARY KEY(post_id, category_id),
    CONSTRAINT fk_post_categories_post FOREIGN KEY(post_id) REFERENCES posts(id),
    CONSTRAINT fk_post_categories_category FOREIGN KEY(category_id) REFERENCES categories(id)
);

CREATE INDEX idx_post_categories_post_id ON post_categories(post_id);
CREATE INDEX idx_post_categories_category_id ON post_categories(category_id);

CREATE TABLE tags (
    id UUID PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE post_tags (
    post_id INTEGER NOT NULL,
    tag_id UUID NOT NULL,
    PRIMARY KEY(post_id, tag_id),
    CONSTRAINT fk_post_tags_post FOREIGN KEY(post_id) REFERENCES posts(id),
    CONSTRAINT fk_post_tags_tag FOREIGN KEY(tag_id) REFERENCES tags(id)
);

CREATE INDEX idx_post_tags_post_id ON post_tags(post_id);
CREATE INDEX idx_post_tags_tag_id ON post_tags(tag_id);
