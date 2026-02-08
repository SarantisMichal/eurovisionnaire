select *
from {{ source('esc', 'esc_contestants_clean') }}