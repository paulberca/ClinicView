import psycopg2
import os
from dotenv import load_dotenv

load_dotenv()

# Connect to the database
conn = psycopg2.connect(
    host=os.getenv("PG_HOST", "localhost"),
    database=os.getenv("PG_DB", "hospital"),
    user=os.getenv("PG_USER", "postgres"),
    password=os.getenv("PG_PASSWORD", "password"),
    port=os.getenv("PG_PORT", 5432)
)

# Create a cursor object
cur = conn.cursor()

# Execute the query to select all users
cur.execute('SELECT * FROM "users";')

# Fetch all results
users = cur.fetchall()

print("Users in the database:")

# Print the users
for user in users:
    print(user)

# Close the cursor and the connection
cur.close()
conn.close()
