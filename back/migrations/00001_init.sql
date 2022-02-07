-- +goose Up
-- +goose StatementBegin
CREATE TABLE public.items
(
    id serial NOT NULL,
    title character varying(32) NOT NULL,
    description character varying(100) NOT NULL,
    quantity integer NOT NULL,
    purchased boolean NOT NULL DEFAULT false,
    PRIMARY KEY (id)
);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE public.items
-- +goose StatementEnd
