select *
from {{ source('esc', 'esc_finals_clean') }}