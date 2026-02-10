with src as (
  select
    cast(year as int) as year,
    trim(country) as country,
    trim(country_iso) as country_iso
  from {{ source('esc', 'esc_contestants_clean') }}
),

normalized as (
  select
    year,
    country,
    country_iso,
    regexp_replace(
      replace(country, ' ', '_'),
      '[^A-Za-z0-9_]+',
      '',
      'g'
    ) as country_key
  from src
)

select
  concat(country_key, '_', cast(year as text)) as id,   -- e.g. "United_Kingdom_2024"
  year,
  country,
  country_iso
from normalized